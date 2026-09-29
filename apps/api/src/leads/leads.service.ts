import { Inject, Injectable, Logger } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { leadCreateSchema, type LeadCreate, type LeadCreatedResponse } from '@comtech/contracts';
import { ANONYMOUS_USER_ID, newId, nextCode, Prisma } from '@comtech/db';
import { APP_CONFIG, type AppConfig } from '../config';
import { ApiException } from '../common/http';
import { PrismaService } from '../prisma.service';

export const LEAD_ENDPOINT = 'POST /api/v1/public/leads';

export interface LeadRequestContext {
  idempotencyKey: string | undefined;
  ip: string | undefined;
  requestId: string;
}

export interface LeadResult {
  status: 201;
  body: LeadCreatedResponse;
  replayed: boolean;
}

/**
 * Tiếp nhận lead từ website (SPEC 7.1, 34.3).
 * Toàn bộ quy tắc nghiệp vụ ở server (N3); client chỉ gửi dữ liệu.
 */
@Injectable()
export class LeadsService {
  private readonly logger = new Logger('LeadsService');

  constructor(
    private readonly prisma: PrismaService,
    @Inject(APP_CONFIG) private readonly cfg: AppConfig,
  ) {}

  async createFromWebsite(raw: unknown, ctx: LeadRequestContext): Promise<LeadResult> {
    // 1. Idempotency-Key bắt buộc với POST /public/leads (SPEC 18.5)
    const key = ctx.idempotencyKey?.trim();
    if (!key || !/^[A-Za-z0-9_-]{8,80}$/.test(key)) throw new ApiException('IDEMPOTENCY_KEY_REQUIRED');

    // 2. Validate bằng cùng schema với web (một nguồn quy tắc)
    const parsed = leadCreateSchema.safeParse(raw);
    if (!parsed.success) {
      throw new ApiException(
        'VALIDATION_ERROR',
        parsed.error.issues.map((i) => ({
          field: i.path.join('.') || '_root',
          code: i.code === 'unrecognized_keys' ? 'UNKNOWN_FIELD' : i.code.toUpperCase(),
          message: i.message,
        })),
      );
    }
    const input = parsed.data;
    const requestHash = hashPayload(input);

    // 3. Gửi lại cùng khóa: trả kết quả cũ, không tạo bản ghi mới
    const replay = await this.findReplay(key, requestHash);
    if (replay) return replay;

    // 4. Honeypot: bot điền trường ẩn. Không lưu dữ liệu, không báo lỗi cho bot.
    if (input.website && input.website.trim() !== '') {
      this.logger.warn(`request_id=${ctx.requestId} honeypot kích hoạt, bỏ qua`);
      return { status: 201, body: { lead_code: null, received_at: new Date().toISOString() }, replayed: false };
    }

    // 5. Captcha (bắt buộc ở production, xem config.ts)
    if (this.cfg.TURNSTILE_SECRET) await this.verifyCaptcha(input.captcha_token, ctx.ip);

    // 6. Ghi lead + outbox event + idempotency trong MỘT transaction (SPEC 20.1)
    try {
      return await this.prisma.client.$transaction(async (tx) => {
        const now = new Date();
        const period = yymmInVietnam(now);
        const seq = await nextCode(tx, 'lead', period);
        const leadCode = `LD-${period}-${String(seq).padStart(4, '0')}`;
        const id = newId();

        await tx.lead.create({
          data: {
            id,
            lead_code: leadCode,
            full_name: input.full_name,
            company_name: input.company_name,
            email: input.email,
            phone: input.phone,
            industry_code: input.industry_code ?? null,
            service_interest: input.service_interest,
            project_type: input.project_type ?? null,
            location_text: input.location_text ?? null,
            estimated_timeline: input.estimated_timeline ?? null,
            message: input.message,
            source: 'WEBSITE',
            utm: input.utm ?? Prisma.DbNull,
            landing_page: input.landing_page ?? null,
            consent_at: now,
            consent_version: input.consent_version,
            status: 'NEW',
            spam_score: new Prisma.Decimal(spamScore(input)),
            ip_address: ctx.ip ?? null,
            data_origin: 'REAL',
          },
        });

        // Payload event KHÔNG chứa dữ liệu cá nhân: worker tự đọc lead theo id.
        await tx.domainEvent.create({
          data: {
            id: newId(),
            event_type: 'lead.created',
            aggregate_type: 'lead',
            aggregate_id: id,
            payload: { lead_code: leadCode, source: 'WEBSITE', request_id: ctx.requestId },
          },
        });

        const body: LeadCreatedResponse = { lead_code: leadCode, received_at: now.toISOString() };
        await tx.idempotencyKey.create({
          data: {
            key,
            user_id: ANONYMOUS_USER_ID,
            endpoint: LEAD_ENDPOINT,
            request_hash: requestHash,
            response_status: 201,
            response_body: body as unknown as Prisma.InputJsonValue,
          },
        });
        return { status: 201 as const, body, replayed: false };
      });
    } catch (e) {
      // Hai request cùng khóa đến đồng thời: request sau vi phạm PK idempotency → phát lại kết quả request trước.
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        const again = await this.findReplay(key, requestHash);
        if (again) return again;
      }
      throw e;
    }
  }

  private async findReplay(key: string, requestHash: string): Promise<LeadResult | null> {
    const existing = await this.prisma.client.idempotencyKey.findUnique({
      where: { key_user_id_endpoint: { key, user_id: ANONYMOUS_USER_ID, endpoint: LEAD_ENDPOINT } },
    });
    if (!existing) return null;
    if (existing.request_hash !== requestHash) throw new ApiException('IDEMPOTENCY_KEY_REUSED');
    return { status: 201, body: existing.response_body as unknown as LeadCreatedResponse, replayed: true };
  }

  private async verifyCaptcha(token: string | undefined, ip: string | undefined): Promise<void> {
    const fail = () =>
      new ApiException('VALIDATION_ERROR', [
        { field: 'captcha_token', code: 'CAPTCHA_FAILED', message: 'Xác minh chống spam không thành công, vui lòng thử lại.' },
      ]);
    if (!token) throw fail();
    const form = new URLSearchParams({ secret: this.cfg.TURNSTILE_SECRET ?? '', response: token });
    if (ip) form.set('remoteip', ip);
    try {
      const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(5000),
      });
      const j = (await r.json()) as { success?: boolean };
      if (!j.success) throw fail();
    } catch (e) {
      if (e instanceof ApiException) throw e;
      throw fail();
    }
  }
}

/** Mã kỳ YYMM theo giờ Việt Nam (SPEC 8.1 mẫu LD-{YYMM}-{0000}). */
export function yymmInVietnam(d: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', year: '2-digit', month: '2-digit' }).formatToParts(d);
  const y = parts.find((p) => p.type === 'year')?.value ?? '00';
  const m = parts.find((p) => p.type === 'month')?.value ?? '00';
  return `${y}${m}`;
}

/** Điểm spam đơn giản 0..1 (lưu để sales lọc; không tự loại lead). */
export function spamScore(input: LeadCreate): number {
  let s = 0;
  const links = (input.message.match(/https?:\/\//gi) ?? []).length;
  if (links >= 3) s += 0.5;
  else if (links > 0) s += 0.1;
  if (/(.)\1{9,}/.test(input.message)) s += 0.2;
  if (input.full_name.toLowerCase() === input.company_name.toLowerCase()) s += 0.1;
  return Math.min(1, Math.round(s * 100) / 100);
}

function hashPayload(input: LeadCreate): string {
  const { captcha_token: _ignored, ...rest } = input;
  return createHash('sha256').update(stableStringify(rest)).digest('hex');
}

function stableStringify(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v as object)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify((v as Record<string, unknown>)[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(v);
}

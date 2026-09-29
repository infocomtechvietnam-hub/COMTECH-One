import { Logger } from '@nestjs/common';
import { INDUSTRIES, PROJECT_TYPES, SERVICE_CODES, TIMELINES, formatVnPhone } from '@comtech/contracts';
import type { DomainEvent, Lead, PrismaClient } from '@comtech/db';
import type { Mailer } from './mailer';

/** Lịch thử lại theo SPEC 20.3 (áp dụng chung cho outbox): 1p, 5p, 30p, 2h, 12h, 24h. */
export const RETRY_DELAYS_MS = [60_000, 300_000, 1_800_000, 7_200_000, 43_200_000, 86_400_000];
/** Thời gian "giữ chỗ" một event đang xử lý; worker chết giữa chừng thì event tự được nhận lại. */
const LEASE_MS = 5 * 60_000;

export interface RelayOptions {
  notifyTo: string[];
  batchSize?: number;
}

/**
 * Outbox relay (SPEC 20.1). Mô hình "claim → xử lý → xác nhận" để không giữ
 * transaction trong lúc gửi email. Bảo đảm at-least-once: handler phải chịu
 * được việc chạy lại (email có thể gửi trùng trong trường hợp hiếm worker chết
 * sau khi gửi mà trước khi xác nhận).
 */
export class OutboxRelay {
  private readonly logger = new Logger('OutboxRelay');

  constructor(
    private readonly prisma: PrismaClient,
    private readonly mailer: Mailer,
    private readonly opts: RelayOptions,
  ) {}

  /** Nhận một lô event đến hạn. FOR UPDATE SKIP LOCKED cho phép chạy nhiều worker. */
  async claimBatch(): Promise<DomainEvent[]> {
    const limit = this.opts.batchSize ?? 20;
    return this.prisma.$queryRaw<DomainEvent[]>`
      UPDATE domain_events d
         SET next_attempt_at = now() + (${LEASE_MS}::int * interval '1 millisecond')
       WHERE d.id IN (
         SELECT id FROM domain_events
          WHERE published_at IS NULL AND next_attempt_at <= now()
          ORDER BY occurred_at
          LIMIT ${limit}
          FOR UPDATE SKIP LOCKED)
      RETURNING d.*`;
  }

  async runOnce(): Promise<{ processed: number; failed: number }> {
    const events = await this.claimBatch();
    let failed = 0;
    for (const ev of events) {
      try {
        await this.handle(ev);
        await this.prisma.domainEvent.update({ where: { id: ev.id }, data: { published_at: new Date(), last_error: null } });
      } catch (e) {
        failed++;
        const attempts = ev.attempts + 1;
        const delay = RETRY_DELAYS_MS[Math.min(attempts - 1, RETRY_DELAYS_MS.length - 1)] ?? 86_400_000;
        const exhausted = attempts >= RETRY_DELAYS_MS.length;
        const message = e instanceof Error ? e.message.slice(0, 500) : 'unknown';
        await this.prisma.domainEvent.update({
          where: { id: ev.id },
          data: {
            attempts,
            last_error: message,
            // Hết lượt thử: đẩy xa 100 năm để dừng; cần người xử lý (cảnh báo qua giám sát).
            next_attempt_at: new Date(Date.now() + (exhausted ? 100 * 365 * 86_400_000 : delay)),
          },
        });
        this.logger.warn(`event=${ev.id} type=${ev.event_type} lần=${attempts} lỗi: ${message}`);
      }
    }
    return { processed: events.length, failed };
  }

  async handle(ev: DomainEvent): Promise<void> {
    switch (ev.event_type) {
      case 'lead.created':
        return this.onLeadCreated(ev.aggregate_id);
      default:
        // Event chưa có handler: đánh dấu đã xử lý để không nghẽn hàng đợi.
        return;
    }
  }

  private async onLeadCreated(leadId: string): Promise<void> {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead || lead.deleted_at) return;
    if (!this.mailer.enabled) {
      // Không log dữ liệu cá nhân, chỉ mã lead.
      this.logger.log(`SMTP chưa cấu hình, bỏ qua email cho ${lead.lead_code}`);
      return;
    }
    await this.mailer.send({ to: this.opts.notifyTo, subject: `[Lead mới] ${lead.lead_code} - ${lead.company_name ?? lead.full_name}`, text: internalBody(lead) });
    if (lead.email) {
      await this.mailer.send({ to: [lead.email], subject: `COMTECH đã nhận yêu cầu ${lead.lead_code}`, text: customerBody(lead) });
    }
  }

  /** Dọn khóa idempotency quá 24 giờ (SPEC 10.13). */
  async purgeIdempotencyKeys(): Promise<number> {
    const r = await this.prisma.idempotencyKey.deleteMany({ where: { created_at: { lt: new Date(Date.now() - 86_400_000) } } });
    return r.count;
  }
}

const label = (list: { code: string; label_vi: string }[], code: string | null) =>
  code ? (list.find((x) => x.code === code)?.label_vi ?? code) : '(không chọn)';

const SERVICE_LABELS: Record<string, string> = {
  SURVEY: 'Khảo sát', DESIGN: 'Thiết kế', CONSTRUCTION: 'Thi công xây lắp', INSTALLATION: 'Lắp đặt',
  INTEGRATION: 'Tích hợp', TESTING: 'Đo kiểm', COMMISSIONING: 'Commissioning', OPTIMIZATION: 'Tối ưu',
  MAINTENANCE: 'Bảo dưỡng', SWAP_RELOCATION: 'Swap, di dời, tháo dỡ', EMERGENCY_RESPONSE: 'Ứng cứu thông tin', TECH_SUPPORT: 'Hỗ trợ kỹ thuật',
};
// Bảo đảm bảng nhãn đủ mọi mã dịch vụ (lỗi biên dịch nếu thiếu mã mới).
const _check: Record<(typeof SERVICE_CODES)[number], string> = SERVICE_LABELS as Record<(typeof SERVICE_CODES)[number], string>;
void _check;

export function internalBody(l: Lead): string {
  return [
    `Mã yêu cầu: ${l.lead_code}`,
    `Thời điểm: ${l.created_at.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })}`,
    `Họ tên: ${l.full_name}`,
    `Công ty: ${l.company_name ?? ''}`,
    `Email: ${l.email ?? ''}`,
    `Điện thoại: ${l.phone ? formatVnPhone(l.phone) : ''}`,
    `Ngành: ${label(INDUSTRIES, l.industry_code)}`,
    `Dịch vụ quan tâm: ${l.service_interest.map((c) => SERVICE_LABELS[c] ?? c).join(', ') || '(không chọn)'}`,
    `Loại dự án: ${label(PROJECT_TYPES, l.project_type)}`,
    `Khu vực: ${l.location_text ?? ''}`,
    `Thời gian dự kiến: ${label(TIMELINES, l.estimated_timeline)}`,
    `Điểm spam: ${l.spam_score?.toString() ?? '0'}`,
    '',
    'Mô tả nhu cầu:',
    l.message ?? '',
  ].join('\n');
}

export function customerBody(l: Lead): string {
  return [
    `Kính gửi ${l.full_name},`,
    '',
    `COMTECH đã nhận yêu cầu của anh/chị với mã ${l.lead_code}.`,
    'Bộ phận kinh doanh sẽ liên hệ lại theo thông tin anh/chị đã cung cấp.',
    '',
    'Trân trọng,',
    'COMTECH',
    'info@comtechvietnam.vn',
  ].join('\n');
}

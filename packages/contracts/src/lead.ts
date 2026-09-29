import { z } from 'zod';
import { INDUSTRIES, PROJECT_TYPES, SERVICE_CODES, TIMELINES, codesOf } from './lookups';
import { normalizeVnPhone } from './phone';

/**
 * Phiên bản văn bản đồng ý xử lý dữ liệu cá nhân đang áp dụng trên form.
 * Tăng phiên bản mỗi khi trang Chính sách bảo mật đổi nội dung (SPEC 17).
 */
export const CONSENT_VERSION = '2026-09-v1';

const trimmed = (max: number) =>
  z
    .string()
    .transform((s) => s.trim().replace(/\s+/g, ' '))
    .pipe(z.string().max(max));

const required = (max: number, message: string) =>
  z
    .string({ error: message })
    .transform((s) => s.trim().replace(/\s+/g, ' '))
    .pipe(z.string().min(1, { error: message }).max(max));

/**
 * Dữ liệu form "Yêu cầu giải pháp" (SPEC 34.3). Một nguồn quy tắc cho web
 * (validate phía client để báo lỗi sớm) và API (validate bắt buộc phía server).
 * JSON snake_case theo SPEC 18.1.
 */
export const leadCreateSchema = z
  .object({
    full_name: required(160, 'Vui lòng nhập họ tên.'),
    company_name: required(255, 'Vui lòng nhập tên công ty.'),
    email: z
      .string({ error: 'Vui lòng nhập email.' })
      .trim()
      .toLowerCase()
      .pipe(z.email({ error: 'Email chưa đúng định dạng.' }).max(254)),
    phone: z
      .string({ error: 'Vui lòng nhập số điện thoại.' })
      .transform((v, ctx) => {
        const n = normalizeVnPhone(v);
        if (!n) {
          ctx.addIssue({ code: 'custom', message: 'Số điện thoại chưa đúng định dạng Việt Nam.' });
          return z.NEVER;
        }
        return n;
      }),
    industry_code: z.enum(codesOf(INDUSTRIES)).optional(),
    service_interest: z.array(z.enum(SERVICE_CODES)).max(SERVICE_CODES.length).default([]),
    project_type: z.enum(codesOf(PROJECT_TYPES)).optional(),
    /** Tạm là văn bản tự do đến khi có danh mục admin_units 2 cấp [DATA SOURCE REQUIRED]. */
    location_text: trimmed(160).optional(),
    estimated_timeline: z.enum(codesOf(TIMELINES)).optional(),
    message: required(5000, 'Vui lòng mô tả nhu cầu.'),
    consent: z.literal(true, { error: 'Bạn cần đồng ý với chính sách xử lý dữ liệu cá nhân.' }),
    consent_version: z.literal(CONSENT_VERSION, { error: 'Phiên bản chính sách không còn hiệu lực, vui lòng tải lại trang.' }),
    landing_page: trimmed(500).optional(),
    utm: z.record(z.string().max(40), z.string().max(200)).optional(),
    /** Bẫy bot (honeypot): người dùng thật không nhìn thấy trường này. */
    website: z.string().max(200).optional(),
    captcha_token: z.string().max(4096).optional(),
  })
  .strict();

export type LeadCreateInput = z.input<typeof leadCreateSchema>;
export type LeadCreate = z.output<typeof leadCreateSchema>;

export interface LeadCreatedResponse {
  /** null khi yêu cầu bị bộ lọc spam loại bỏ im lặng. */
  lead_code: string | null;
  received_at: string;
}

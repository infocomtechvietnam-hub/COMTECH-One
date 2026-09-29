import { z } from 'zod';

/**
 * Quản trị nội dung công khai.
 *
 * Mô phỏng cms_entries.status + verification_status + verification_items
 * (SPEC 10.11, 10.12, 31.2, Phụ lục C) ở dạng file trong repo. Khi có CMS,
 * các trường này ánh xạ 1-1 sang cột DB; không phải thiết kế lại.
 *
 * Quy tắc (MASTER PROMPT 3.3, 3.4, SPEC DQ-10):
 * - Production chỉ hiển thị nội dung PUBLISHED + VERIFIED + không còn nhãn mở + data_origin REAL.
 * - Chế độ xem trước (CONTENT_PREVIEW=true, chỉ STAGING) hiển thị thêm nội dung
 *   đang duyệt và dữ liệu DEMO, luôn kèm nhãn "CHỜ DUYỆT" / "DỮ LIỆU MẪU".
 */

export const OPEN_LABELS = [
  '[COMTECH INPUT REQUIRED]',
  '[VERIFY BEFORE PUBLICATION]',
  '[DATA CONFLICT - VERIFY BEFORE PUBLICATION]',
  '[CONTENT REQUIRED]',
  '[DATA SOURCE REQUIRED]',
  '[LEGAL REVIEW REQUIRED]',
] as const;
export type OpenLabel = (typeof OPEN_LABELS)[number];

export const governanceSchema = z
  .object({
    /** Khóa ổn định, dùng trong approvals.ts và khi chuyển sang CMS. */
    id: z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/),
    status: z.enum(['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED']),
    verification_status: z.enum(['PENDING', 'VERIFIED', 'CONFLICT', 'MISSING']),
    open_labels: z.array(z.enum(OPEN_LABELS)).default([]),
    data_origin: z.enum(['REAL', 'DEMO']),
    /** Nguồn của thông tin, để người duyệt đối chiếu. */
    source: z.string().min(1),
    reviewed_by: z.string().optional(),
    reviewed_at: z.string().optional(),
    note: z.string().optional(),
  })
  .strict();

export type Governance = z.infer<typeof governanceSchema>;
export type GovernanceInput = z.input<typeof governanceSchema>;

export type ContentMode = 'production' | 'preview';

export interface Visibility {
  visible: boolean;
  /** Nhãn hiển thị cho người duyệt ở chế độ xem trước. */
  badges: ('CHỜ DUYỆT' | 'DỮ LIỆU MẪU' | OpenLabel)[];
  /** Lý do bị chặn ở production (dùng cho báo cáo kiểm tra nội dung). */
  blocked_reasons: string[];
}

export function evaluate(g: Governance, mode: ContentMode): Visibility {
  const blocked: string[] = [];
  if (g.status !== 'PUBLISHED') blocked.push(`status=${g.status}`);
  if (g.verification_status !== 'VERIFIED') blocked.push(`verification_status=${g.verification_status}`);
  if (g.open_labels.length > 0) blocked.push(`nhãn mở: ${g.open_labels.join(', ')}`);
  if (g.data_origin !== 'REAL') blocked.push(`data_origin=${g.data_origin}`);

  if (mode === 'production') {
    return { visible: blocked.length === 0, badges: [], blocked_reasons: blocked };
  }

  // Xem trước: vẫn ẩn bản nháp và nội dung đã lưu trữ.
  // Dữ liệu CONFLICT/MISSING không bao giờ hiển thị, kể cả xem trước: không để "số tạm" (SPEC 34.1 mục 2).
  const visible =
    g.status !== 'DRAFT' && g.status !== 'ARCHIVED' && g.verification_status !== 'CONFLICT' && g.verification_status !== 'MISSING';
  const badges: Visibility['badges'] = [];
  if (g.data_origin === 'DEMO') badges.push('DỮ LIỆU MẪU');
  if (g.status !== 'PUBLISHED' || g.verification_status !== 'VERIFIED') badges.push('CHỜ DUYỆT');
  badges.push(...g.open_labels);
  return { visible, badges, blocked_reasons: blocked };
}

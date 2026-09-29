/**
 * SỔ DUYỆT NỘI DUNG
 *
 * Product Owner COMTECH duyệt nội dung bằng cách thêm một dòng vào đây
 * (qua Pull Request, có người review). Mục được duyệt chuyển sang
 * PUBLISHED + VERIFIED và xuất hiện ở website production.
 *
 * Không duyệt được mục còn nhãn mở ([COMTECH INPUT REQUIRED], [LEGAL REVIEW REQUIRED]...):
 * phải đóng nhãn trong file dữ liệu trước. Dữ liệu DEMO không bao giờ duyệt được.
 *
 * Ví dụ:
 *   'capability.t': { reviewed_by: 'Nguyễn Văn A (PO)', reviewed_at: '2026-10-01' },
 */
export interface Approval {
  reviewed_by: string;
  reviewed_at: string;
}

export const approvals: Record<string, Approval> = {};

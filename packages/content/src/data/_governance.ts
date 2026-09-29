import type { GovernanceInput, OpenLabel } from '../governance';

const PROFILE_SOURCE = 'Company profile COMTECH, trích tại MASTER PROMPT V4 Mục 3.1 (trạng thái "Theo profile")';

/** Thông tin COMTECH đã xác nhận được dùng (MASTER PROMPT 3.1). */
export const fromProfile = (id: string): GovernanceInput => ({
  id,
  status: 'PUBLISHED',
  verification_status: 'VERIFIED',
  data_origin: 'REAL',
  source: PROFILE_SOURCE,
  reviewed_by: 'COMTECH (MASTER PROMPT V4 Mục 3.1)',
  reviewed_at: '2026-09-23',
});

/** Nội dung do đội dự án soạn từ profile, chờ Product Owner COMTECH duyệt câu chữ. */
export const drafted = (id: string, source = 'Soạn từ company profile và SPEC V2.0; chờ Product Owner COMTECH duyệt'): GovernanceInput => ({
  id,
  status: 'IN_REVIEW',
  verification_status: 'PENDING',
  data_origin: 'REAL',
  source,
});

/** Dữ liệu mẫu để duyệt bố cục. Không bao giờ hiển thị ở production. */
export const demo = (id: string): GovernanceInput => ({
  id,
  status: 'IN_REVIEW',
  verification_status: 'PENDING',
  data_origin: 'DEMO',
  source: 'Dữ liệu mẫu minh họa bố cục, không phải dự án/bài viết thật',
});

/** Thông tin còn thiếu hoặc xung đột: bị chặn cho tới khi đóng nhãn. */
export const blocked = (
  id: string,
  labels: OpenLabel[],
  verification: 'PENDING' | 'CONFLICT' | 'MISSING',
  note: string,
): GovernanceInput => ({
  id,
  status: 'IN_REVIEW',
  verification_status: verification,
  open_labels: labels,
  data_origin: 'REAL',
  source: PROFILE_SOURCE,
  note,
});

/**
 * Danh mục (lookup) chuẩn dùng chung.
 *
 * Theo SPEC Mục 10.4 (lookup_values) và N7: master data dùng `code` ổn định,
 * không dùng nhãn hiển thị làm khóa. Khi có Admin Console, các danh mục này
 * được seed vào bảng `lookup_values`; code giữ nguyên.
 */

export interface LookupItem<C extends string = string> {
  code: C;
  label_vi: string;
  label_en: string;
}

/** 7 năng lực C·O·M·T·E·C·H. `capability_code` theo SPEC 10.6. */
export const CAPABILITY_CODES = ['T', 'E', 'M', 'C2', 'C', 'O', 'H'] as const;
export type CapabilityCode = (typeof CAPABILITY_CODES)[number];

/** Dịch vụ kỹ thuật: trục phân loại thứ hai (SPEC 32.1). */
export const SERVICE_CODES = [
  'SURVEY',
  'DESIGN',
  'CONSTRUCTION',
  'INSTALLATION',
  'INTEGRATION',
  'TESTING',
  'COMMISSIONING',
  'OPTIMIZATION',
  'MAINTENANCE',
  'SWAP_RELOCATION',
  'EMERGENCY_RESPONSE',
  'TECH_SUPPORT',
] as const;
export type ServiceCode = (typeof SERVICE_CODES)[number];

export const INDUSTRIES: LookupItem[] = [
  { code: 'TELECOM_OPERATOR', label_vi: 'Nhà mạng viễn thông', label_en: 'Telecom operator' },
  { code: 'TELECOM_VENDOR', label_vi: 'Hãng / nhà thầu viễn thông', label_en: 'Telecom vendor / contractor' },
  { code: 'ENTERPRISE', label_vi: 'Doanh nghiệp', label_en: 'Enterprise' },
  { code: 'GOVERNMENT', label_vi: 'Cơ quan nhà nước', label_en: 'Government' },
  { code: 'INDUSTRIAL', label_vi: 'Nhà máy, khu công nghiệp', label_en: 'Industrial' },
  { code: 'REAL_ESTATE', label_vi: 'Bất động sản, tòa nhà', label_en: 'Real estate / buildings' },
  { code: 'EDU_HEALTH', label_vi: 'Giáo dục, y tế', label_en: 'Education / healthcare' },
  { code: 'OTHER', label_vi: 'Khác', label_en: 'Other' },
];

export const PROJECT_TYPES: LookupItem[] = [
  { code: 'NEW_DEPLOYMENT', label_vi: 'Triển khai mới', label_en: 'New deployment' },
  { code: 'EXPANSION', label_vi: 'Mở rộng, nâng cấp', label_en: 'Expansion / upgrade' },
  { code: 'SWAP', label_vi: 'Swap, di dời, tháo dỡ', label_en: 'Swap / relocation' },
  { code: 'MAINTENANCE', label_vi: 'Bảo dưỡng, vận hành', label_en: 'Maintenance / O&M' },
  { code: 'EMERGENCY', label_vi: 'Ứng cứu sự cố', label_en: 'Emergency response' },
  { code: 'CONSULTING', label_vi: 'Tư vấn, khảo sát', label_en: 'Consulting / survey' },
  { code: 'OTHER', label_vi: 'Khác', label_en: 'Other' },
];

export const TIMELINES: LookupItem[] = [
  { code: 'ASAP', label_vi: 'Càng sớm càng tốt', label_en: 'As soon as possible' },
  { code: 'WITHIN_3M', label_vi: 'Trong 3 tháng', label_en: 'Within 3 months' },
  { code: 'WITHIN_6M', label_vi: 'Trong 6 tháng', label_en: 'Within 6 months' },
  { code: 'OVER_6M', label_vi: 'Trên 6 tháng', label_en: 'Over 6 months' },
  { code: 'UNDETERMINED', label_vi: 'Chưa xác định', label_en: 'Not determined' },
];

export const codesOf = (items: LookupItem[]): [string, ...string[]] => {
  const codes = items.map((i) => i.code);
  if (codes.length === 0) throw new Error('Danh mục rỗng');
  return codes as [string, ...string[]];
};

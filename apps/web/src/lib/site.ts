import { createContent, resolveMode } from '@comtech/content';

// Simple phone formatter for Vietnamese numbers
const formatVnPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  if (cleaned.length === 11) return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  return phone;
};

/** Nội dung đã lọc theo chế độ build (production hoặc xem trước). Đánh giá lúc build (SSG). */
export const content = createContent(resolveMode());

export const isPreview = content.mode === 'preview';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.comtechvietnam.vn').replace(/\/$/, '');
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export function str(key: string): string | null {
  const v = content.setting(key);
  return typeof v === 'string' ? v : v === null ? null : String(v);
}

/** Thông tin liên hệ công khai: chỉ giá trị đã VERIFIED; thiếu thì null để giao diện ẩn đi. */
export function contact() {
  const hotline = str('company.hotline');
  const phone = str('company.phone');
  return {
    hotline: hotline ? { e164: hotline, display: formatVnPhone(hotline), href: `tel:${hotline}` } : null,
    phone: phone ? { e164: phone, display: formatVnPhone(phone), href: `tel:${phone}` } : null,
    email: str('company.email'),
    address: str('company.hq_address'),
    legalName: str('company.legal_name'),
    shortName: str('company.short_name'),
    slogan: str('company.slogan'),
    foundedDate: str('company.founded_date'),
    foundedPlace: str('company.founded_place'),
  };
}

export const formatDateVi = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export const capabilityHref = (slug: string) => `/giai-phap/${slug}`;
export const solutionHref = (capSlug: string, slug: string) => `/giai-phap/${capSlug}/${slug}`;
export const serviceHref = (slug: string) => `/dich-vu/${slug}`;

/**
 * Build tĩnh cần ít nhất một tham số cho route động. Khi production chưa có
 * nội dung được duyệt, dùng slug giữ chỗ "_" (trang đó luôn trả 404).
 */
export function atLeastOne<T extends Record<string, string>>(list: T[], placeholder: T): T[] {
  return list.length ? list : [placeholder];
}

import type { MetadataRoute } from 'next';
import { SITE_URL, capabilityHref, content, isPreview, serviceHref, solutionHref } from '@/lib/site';

export const dynamic = 'force-static';

/** Chỉ liệt kê trang đã được phép công khai. Bản xem trước không có sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];
  const u = (p: string) => `${SITE_URL}${p}`;
  const pages = ['/', '/giai-phap', '/dich-vu', '/du-an', '/nang-luc', '/tin-tuc', '/tuyen-dung', '/ve-comtech', '/lien-he', '/yeu-cau-giai-phap'];
  const out: MetadataRoute.Sitemap = pages.map((p) => ({ url: u(p) }));
  for (const c of content.capabilities()) {
    out.push({ url: u(capabilityHref(c.slug)) });
    for (const s of content.solutions(c.code)) out.push({ url: u(solutionHref(c.slug, s.slug)) });
  }
  for (const s of content.services()) out.push({ url: u(serviceHref(s.slug)) });
  for (const cs of content.caseStudies()) out.push({ url: u(`/du-an/${cs.slug}`) });
  for (const n of content.news()) out.push({ url: u(`/tin-tuc/${n.slug}`), lastModified: n.date });
  if (content.privacy()) out.push({ url: u('/chinh-sach-bao-mat') });
  return out;
}

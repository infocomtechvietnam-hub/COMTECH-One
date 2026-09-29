import type { MetadataRoute } from 'next';
import { SITE_URL, isPreview } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.APP_ENV === 'production' && !isPreview;
  if (!indexable) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';
import '@fontsource/jetbrains-mono/500.css';
import './globals.css';
import { SiteFooter, SiteHeader, TopBar } from '@/components/chrome';
import { PreviewBanner } from '@/components/review';
import { SITE_URL, contact, isPreview } from '@/lib/site';

const c = contact();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'COMTECH | Hạ tầng viễn thông và giải pháp kỹ thuật',
    template: '%s | COMTECH',
  },
  description:
    'COMTECH: khảo sát, lắp đặt, tích hợp, đo kiểm, bảo dưỡng và ứng cứu thông tin cho hạ tầng viễn thông 2G-5G; năng lượng, cơ điện, PCCC, camera, CNTT và Smart Home.',
  applicationName: 'COMTECH',
  openGraph: { type: 'website', locale: 'vi_VN', siteName: 'COMTECH' },
  robots: isPreview || process.env.APP_ENV !== 'production' ? { index: false, follow: false } : { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#0F1B2D',
  width: 'device-width',
  initialScale: 1,
};

/** schema.org Organization: chỉ dùng thông tin đã VERIFIED (SPEC 35.4). */
function organizationJsonLd() {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'COMTECH',
    url: SITE_URL,
  };
  if (c.legalName) data.legalName = c.legalName;
  if (c.foundedDate) data.foundingDate = c.foundedDate;
  if (c.email) data.email = c.email;
  if (c.hotline) data.contactPoint = [{ '@type': 'ContactPoint', telephone: c.hotline.e164, contactType: 'sales', areaServed: 'VN', availableLanguage: ['vi'] }];
  return data;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-white antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-navy-900">
          Chuyển đến nội dung chính
        </a>
        {isPreview && <PreviewBanner />}
        <TopBar />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      </body>
    </html>
  );
}

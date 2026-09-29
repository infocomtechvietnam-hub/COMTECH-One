import type { NextConfig } from 'next';

const isPreview = process.env.CONTENT_PREVIEW === 'true';
const isProd = process.env.APP_ENV === 'production';
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').origin;
  } catch {
    return 'http://localhost:4000';
  }
})();

/**
 * Header bảo mật (SPEC 16.2).
 * Ghi chú CSP: trang dựng tĩnh (SSG) không dùng được nonce, nên script-src tạm có
 * 'unsafe-inline' cho script khởi tạo của Next.js. Đã ghi Open Issue OI-W-02 để
 * chuyển sang hash/nonce khi có hạ tầng proxy.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self' ${apiOrigin}`,
  'frame-src https://challenges.cloudflare.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' }] : []),
  // Staging và bản xem trước không được index (SPEC 35.4)
  ...(!isProd || isPreview ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : []),
];

const config: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ['@comtech/content'],
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    // Redirect 301 từ URL website cũ sẽ bổ sung khi có danh sách (G0.3 C7)
    return [{ source: '/workspace', destination: '/', permanent: false }];
  },
};

export default config;

import type { Metadata } from 'next';
import { Clock, FileText, ShieldCheck } from 'lucide-react';
import { LeadForm } from '@/components/lead-form';
import { PageHero } from '@/components/ui';
import { API_URL, contact, content } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Yêu cầu giải pháp',
  description: 'Gửi yêu cầu giải pháp, báo giá hoặc trao đổi kỹ thuật với COMTECH.',
  alternates: { canonical: '/yeu-cau-giai-phap' },
};

/** CTA chính của website (SPEC 34.3). */
export default function LeadPage() {
  const c = contact();
  return (
    <>
      <PageHero breadcrumb={[{ label: 'Yêu cầu giải pháp' }]} eyebrow="Request a Solution" title="Yêu cầu giải pháp" lead="Cho chúng tôi biết phạm vi, khu vực và thời gian dự kiến. Kỹ sư COMTECH sẽ liên hệ để trao đổi phương án." />
      <div className="container-site grid gap-10 py-14 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <LeadForm
            enabled={content.leadFormEnabled()}
            apiUrl={API_URL}
            services={content.services().map((s) => ({ code: s.code, title: s.title }))}
            fallback={{ hotline: c.hotline?.display ?? null, hotlineHref: c.hotline?.href ?? null, email: c.email }}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </section>
        <aside className="space-y-4 lg:col-span-4">
          {[
            { Icon: FileText, t: 'Mô tả càng cụ thể càng tốt', d: 'Số trạm/tuyến, khu vực, công nghệ, hiện trạng giúp đề xuất sát hơn.' },
            { Icon: Clock, t: 'Phản hồi', d: 'Yêu cầu được chuyển tới bộ phận kinh doanh ngay khi bạn gửi.' },
            { Icon: ShieldCheck, t: 'Dữ liệu của bạn', d: 'Chỉ dùng để liên hệ tư vấn theo chính sách xử lý dữ liệu cá nhân.' },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="flex gap-4 rounded-lg bg-surface-alt p-5">
              <Icon aria-hidden className="size-6 shrink-0 text-brand-700" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="mt-1 text-[14px] text-slate-600">{d}</p>
              </div>
            </div>
          ))}
          {c.hotline && (
            <p className="rounded-lg border border-border p-5 text-[15px]">
              Cần gấp? Gọi hotline <a href={c.hotline.href} className="tabular font-semibold text-brand-700">{c.hotline.display}</a>
            </p>
          )}
        </aside>
      </div>
    </>
  );
}

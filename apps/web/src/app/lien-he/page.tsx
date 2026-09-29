import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { LeadForm } from '@/components/lead-form';
import { PageHero } from '@/components/ui';
import { API_URL, contact, content } from '@/lib/site';

export const metadata: Metadata = { title: 'Liên hệ', description: 'Liên hệ COMTECH: hotline, email và form yêu cầu giải pháp.', alternates: { canonical: '/lien-he' } };

export default function ContactPage() {
  const c = contact();
  return (
    <>
      <PageHero breadcrumb={[{ label: 'Liên hệ' }]} eyebrow="Liên hệ" title="Trao đổi với COMTECH" lead="Gọi hotline hoặc gửi yêu cầu, kỹ sư COMTECH sẽ liên hệ lại." />
      <div className="container-site grid gap-10 py-14 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-4">
          {c.hotline && (
            <a href={c.hotline.href} className="flex gap-4 rounded-lg border border-border p-5 hover:border-brand-500">
              <Phone aria-hidden className="size-6 text-brand-700" />
              <span>
                <span className="block text-sm text-slate-500">Hotline</span>
                <span className="tabular block font-display text-[22px] font-bold">{c.hotline.display}</span>
              </span>
            </a>
          )}
          {c.phone && (
            <a href={c.phone.href} className="flex gap-4 rounded-lg border border-border p-5 hover:border-brand-500">
              <Phone aria-hidden className="size-6 text-brand-700" />
              <span>
                <span className="block text-sm text-slate-500">Điện thoại</span>
                <span className="tabular block font-semibold">{c.phone.display}</span>
              </span>
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} className="flex gap-4 rounded-lg border border-border p-5 hover:border-brand-500">
              <Mail aria-hidden className="size-6 text-brand-700" />
              <span>
                <span className="block text-sm text-slate-500">Email</span>
                <span className="block font-semibold">{c.email}</span>
              </span>
            </a>
          )}
          {c.address && (
            <div className="flex gap-4 rounded-lg border border-border p-5">
              <MapPin aria-hidden className="size-6 text-brand-700" />
              <span>
                <span className="block text-sm text-slate-500">Trụ sở</span>
                <span className="block font-semibold">{c.address}</span>
              </span>
            </div>
          )}
        </aside>
        <section className="lg:col-span-8">
          <h2 className="mb-6 text-[24px] font-bold">Gửi yêu cầu</h2>
          <LeadForm
            enabled={content.leadFormEnabled()}
            apiUrl={API_URL}
            services={content.services().map((s) => ({ code: s.code, title: s.title }))}
            fallback={{ hotline: c.hotline?.display ?? null, hotlineHref: c.hotline?.href ?? null, email: c.email }}
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </section>
      </div>
    </>
  );
}

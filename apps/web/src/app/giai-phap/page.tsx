import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand } from '@/components/chrome';
import { CAPABILITY_ICON, FallbackIcon } from '@/components/icons';
import { ReviewBadges } from '@/components/review';
import { EmptyState, ButtonLink, PageHero } from '@/components/ui';
import { capabilityHref, content, solutionHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Giải pháp',
  description: '7 năng lực C·O·M·T·E·C·H: Viễn thông, Năng lượng, Cơ điện, PCCC, Camera, CNTT văn phòng và Smart Home.',
  alternates: { canonical: '/giai-phap' },
};

export default function SolutionsOverview() {
  const caps = content.capabilities();
  return (
    <>
      <PageHero
        breadcrumb={[{ label: 'Giải pháp' }]}
        eyebrow="C·O·M·T·E·C·H"
        title="Giải pháp theo 7 năng lực"
        lead="Mỗi giải pháp thuộc một năng lực và áp dụng các dịch vụ kỹ thuật chung: khảo sát, thiết kế, lắp đặt, đo kiểm, bảo dưỡng, ứng cứu."
      />
      <section className="container-site py-14">
        {caps.length === 0 ? (
          <EmptyState title="Nội dung đang được cập nhật" body="Thông tin giải pháp đang được hoàn thiện. Bạn có thể gửi yêu cầu để trao đổi trực tiếp với kỹ sư." action={<ButtonLink href="/yeu-cau-giai-phap">Yêu cầu giải pháp</ButtonLink>} />
        ) : (
          <div className="space-y-5">
            {caps.map((cap) => {
              const Icon = CAPABILITY_ICON[cap.code] ?? FallbackIcon;
              const sols = content.solutions(cap.code);
              const core = cap.code === 'T';
              return (
                <article key={cap.code} className={`grid gap-6 rounded-lg border p-6 md:grid-cols-12 md:p-8 ${core ? 'border-navy-900 bg-grid-navy text-white on-dark' : 'border-border bg-white'}`}>
                  <div className="md:col-span-5">
                    <div className="flex items-center gap-3">
                      <span className={`grid size-12 place-items-center rounded-md ${core ? 'bg-brand-500 text-navy-900' : 'bg-brand-50 text-brand-700'}`}><Icon aria-hidden className="size-6" /></span>
                      <span className={`font-mono text-[13px] font-semibold ${core ? 'text-brand-500' : 'text-brand-700'}`}>{cap.letter} · {cap.name_en}{core ? ' · Năng lực lõi' : ''}</span>
                    </div>
                    <h2 className={`mt-4 text-[24px] font-bold ${core ? 'text-white' : 'text-navy-900'}`}>
                      <Link href={capabilityHref(cap.slug)} className="hover:underline">{cap.name}</Link>
                    </h2>
                    <p className={`mt-2 ${core ? 'text-white/75' : 'text-slate-600'}`}>{cap.description}</p>
                    <ReviewBadges v={cap.visibility} className="mt-3" />
                  </div>
                  <ul className="grid content-start gap-2 md:col-span-7 sm:grid-cols-2">
                    {sols.map((s) => (
                      <li key={s.slug}>
                        <Link href={solutionHref(cap.slug, s.slug)} className={`group flex h-full items-start justify-between gap-3 rounded-md border p-4 ${core ? 'border-white/15 hover:border-brand-500' : 'border-border hover:border-navy-900/30 hover:bg-surface-alt'}`}>
                          <span>
                            <span className={`block font-semibold ${core ? 'text-white' : 'text-navy-900'}`}>{s.title}</span>
                            <span className={`mt-1 block text-[14px] ${core ? 'text-white/70' : 'text-slate-600'}`}>{s.summary}</span>
                          </span>
                          <ArrowRight aria-hidden className={`mt-1 size-4 shrink-0 ${core ? 'text-brand-500' : 'text-brand-700'}`} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}

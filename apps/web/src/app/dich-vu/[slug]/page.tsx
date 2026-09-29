import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { CtaBand } from '@/components/chrome';
import { ReviewBadges } from '@/components/review';
import { ButtonLink, PageHero } from '@/components/ui';
import { atLeastOne, capabilityHref, content, solutionHref } from '@/lib/site';

type Params = { slug: string };
export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return atLeastOne(content.services().map((s) => ({ slug: s.slug })), { slug: '_' });
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const s = content.service((await params).slug);
  return s ? { title: s.title, description: s.summary.slice(0, 160), alternates: { canonical: `/dich-vu/${s.slug}` } } : {};
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const s = content.service((await params).slug);
  if (!s) notFound();
  const caps = content.capabilities();
  const related = caps.flatMap((c) => content.solutions(c.code).filter((x) => x.services.includes(s.code)).map((x) => ({ cap: c, sol: x })));
  return (
    <>
      <PageHero breadcrumb={[{ href: '/dich-vu', label: 'Dịch vụ' }, { label: s.title }]} eyebrow="Dịch vụ kỹ thuật" title={s.title} lead={s.summary}>
        <ReviewBadges v={s.visibility} className="mt-4" />
      </PageHero>
      <div className="container-site grid gap-10 py-14 md:grid-cols-12">
        <section className="md:col-span-7">
          <h2 className="text-[22px] font-bold">Phạm vi công việc</h2>
          <ul className="mt-4 space-y-3">
            {s.scope.map((x) => (
              <li key={x} className="flex gap-3"><Check aria-hidden className="mt-1 size-4 shrink-0 text-success-700" /> {x}</li>
            ))}
          </ul>
          {s.deliverables.length > 0 && (
            <>
              <h2 className="mt-10 text-[22px] font-bold">Kết quả bàn giao</h2>
              <ul className="mt-4 space-y-3">
                {s.deliverables.map((x) => (
                  <li key={x} className="flex gap-3"><Check aria-hidden className="mt-1 size-4 shrink-0 text-tech-700" /> {x}</li>
                ))}
              </ul>
            </>
          )}
        </section>
        <aside className="md:col-span-5">
          {related.length > 0 && (
            <div className="rounded-lg border border-border p-6">
              <h2 className="font-display text-[17px] font-semibold">Áp dụng trong các giải pháp</h2>
              <ul className="mt-4 space-y-2 text-[15px]">
                {related.map(({ cap, sol }) => (
                  <li key={sol.slug}>
                    <Link href={solutionHref(cap.slug, sol.slug)} className="text-navy-900 hover:text-brand-700">{sol.title}</Link>
                    <Link href={capabilityHref(cap.slug)} className="ml-2 text-[13px] text-slate-500 hover:underline">{cap.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ButtonLink href="/yeu-cau-giai-phap" className="mt-6 w-full" arrow>Yêu cầu báo giá</ButtonLink>
        </aside>
      </div>
      <CtaBand />
    </>
  );
}

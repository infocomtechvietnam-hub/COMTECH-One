import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/chrome';
import { DemoFrame, ReviewBadges } from '@/components/review';
import { Chip, PageHero } from '@/components/ui';
import { content } from '@/lib/site';

type Params = { slug: string };
export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  const list = content.caseStudies().map((c) => ({ slug: c.slug }));
  // Next.js yêu cầu ít nhất một tham số khi build tĩnh; slug giữ chỗ luôn trả 404.
  return list.length ? list : [{ slug: '_' }];
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const cs = content.caseStudy((await params).slug);
  return cs ? { title: cs.title, description: cs.scope.slice(0, 160), robots: cs.visibility.badges.length ? { index: false } : undefined } : {};
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const cs = content.caseStudy((await params).slug);
  if (!cs) notFound();
  const cap = content.capabilities().find((c) => c.code === cs.capability_code);
  const services = cs.services.map((c) => content.serviceByCode(c)?.title ?? c);
  return (
    <>
      <PageHero breadcrumb={[{ href: '/du-an', label: 'Dự án' }, { label: cs.title }]} eyebrow={cap?.name} title={cs.title}>
        <ReviewBadges v={cs.visibility} className="mt-4" />
      </PageHero>
      <DemoFrame v={cs.visibility}>
        <div className="container-site grid gap-10 py-14 md:grid-cols-12">
          <dl className="space-y-4 rounded-lg border border-border p-6 md:col-span-4">
            {[
              ['Khách hàng', cs.client_display],
              ['Khu vực', cs.region],
              ['Năm', String(cs.year)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[13px] text-slate-500">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="text-[13px] text-slate-500">Dịch vụ</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">{services.map((s) => <Chip key={s}>{s}</Chip>)}</dd>
            </div>
          </dl>
          <div className="space-y-8 md:col-span-8">
            {[
              ['Phạm vi', cs.scope],
              ['Thách thức', cs.challenge],
              ['Giải pháp', cs.solution],
            ].map(([h, t]) => (
              <section key={h}>
                <h2 className="text-[22px] font-bold">{h}</h2>
                <p className="mt-2 text-slate-600">{t}</p>
              </section>
            ))}
            <section>
              <h2 className="text-[22px] font-bold">Kết quả</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">{cs.results.map((r) => <li key={r}>{r}</li>)}</ul>
            </section>
          </div>
        </div>
      </DemoFrame>
      <CtaBand />
    </>
  );
}

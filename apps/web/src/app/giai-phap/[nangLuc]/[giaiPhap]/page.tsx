import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CircleAlert } from 'lucide-react';
import { CaseStudyCard } from '@/components/cards';
import { CtaBand } from '@/components/chrome';
import { ReviewBadges } from '@/components/review';
import { ButtonLink, Chip, PageHero } from '@/components/ui';
import { atLeastOne, content, serviceHref } from '@/lib/site';

type Params = { nangLuc: string; giaiPhap: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return atLeastOne(content.capabilities().flatMap((c) => content.solutions(c.code).map((s) => ({ nangLuc: c.slug, giaiPhap: s.slug }))), { nangLuc: '_', giaiPhap: '_' });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const p = await params;
  const sol = content.solution(p.nangLuc, p.giaiPhap);
  if (!sol) return {};
  return {
    title: sol.seo_title ?? sol.title,
    description: sol.seo_description ?? sol.summary.slice(0, 160),
    alternates: { canonical: `/giai-phap/${p.nangLuc}/${p.giaiPhap}` },
  };
}

/** Template trang giải pháp (SPEC 34.2): Vấn đề → Giải pháp → Dịch vụ → Công nghệ → Dự án → FAQ → CTA. */
export default async function SolutionPage({ params }: { params: Promise<Params> }) {
  const p = await params;
  const cap = content.capability(p.nangLuc);
  const sol = content.solution(p.nangLuc, p.giaiPhap);
  if (!cap || !sol) notFound();
  const svc = sol.services.map((code) => content.serviceByCode(code)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const cases = content.caseStudies().filter((c) => c.capability_code === sol.capability_code).slice(0, 3);
  const faqLd = sol.faq.length
    ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: sol.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
    : null;

  return (
    <>
      <PageHero breadcrumb={[{ href: '/giai-phap', label: 'Giải pháp' }, { href: `/giai-phap/${cap.slug}`, label: cap.name }, { label: sol.title }]} eyebrow={cap.name} title={sol.title} lead={sol.summary}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink href="/yeu-cau-giai-phap" arrow>Trao đổi với kỹ sư</ButtonLink>
          <ReviewBadges v={sol.visibility} />
        </div>
      </PageHero>

      <div className="container-site grid gap-12 py-14 lg:grid-cols-12">
        <div className="space-y-14 lg:col-span-8">
          <section aria-labelledby="van-de">
            <h2 id="van-de" className="text-[24px] font-bold">Vấn đề khách hàng thường gặp</h2>
            <ul className="mt-5 space-y-3">
              {sol.problems.map((pr) => (
                <li key={pr} className="flex gap-3 rounded-md border border-border bg-white p-4">
                  <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0 text-warning-700" />
                  <span className="text-slate-600">{pr}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="giai-phap">
            <h2 id="giai-phap" className="text-[24px] font-bold">Giải pháp COMTECH</h2>
            <ol className="mt-5 space-y-4">
              {sol.approach.map((a, i) => (
                <li key={a.title} className="grid grid-cols-[auto_1fr] gap-4">
                  <span className="grid size-9 place-items-center rounded-full bg-navy-900 font-mono text-[13px] font-semibold text-brand-500">{i + 1}</span>
                  <div>
                    <h3 className="text-[18px] font-semibold text-navy-900">{a.title}</h3>
                    <p className="mt-1 text-slate-600">{a.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {sol.faq.length > 0 && (
            <section aria-labelledby="faq">
              <h2 id="faq" className="text-[24px] font-bold">Câu hỏi thường gặp</h2>
              <div className="mt-5 divide-y divide-border rounded-lg border border-border">
                {sol.faq.map((f) => (
                  <details key={f.q} className="group p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900">
                      {f.q}
                      <span aria-hidden className="text-brand-700 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {cases.length > 0 && (
            <section aria-labelledby="du-an">
              <h2 id="du-an" className="text-[24px] font-bold">Dự án liên quan</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">{cases.map((cs) => <CaseStudyCard key={cs.slug} cs={cs} />)}</div>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:col-span-4">
          {svc.length > 0 && (
            <div className="rounded-lg border border-border p-6">
              <h2 className="font-display text-[17px] font-semibold">Dịch vụ kỹ thuật áp dụng</h2>
              <ul className="mt-4 space-y-1">
                {svc.map((s) => (
                  <li key={s.code}>
                    <Link href={serviceHref(s.slug)} className="flex items-center justify-between rounded-md px-2 py-2 text-[15px] hover:bg-surface-alt">
                      {s.title} <ArrowRight aria-hidden className="size-4 text-brand-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sol.technologies.length > 0 && (
            <div className="rounded-lg border border-border p-6">
              <h2 className="font-display text-[17px] font-semibold">Công nghệ, thiết bị liên quan</h2>
              <ul className="mt-4 flex flex-wrap gap-2">{sol.technologies.map((t) => <li key={t}><Chip tone="tech">{t}</Chip></li>)}</ul>
            </div>
          )}
          <div className="rounded-lg bg-grid-navy p-6 text-white on-dark">
            <p className="font-display text-[18px] font-semibold">Trao đổi với kỹ sư</p>
            <p className="mt-2 text-sm text-white/75">Mô tả phạm vi, khu vực và thời gian dự kiến để nhận phương án phù hợp.</p>
            <ButtonLink href="/yeu-cau-giai-phap" className="mt-5 w-full">Yêu cầu giải pháp</ButtonLink>
          </div>
        </aside>
      </div>
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <CtaBand />
    </>
  );
}

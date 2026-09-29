import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/chrome';
import { DemoFrame, ReviewBadges } from '@/components/review';
import { PageHero } from '@/components/ui';
import { SITE_URL, content, formatDateVi } from '@/lib/site';

type Params = { slug: string };
export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  const list = content.news().map((n) => ({ slug: n.slug }));
  return list.length ? list : [{ slug: '_' }];
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const n = content.newsItem((await params).slug);
  return n ? { title: n.title, description: n.summary.slice(0, 160), robots: n.visibility.badges.length ? { index: false } : undefined } : {};
}

export default async function NewsArticle({ params }: { params: Promise<Params> }) {
  const n = content.newsItem((await params).slug);
  if (!n) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: n.title, datePublished: n.date, publisher: { '@type': 'Organization', name: 'COMTECH', url: SITE_URL } };
  return (
    <>
      <PageHero breadcrumb={[{ href: '/tin-tuc', label: 'Tin tức' }, { label: n.title }]} eyebrow={n.category === 'TECH' ? 'Góc kỹ thuật' : 'Tin công ty'} title={n.title}>
        <p className="mt-3 text-sm text-slate-500"><time dateTime={n.date}>{formatDateVi(n.date)}</time></p>
        <ReviewBadges v={n.visibility} className="mt-3" />
      </PageHero>
      <DemoFrame v={n.visibility}>
        <article className="container-site max-w-3xl space-y-5 py-14 text-[17px] leading-relaxed text-slate-600">
          <p className="text-[19px] text-navy-900">{n.summary}</p>
          {n.body.map((p) => <p key={p}>{p}</p>)}
        </article>
      </DemoFrame>
      {n.visibility.badges.length === 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
      <CtaBand />
    </>
  );
}

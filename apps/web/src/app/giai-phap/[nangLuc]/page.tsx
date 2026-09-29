import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/chrome';
import { SolutionCard } from '@/components/cards';
import { CAPABILITY_ICON, FallbackIcon } from '@/components/icons';
import { ReviewBadges } from '@/components/review';
import { ButtonLink, EmptyState, PageHero } from '@/components/ui';
import { atLeastOne, content } from '@/lib/site';

type Params = { nangLuc: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return atLeastOne(content.capabilities().map((c) => ({ nangLuc: c.slug })), { nangLuc: '_' });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const cap = content.capability((await params).nangLuc);
  if (!cap) return {};
  return { title: `${cap.name}`, description: cap.description.slice(0, 160), alternates: { canonical: `/giai-phap/${cap.slug}` } };
}

export default async function CapabilityPage({ params }: { params: Promise<Params> }) {
  const cap = content.capability((await params).nangLuc);
  if (!cap) notFound();
  const Icon = CAPABILITY_ICON[cap.code] ?? FallbackIcon;
  const sols = content.solutions(cap.code);
  return (
    <>
      <PageHero breadcrumb={[{ href: '/giai-phap', label: 'Giải pháp' }, { label: cap.name }]} eyebrow={`${cap.letter} · ${cap.name_en}`} title={cap.name} lead={cap.description}>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-brand-500 text-navy-900"><Icon aria-hidden className="size-5" /></span>
          <ReviewBadges v={cap.visibility} />
        </div>
      </PageHero>
      <section className="container-site py-14">
        <h2 className="mb-6 text-[24px] font-bold">Nhóm giải pháp</h2>
        {sols.length === 0 ? (
          <EmptyState title="Chi tiết giải pháp đang được cập nhật" body="Vui lòng gửi yêu cầu để kỹ sư trao đổi trực tiếp." action={<ButtonLink href="/yeu-cau-giai-phap">Yêu cầu giải pháp</ButtonLink>} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {sols.map((s) => <SolutionCard key={s.slug} sol={s} capSlug={cap.slug} />)}
          </div>
        )}
        <div className="mt-12 rounded-lg bg-surface-alt p-6">
          <h2 className="text-[20px] font-bold">Điểm chính</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {cap.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-brand-500" /> {h}</li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

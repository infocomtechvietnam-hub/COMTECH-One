import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Capability, CaseStudy, News, Solution, WithVisibility } from '@comtech/content';
import { capabilityHref, content, formatDateVi, solutionHref } from '@/lib/site';
import { CAPABILITY_ICON, FallbackIcon } from './icons';
import { DemoFrame, ReviewBadges } from './review';

export function CapabilityCard({ cap, featured }: { cap: WithVisibility<Capability>; featured?: boolean }) {
  const Icon = CAPABILITY_ICON[cap.code] ?? FallbackIcon;
  const sols = content.solutions(cap.code);
  if (featured) {
    return (
      <Link href={capabilityHref(cap.slug)} className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-grid-navy p-7 text-white shadow-md on-dark md:col-span-2 md:row-span-2">
        <div className="flex items-start justify-between">
          <span className="grid size-14 place-items-center rounded-lg bg-brand-500 text-navy-900"><Icon aria-hidden className="size-7" /></span>
          <span aria-hidden className="font-display text-[88px] leading-none font-extrabold text-white/10">{cap.letter}</span>
        </div>
        <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-500">Năng lực lõi · {cap.name_en}</p>
        <h3 className="mt-2 text-[28px] font-bold">{cap.name}</h3>
        <p className="mt-3 max-w-lg text-white/75">{cap.description}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {cap.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-[15px] text-white/90">
              <span aria-hidden className="size-1.5 rounded-full bg-brand-500" /> {h}
            </li>
          ))}
        </ul>
        <span className="mt-auto flex items-center gap-2 pt-8 font-semibold text-brand-500">
          {sols.length > 0 ? `${sols.length} nhóm giải pháp` : 'Xem năng lực'} <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
        <ReviewBadges v={cap.visibility} className="absolute right-4 bottom-4" />
      </Link>
    );
  }
  return (
    <Link href={capabilityHref(cap.slug)} className="group relative flex h-full flex-col rounded-lg border border-border bg-white p-6 transition-shadow hover:border-navy-900/20 hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-md bg-brand-50 text-brand-700"><Icon aria-hidden className="size-5" /></span>
        <span aria-hidden className="font-display text-[40px] leading-none font-extrabold text-navy-900/[0.07]">{cap.letter}</span>
      </div>
      <h3 className="mt-4 text-[19px] font-semibold text-navy-900">{cap.name}</h3>
      <p className="mt-1.5 text-[15px] text-slate-600">{cap.tagline}</p>
      <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-brand-700">
        Tìm hiểu <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
      <ReviewBadges v={cap.visibility} className="mt-3" />
    </Link>
  );
}

export function SolutionCard({ sol, capSlug }: { sol: WithVisibility<Solution>; capSlug: string }) {
  return (
    <Link href={solutionHref(capSlug, sol.slug)} className="group flex h-full flex-col rounded-lg border border-border bg-white p-6 hover:border-navy-900/20 hover:shadow-md">
      <h3 className="text-[19px] font-semibold text-navy-900 group-hover:text-brand-700">{sol.title}</h3>
      <p className="mt-2 text-[15px] text-slate-600">{sol.summary}</p>
      {sol.technologies.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {sol.technologies.slice(0, 4).map((t) => (
            <li key={t} className="rounded-sm bg-surface-muted px-2 py-0.5 font-mono text-[12px] text-slate-600">{t}</li>
          ))}
        </ul>
      )}
      <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-brand-700">
        Chi tiết giải pháp <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
      <ReviewBadges v={sol.visibility} className="mt-3" />
    </Link>
  );
}

export function CaseStudyCard({ cs }: { cs: WithVisibility<CaseStudy> }) {
  const cap = content.capabilities().find((c) => c.code === cs.capability_code);
  return (
    <DemoFrame v={cs.visibility} className="h-full">
      <Link href={`/du-an/${cs.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white hover:shadow-md">
        <div className="relative aspect-[16/9] bg-grid-navy">
          <span className="absolute left-4 top-4 rounded-sm bg-brand-500 px-2 py-0.5 text-[12px] font-semibold text-navy-900">{cap?.name ?? cs.capability_code}</span>
          <span className="absolute bottom-4 left-4 font-mono text-[12px] text-white/70">{cs.region} · {cs.year}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-[13px] text-slate-500">{cs.client_display}</p>
          <h3 className="mt-1 text-[17px] font-semibold text-navy-900 group-hover:text-brand-700">{cs.title}</h3>
          <ReviewBadges v={cs.visibility} className="mt-auto pt-3" />
        </div>
      </Link>
    </DemoFrame>
  );
}

export function NewsCard({ n }: { n: WithVisibility<News> }) {
  return (
    <DemoFrame v={n.visibility} className="h-full">
      <Link href={`/tin-tuc/${n.slug}`} className="group flex h-full flex-col rounded-lg border border-border bg-white p-5 hover:shadow-md">
        <p className="flex items-center gap-2 text-[13px] text-slate-500">
          <span className="font-semibold text-tech-700">{n.category === 'TECH' ? 'Góc kỹ thuật' : 'Tin công ty'}</span>
          <span aria-hidden>·</span>
          <time dateTime={n.date} className="tabular">{formatDateVi(n.date)}</time>
        </p>
        <h3 className="mt-2 text-[17px] font-semibold text-navy-900 group-hover:text-brand-700">{n.title}</h3>
        <p className="mt-2 text-[15px] text-slate-600">{n.summary}</p>
        <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-brand-700">
          Đọc tiếp <ArrowUpRight aria-hidden className="size-4" />
        </span>
        <ReviewBadges v={n.visibility} className="mt-3" />
      </Link>
    </DemoFrame>
  );
}

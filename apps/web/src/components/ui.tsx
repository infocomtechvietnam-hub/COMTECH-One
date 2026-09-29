import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'outline-light';

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 min-h-11 px-5 text-[15px] whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed';
const variants: Record<Variant, string> = {
  // Nền cam + chữ navy (8,14:1). Không bao giờ chữ trắng trên cam.
  primary: 'bg-brand-500 text-navy-900 hover:bg-brand-600 shadow-sm',
  secondary: 'bg-navy-900 text-white hover:bg-navy-800',
  outline: 'border border-navy-900/20 text-navy-900 hover:border-navy-900 hover:bg-surface-alt',
  ghost: 'text-brand-700 hover:bg-brand-50 px-3',
  'outline-light': 'border border-white/30 text-white hover:border-white hover:bg-white/5',
};

export function ButtonLink({ href, variant = 'primary', children, arrow, className = '' }: { href: string; variant?: Variant; children: ReactNode; arrow?: boolean; className?: string }) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {arrow && <ArrowRight aria-hidden className="size-4" />}
    </Link>
  );
}

export function Button({ variant = 'primary', className = '', ...props }: ComponentProps<'button'> & { variant?: Variant }) {
  return <button {...props} className={`${base} ${variants[variant]} ${className}`} />;
}

export function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] ${dark ? 'text-brand-500' : 'text-brand-700'}`}>
      <span aria-hidden className="h-0.5 w-6 bg-brand-500" />
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, lead, dark, action }: { eyebrow?: string; title: string; lead?: string; dark?: boolean; action?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
        <h2 className={`text-[26px] font-bold md:text-[32px] ${dark ? 'text-white' : 'text-navy-900'}`}>{title}</h2>
        {lead && <p className={`mt-3 text-[17px] ${dark ? 'text-white/75' : 'text-slate-600'}`}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Đường dẫn" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-slate-600">
        <li>
          <Link href="/" className="hover:text-brand-700">Trang chủ</Link>
        </li>
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-1">
            <ChevronRight aria-hidden className="size-3.5 text-slate-500" />
            {it.href ? (
              <Link href={it.href} className="hover:text-brand-700">{it.label}</Link>
            ) : (
              <span aria-current="page" className="font-medium text-navy-900">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ breadcrumb, eyebrow, title, lead, children }: { breadcrumb: { href?: string; label: string }[]; eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="border-b border-border bg-surface-alt">
      <div className="container-site py-10 md:py-14">
        <Breadcrumb items={breadcrumb} />
        <div className="mt-6 max-w-3xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-[32px] font-bold text-navy-900 md:text-[44px]">{title}</h1>
          {lead && <p className="mt-4 text-[18px] text-slate-600">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-alt px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold text-navy-900">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-slate-600">{body}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function Chip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'tech' | 'brand' }) {
  const t = {
    neutral: 'border-border bg-white text-navy-900',
    tech: 'border-tech-700/25 bg-tech-700/5 text-tech-700',
    brand: 'border-brand-500/40 bg-brand-50 text-brand-700',
  }[tone];
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[13px] font-medium ${t}`}>{children}</span>;
}

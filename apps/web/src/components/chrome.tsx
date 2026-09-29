import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { content, contact, capabilityHref, serviceHref, solutionHref, str } from '@/lib/site';
import { HeaderClient, type NavData } from './header-client';
import { Wordmark } from './icons';
import { ButtonLink } from './ui';

function navData(): NavData {
  const caps = content.capabilities();
  const c = contact();
  return {
    capabilities: caps.map((cap) => ({
      code: cap.code,
      letter: cap.letter,
      name: cap.name,
      tagline: cap.tagline,
      href: capabilityHref(cap.slug),
      solutions: content.solutions(cap.code).map((s) => ({ title: s.title, href: solutionHref(cap.slug, s.slug) })),
    })),
    services: content.services().map((s) => ({ title: s.title, href: serviceHref(s.slug) })),
    hotline: c.hotline ? { display: c.hotline.display, href: c.hotline.href } : null,
    workspaceUrl: str('workspace.url'),
  };
}

/** Thanh mỏng trên cùng: hotline, email từ settings đã VERIFIED (SPEC 32.3). */
export function TopBar() {
  const c = contact();
  if (!c.hotline && !c.email) return null;
  return (
    <div className="hidden bg-navy-900 text-white/80 md:block">
      <div className="container-site flex h-9 items-center justify-between text-[13px]">
        <div className="flex items-center gap-6">
          {c.hotline && (
            <a href={c.hotline.href} className="flex items-center gap-1.5 hover:text-white">
              <Phone aria-hidden className="size-3.5 text-brand-500" /> Hotline <span className="tabular font-semibold text-white">{c.hotline.display}</span>
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:text-white">
              <Mail aria-hidden className="size-3.5 text-brand-500" /> {c.email}
            </a>
          )}
        </div>
        {c.slogan && <p className="tracking-[0.14em] text-white/60">{c.slogan}</p>}
      </div>
    </div>
  );
}

export function SiteHeader() {
  return <HeaderClient nav={navData()} />;
}

export function CtaBand() {
  return (
    <section className="bg-grid-navy on-dark">
      <div className="container-site flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-[26px] font-bold text-white md:text-[32px]">Bạn cần triển khai hoặc bảo dưỡng hạ tầng viễn thông?</h2>
          <p className="mt-3 text-white/75">Gửi yêu cầu, kỹ sư COMTECH sẽ liên hệ để trao đổi phạm vi và phương án.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/yeu-cau-giai-phap" arrow>Yêu cầu giải pháp</ButtonLink>
          <ButtonLink href="/lien-he" variant="outline-light">Trao đổi với kỹ sư</ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const c = contact();
  const caps = content.capabilities();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-900 text-white/75 on-dark">
      <div className="container-site grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Wordmark dark />
          {c.legalName && <p className="mt-4 text-sm font-semibold uppercase leading-snug text-white">{c.legalName}</p>}
          {c.slogan && <p className="mt-2 text-[13px] tracking-[0.12em] text-brand-500">{c.slogan}</p>}
          <ul className="mt-5 space-y-2 text-sm">
            {c.hotline && (
              <li>Hotline: <a className="tabular font-semibold text-white hover:text-brand-500" href={c.hotline.href}>{c.hotline.display}</a></li>
            )}
            {c.phone && (
              <li>Điện thoại: <a className="tabular text-white hover:text-brand-500" href={c.phone.href}>{c.phone.display}</a></li>
            )}
            {c.email && (
              <li>Email: <a className="text-white hover:text-brand-500" href={`mailto:${c.email}`}>{c.email}</a></li>
            )}
            {/* Địa chỉ chỉ hiển thị khi đã xác minh theo địa giới mới */}
            {c.address && <li>Địa chỉ: <span className="text-white">{c.address}</span></li>}
          </ul>
        </div>
        <FooterCol title="Giải pháp" links={caps.map((x) => ({ href: capabilityHref(x.slug), label: x.name })).concat([{ href: '/giai-phap', label: 'Tổng quan giải pháp' }])} />
        <FooterCol
          title="Dịch vụ"
          links={content.services().slice(0, 7).map((s) => ({ href: serviceHref(s.slug), label: s.title })).concat([{ href: '/dich-vu', label: 'Tất cả dịch vụ' }])}
        />
        <FooterCol
          title="COMTECH"
          links={[
            { href: '/ve-comtech', label: 'Về COMTECH' },
            { href: '/nang-luc', label: 'Năng lực' },
            { href: '/du-an', label: 'Dự án' },
            { href: '/tin-tuc', label: 'Tin tức' },
            { href: '/tuyen-dung', label: 'Tuyển dụng' },
            { href: '/lien-he', label: 'Liên hệ' },
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-[13px] md:flex-row md:items-center md:justify-between">
          <p>© {year} {(c.shortName ?? 'COMTECH').replace(/\.$/, '')}. Bảo lưu mọi quyền.</p>
          <div className="flex gap-5">
            {content.privacy() && <Link href="/chinh-sach-bao-mat" className="hover:text-white">Chính sách xử lý dữ liệu cá nhân</Link>}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="md:col-span-2 lg:col-span-2 [&:nth-child(3)]:md:col-span-3 [&:nth-child(4)]:md:col-span-3">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-white">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="hover:text-white">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

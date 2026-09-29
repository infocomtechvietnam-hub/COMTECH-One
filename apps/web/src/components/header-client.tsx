'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, Phone, X } from 'lucide-react';
import { CAPABILITY_ICON, Wordmark } from './icons';

export interface NavCapability {
  code: string;
  letter: string;
  name: string;
  tagline: string;
  href: string;
  solutions: { title: string; href: string }[];
}
export interface NavData {
  capabilities: NavCapability[];
  services: { title: string; href: string }[];
  hotline: { display: string; href: string } | null;
  workspaceUrl: string | null;
}

type Panel = 'solutions' | 'services' | null;

const LINKS = [
  { href: '/du-an', label: 'Dự án' },
  { href: '/nang-luc', label: 'Năng lực' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/tuyen-dung', label: 'Tuyển dụng' },
  { href: '/ve-comtech', label: 'Về COMTECH' },
];

export function HeaderClient({ nav }: { nav: NavData }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [drawer, setDrawer] = useState(false);
  const [acc, setAcc] = useState<Panel>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Đóng menu khi đổi trang hoặc bấm Esc
  useEffect(() => {
    setPanel(null);
    setDrawer(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanel(null);
        setDrawer(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setPanel(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
  }, [drawer]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const topCls = (on: boolean) =>
    `relative flex h-full items-center gap-1 px-3 text-[15px] font-medium transition-colors ${on ? 'text-navy-900' : 'text-slate-600 hover:text-navy-900'} after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 ${on ? 'after:bg-brand-500' : 'after:bg-transparent'}`;

  const telecom = nav.capabilities.find((c) => c.code === 'T');
  const others = nav.capabilities.filter((c) => c.code !== 'T');

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Link href="/" className="shrink-0" aria-label="COMTECH, về trang chủ">
          <Wordmark />
        </Link>

        {/* Desktop */}
        <nav aria-label="Menu chính" className="hidden h-full items-stretch lg:flex" onMouseLeave={() => setPanel(null)}>
          {nav.capabilities.length > 0 ? (
          <button
            type="button"
            className={topCls(active('/giai-phap') || panel === 'solutions')}
            aria-expanded={panel === 'solutions'}
            aria-controls="mega-solutions"
            onMouseEnter={() => setPanel('solutions')}
            onClick={() => setPanel(panel === 'solutions' ? null : 'solutions')}
          >
            Giải pháp <ChevronDown aria-hidden className={`size-4 transition-transform ${panel === 'solutions' ? 'rotate-180' : ''}`} />
          </button>
          ) : (
            <Link href="/giai-phap" className={topCls(active('/giai-phap'))}>Giải pháp</Link>
          )}
          {nav.services.length > 0 ? (
          <button
            type="button"
            className={topCls(active('/dich-vu') || panel === 'services')}
            aria-expanded={panel === 'services'}
            aria-controls="mega-services"
            onMouseEnter={() => setPanel('services')}
            onClick={() => setPanel(panel === 'services' ? null : 'services')}
          >
            Dịch vụ <ChevronDown aria-hidden className={`size-4 transition-transform ${panel === 'services' ? 'rotate-180' : ''}`} />
          </button>
          ) : (
            <Link href="/dich-vu" className={topCls(active('/dich-vu'))}>Dịch vụ</Link>
          )}
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={topCls(active(l.href))} onMouseEnter={() => setPanel(null)} aria-current={active(l.href) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}

          {panel === 'solutions' && (
            <div id="mega-solutions" className="absolute inset-x-0 top-full border-b border-border bg-white shadow-md">
              <div className="container-site grid grid-cols-12 gap-6 py-8">
                {telecom && (
                  <div className="col-span-4 rounded-lg bg-grid-navy p-6 text-white on-dark">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-500">Năng lực lõi</p>
                    <Link href={telecom.href} className="mt-2 flex items-center gap-2 font-display text-xl font-bold hover:text-brand-500">
                      <CapIcon code="T" dark /> {telecom.name}
                    </Link>
                    <p className="mt-2 text-sm text-white/75">{telecom.tagline}</p>
                    <ul className="mt-4 space-y-1.5">
                      {telecom.solutions.map((s) => (
                        <li key={s.href}>
                          <Link href={s.href} className="flex items-center gap-2 text-[15px] text-white/90 hover:text-brand-500">
                            <ArrowRight aria-hidden className="size-3.5 text-brand-500" /> {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="col-span-8 grid grid-cols-3 gap-x-6 gap-y-6">
                  {others.map((c) => (
                    <div key={c.code}>
                      <Link href={c.href} className="flex items-center gap-2 font-display text-[15px] font-semibold text-navy-900 hover:text-brand-700">
                        <CapIcon code={c.code} /> {c.name}
                      </Link>
                      <ul className="mt-2 space-y-1 border-l border-border pl-3">
                        {c.solutions.map((s) => (
                          <li key={s.href}>
                            <Link href={s.href} className="text-sm text-slate-600 hover:text-brand-700">{s.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="col-span-3 flex items-center justify-between border-t border-border pt-4">
                    <p className="text-sm text-slate-600">7 năng lực C·O·M·T·E·C·H, Viễn thông là năng lực lõi.</p>
                    <Link href="/giai-phap" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
                      Tổng quan giải pháp <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {panel === 'services' && (
            <div id="mega-services" className="absolute inset-x-0 top-full border-b border-border bg-white shadow-md">
              <div className="container-site grid grid-cols-12 gap-8 py-8">
                <div className="col-span-4">
                  <p className="font-display text-xl font-bold text-navy-900">Dịch vụ kỹ thuật</p>
                  <p className="mt-2 text-sm text-slate-600">Áp dụng cho mọi năng lực, từ khảo sát đến bảo dưỡng và ứng cứu thông tin.</p>
                  <Link href="/dich-vu" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
                    Tất cả dịch vụ <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
                <ul className="col-span-8 grid grid-cols-2 gap-x-8 gap-y-1">
                  {nav.services.map((s, i) => (
                    <li key={s.href}>
                      <Link href={s.href} className="flex items-center gap-3 rounded-md px-2 py-2 text-[15px] text-navy-900 hover:bg-surface-alt">
                        <span className="tabular font-mono text-[12px] text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {nav.workspaceUrl && (
            <a href={nav.workspaceUrl} className="hidden px-3 text-[15px] font-medium text-slate-600 hover:text-navy-900 xl:inline">
              Đăng nhập
            </a>
          )}
          <Link href="/yeu-cau-giai-phap" className="hidden min-h-11 items-center rounded-md bg-brand-500 px-5 text-[15px] font-semibold text-navy-900 shadow-sm hover:bg-brand-600 lg:inline-flex">
            Yêu cầu giải pháp
          </Link>
          {nav.hotline && (
            <a href={nav.hotline.href} className="grid size-11 place-items-center rounded-md text-navy-900 hover:bg-surface-alt lg:hidden" aria-label={`Gọi hotline ${nav.hotline.display}`}>
              <Phone aria-hidden className="size-5" />
            </a>
          )}
          <button type="button" className="grid size-11 place-items-center rounded-md text-navy-900 hover:bg-surface-alt lg:hidden" aria-label="Mở menu" aria-expanded={drawer} aria-controls="mobile-drawer" onClick={() => setDrawer(true)}>
            <Menu aria-hidden className="size-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer toàn màn hình, accordion 2 cấp, CTA cố định dưới (SPEC 32.3) */}
      {drawer && (
        <div id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="container-site flex h-16 items-center justify-between border-b border-border">
            <Wordmark />
            <button type="button" className="grid size-11 place-items-center rounded-md hover:bg-surface-alt" aria-label="Đóng menu" onClick={() => setDrawer(false)}>
              <X aria-hidden className="size-6" />
            </button>
          </div>
          <nav aria-label="Menu di động" className="container-site flex-1 overflow-y-auto py-2">
            <MobileGroup label="Giải pháp" open={acc === 'solutions'} onToggle={() => setAcc(acc === 'solutions' ? null : 'solutions')}>
              <Link href="/giai-phap" className="block py-2 font-medium text-brand-700">Tổng quan 7 năng lực</Link>
              {nav.capabilities.map((c) => (
                <Link key={c.code} href={c.href} className="flex items-center gap-2 py-2 text-navy-900">
                  <CapIcon code={c.code} /> {c.name}
                </Link>
              ))}
            </MobileGroup>
            <MobileGroup label="Dịch vụ" open={acc === 'services'} onToggle={() => setAcc(acc === 'services' ? null : 'services')}>
              <Link href="/dich-vu" className="block py-2 font-medium text-brand-700">Tất cả dịch vụ</Link>
              {nav.services.map((s) => (
                <Link key={s.href} href={s.href} className="block py-2 text-navy-900">{s.title}</Link>
              ))}
            </MobileGroup>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="flex min-h-14 items-center border-b border-border text-[17px] font-medium text-navy-900">
                {l.label}
              </Link>
            ))}
            <Link href="/lien-he" className="flex min-h-14 items-center border-b border-border text-[17px] font-medium text-navy-900">Liên hệ</Link>
          </nav>
          <div className="border-t border-border p-4">
            <Link href="/yeu-cau-giai-phap" className="flex min-h-12 w-full items-center justify-center rounded-md bg-brand-500 font-semibold text-navy-900">
              Yêu cầu giải pháp
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileGroup({ label, open, onToggle, children }: { label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-border">
      <button type="button" className="flex min-h-14 w-full items-center justify-between text-[17px] font-medium text-navy-900" aria-expanded={open} onClick={onToggle}>
        {label}
        <ChevronDown aria-hidden className={`size-5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-3 pl-3">{children}</div>}
    </div>
  );
}

function CapIcon({ code, dark }: { code: string; dark?: boolean }) {
  const Icon = CAPABILITY_ICON[code];
  if (!Icon) return null;
  return <Icon aria-hidden className={`size-4 ${dark ? 'text-brand-500' : 'text-brand-700'}`} />;
}

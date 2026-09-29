import { Cable, Cctv, Flame, House, Server, Wrench, Zap, RadioTower, type LucideIcon } from 'lucide-react';

export const CAPABILITY_ICON: Record<string, LucideIcon> = {
  T: RadioTower,
  E: Zap,
  M: Wrench,
  C2: Flame,
  C: Cctv,
  O: Server,
  H: House,
};

export const FallbackIcon = Cable;

/** Wordmark văn bản. Logo chính thức (SVG) cần COMTECH cung cấp [CONTENT REQUIRED]. */
export function Wordmark({ dark }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5" aria-label="COMTECH">
      <span aria-hidden className="grid size-8 place-items-center rounded-md bg-brand-500">
        <svg viewBox="0 0 24 24" className="size-5 text-navy-900" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 21V11" />
          <path d="M8.5 7.5a5 5 0 0 1 7 0" />
          <path d="M5.5 4.5a9 9 0 0 1 13 0" />
          <circle cx="12" cy="10.5" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className={`font-display text-[19px] font-extrabold tracking-[0.06em] ${dark ? 'text-white' : 'text-navy-900'}`}>COMTECH</span>
    </span>
  );
}

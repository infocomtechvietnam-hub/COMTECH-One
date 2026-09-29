import type { Metadata } from 'next';
import { CtaBand } from '@/components/chrome';
import { CAPABILITY_ICON, FallbackIcon } from '@/components/icons';
import { Chip, PageHero, SectionHeading } from '@/components/ui';
import { contact, content } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Năng lực',
  description: 'Hồ sơ năng lực COMTECH: công nghệ 2G-5G, kinh nghiệm thiết bị, khách hàng đã phục vụ.',
  alternates: { canonical: '/nang-luc' },
};

const TECH = [
  { t: '2G · 3G · 4G · 5G', d: 'Mạng di động các thế hệ' },
  { t: 'BTS · NodeB · eNodeB · gNodeB', d: 'Thiết bị vô tuyến theo công nghệ' },
  { t: 'C-RAN · Remote Sector', d: 'Kiến trúc vô tuyến tập trung' },
  { t: 'Nguồn 48VDC', d: 'Tủ nguồn, rectifier, acquy' },
  { t: 'Truyền dẫn quang', d: 'Cáp quang, măng xông, ODF, đo OTDR' },
];

/**
 * Hồ sơ năng lực (SPEC 32.2 /nang-luc). Các phần Đội ngũ, Chất lượng và an toàn,
 * Tải hồ sơ năng lực PDF ẩn cho tới khi có nội dung đã duyệt [CONTENT REQUIRED].
 */
export default function CapabilityProfilePage() {
  const c = contact();
  const caps = content.capabilities();
  const equipment = content.equipment();
  const clients = content.clients();
  return (
    <>
      <PageHero breadcrumb={[{ label: 'Năng lực' }]} eyebrow="Hồ sơ năng lực" title="Năng lực COMTECH" lead={c.foundedDate ? `Hoạt động từ ${c.foundedDate.slice(0, 4)} tại ${c.foundedPlace ?? 'Việt Nam'}, năng lực lõi là hạ tầng viễn thông.` : undefined} />

      <section id="cong-nghe" className="container-site py-14">
        <SectionHeading eyebrow="Công nghệ" title="Công nghệ đã triển khai" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TECH.map((x) => (
            <li key={x.t} className="rounded-lg border border-border p-5">
              <p className="font-mono text-[14px] font-semibold text-tech-700">{x.t}</p>
              <p className="mt-1.5 text-[14px] text-slate-600">{x.d}</p>
            </li>
          ))}
        </ul>
      </section>

      {caps.length > 0 && (
        <section className="bg-surface-alt py-14">
          <div className="container-site">
            <SectionHeading eyebrow="C·O·M·T·E·C·H" title="7 năng lực" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {caps.map((cap) => {
                const Icon = CAPABILITY_ICON[cap.code] ?? FallbackIcon;
                return (
                  <li key={cap.code} className="flex gap-4 rounded-lg bg-white p-5 shadow-sm">
                    <Icon aria-hidden className="size-6 shrink-0 text-brand-700" />
                    <div>
                      <p className="font-semibold">{cap.name}</p>
                      <p className="mt-1 text-[14px] text-slate-600">{cap.tagline}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {equipment.length > 0 && (
        <section id="thiet-bi" className="container-site py-14">
          <SectionHeading eyebrow="Thiết bị" title="Kinh nghiệm thiết bị các hãng" lead="COMTECH có kinh nghiệm triển khai thiết bị của các hãng dưới đây. Đây không phải chứng nhận đối tác hay phân phối ủy quyền." />
          <ul className="flex flex-wrap gap-3">{equipment.map((e) => <li key={e.name}><Chip tone="brand">{e.name} · {e.note}</Chip></li>)}</ul>
        </section>
      )}

      {clients.length > 0 && (
        <section id="khach-hang" className="container-site pb-14">
          <SectionHeading eyebrow="Khách hàng" title="Khách hàng đã phục vụ" />
          <ul className="flex flex-wrap gap-3">{clients.map((cl) => <li key={cl.name}><Chip>{cl.name}</Chip></li>)}</ul>
        </section>
      )}
      <CtaBand />
    </>
  );
}

import type { Metadata } from 'next';
import { CtaBand } from '@/components/chrome';
import { ReviewBadges } from '@/components/review';
import { Chip, PageHero, SectionHeading } from '@/components/ui';
import { contact, content, formatDateVi } from '@/lib/site';

export const metadata: Metadata = { title: 'Về COMTECH', description: 'Giới thiệu COMTECH: thông tin doanh nghiệp, thông điệp, năng lực và khách hàng đã phục vụ.', alternates: { canonical: '/ve-comtech' } };

export default function AboutPage() {
  const c = contact();
  const about = content.about();
  const caps = content.capabilities();
  const clients = content.clients();
  const facts = [
    c.legalName && ['Tên pháp lý', c.legalName],
    c.shortName && ['Tên viết tắt', c.shortName],
    c.foundedDate && ['Thành lập', `${formatDateVi(c.foundedDate)}${c.foundedPlace ? `, ${c.foundedPlace}` : ''}`],
    c.slogan && ['Thông điệp', c.slogan],
  ].filter(Boolean) as [string, string][];
  return (
    <>
      <PageHero breadcrumb={[{ label: 'Về COMTECH' }]} eyebrow="Về COMTECH" title="Kết nối · Vận hành · Phát triển bền vững" />
      <section className="container-site grid gap-10 py-14 md:grid-cols-12">
        <div className="space-y-4 text-[17px] text-slate-600 md:col-span-7">
          {about ? (
            <>
              <ReviewBadges v={about.visibility} />
              {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </>
          ) : (
            <p>COMTECH hoạt động trong lĩnh vực hạ tầng viễn thông và giải pháp kỹ thuật.</p>
          )}
        </div>
        <dl className="divide-y divide-border rounded-lg border border-border md:col-span-5">
          {facts.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[120px_1fr] gap-3 p-4 text-[15px]">
              <dt className="text-slate-500">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      {caps.length > 0 && (
        <section className="bg-surface-alt py-14">
          <div className="container-site">
            <SectionHeading eyebrow="C·O·M·T·E·C·H" title="7 năng lực" />
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
              {['C', 'O', 'M', 'T', 'E', 'C2', 'H'].map((code) => {
                const cap = caps.find((x) => x.code === code);
                if (!cap) return null;
                return (
                  <li key={code} className={`rounded-lg p-4 ${code === 'T' ? 'bg-navy-900 text-white' : 'bg-white'}`}>
                    <span className={`font-display text-[32px] font-extrabold ${code === 'T' ? 'text-brand-500' : 'text-brand-700'}`}>{cap.letter}</span>
                    <p className="mt-1 text-[14px] font-semibold">{cap.name_en}</p>
                    <p className={`text-[13px] ${code === 'T' ? 'text-white/70' : 'text-slate-600'}`}>{cap.name}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}
      {clients.length > 0 && (
        <section className="container-site py-14">
          <SectionHeading eyebrow="Khách hàng" title="Khách hàng và đối tác đã phục vụ" />
          <ul className="flex flex-wrap gap-3">{clients.map((cl) => <li key={cl.name}><Chip>{cl.name}</Chip></li>)}</ul>
        </section>
      )}
      <CtaBand />
    </>
  );
}

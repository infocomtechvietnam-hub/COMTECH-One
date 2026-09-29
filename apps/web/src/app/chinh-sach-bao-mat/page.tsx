import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReviewBadges } from '@/components/review';
import { PageHero } from '@/components/ui';
import { content } from '@/lib/site';

export const metadata: Metadata = { title: 'Chính sách xử lý dữ liệu cá nhân', alternates: { canonical: '/chinh-sach-bao-mat' } };

/** Chỉ tồn tại khi đã qua pháp lý (production). Bản xem trước hiển thị bản nháp có nhãn. */
export default function PrivacyPage() {
  const p = content.privacy();
  if (!p) notFound();
  return (
    <>
      <PageHero breadcrumb={[{ label: p.title }]} title={p.title}>
        <p className="mt-3 text-sm text-slate-500">Phiên bản: {p.updated_at}</p>
        <ReviewBadges v={p.visibility} className="mt-3" />
      </PageHero>
      <article className="container-site max-w-3xl space-y-8 py-14">
        {p.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-[20px] font-bold">{s.heading}</h2>
            {s.body.map((b) => <p key={b} className="mt-2 text-slate-600">{b}</p>)}
          </section>
        ))}
      </article>
    </>
  );
}

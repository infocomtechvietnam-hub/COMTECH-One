import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand } from '@/components/chrome';
import { ReviewBadges } from '@/components/review';
import { ButtonLink, EmptyState, PageHero } from '@/components/ui';
import { content, serviceHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Dịch vụ kỹ thuật',
  description: 'Khảo sát, thiết kế, thi công, lắp đặt, tích hợp, đo kiểm, commissioning, tối ưu, bảo dưỡng, swap, ứng cứu thông tin, hỗ trợ kỹ thuật.',
  alternates: { canonical: '/dich-vu' },
};

export default function ServicesPage() {
  const services = content.services();
  return (
    <>
      <PageHero breadcrumb={[{ label: 'Dịch vụ' }]} eyebrow="Dịch vụ kỹ thuật" title="Dịch vụ kỹ thuật" lead="Áp dụng chéo cho mọi năng lực, từ khảo sát ban đầu đến bảo dưỡng định kỳ và ứng cứu thông tin." />
      <section className="container-site py-14">
        {services.length === 0 ? (
          <EmptyState title="Nội dung đang được cập nhật" body="Vui lòng liên hệ để được tư vấn dịch vụ." action={<ButtonLink href="/lien-he">Liên hệ</ButtonLink>} />
        ) : (
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li key={s.code}>
                <Link href={serviceHref(s.slug)} className="group flex h-full flex-col rounded-lg border border-border p-6 hover:border-navy-900/20 hover:shadow-md">
                  <span className="tabular font-mono text-[13px] font-semibold text-brand-700">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="mt-2 text-[20px] font-semibold text-navy-900 group-hover:text-brand-700">{s.title}</h2>
                  <p className="mt-2 text-[15px] text-slate-600">{s.summary}</p>
                  <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-brand-700">Chi tiết <ArrowRight aria-hidden className="size-4" /></span>
                  <ReviewBadges v={s.visibility} className="mt-3" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
      <CtaBand />
    </>
  );
}

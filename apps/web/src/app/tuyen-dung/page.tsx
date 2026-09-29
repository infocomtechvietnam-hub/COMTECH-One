import type { Metadata } from 'next';
import { CtaBand } from '@/components/chrome';
import { EmptyState, PageHero } from '@/components/ui';
import { contact, content } from '@/lib/site';

export const metadata: Metadata = { title: 'Tuyển dụng', description: 'Cơ hội nghề nghiệp tại COMTECH.', alternates: { canonical: '/tuyen-dung' } };

/** Nộp hồ sơ trực tuyến (job_applications + consent + retention) sẽ làm ở phase sau (SPEC 10.11, 17). */
export default function CareersPage() {
  const jobs = content.jobs();
  const c = contact();
  return (
    <>
      <PageHero breadcrumb={[{ label: 'Tuyển dụng' }]} eyebrow="Tuyển dụng" title="Làm việc tại COMTECH" lead="Kỹ sư và kỹ thuật viên hạ tầng viễn thông, năng lượng, cơ điện." />
      <section className="container-site py-14">
        {jobs.length === 0 ? (
          <EmptyState
            title="Hiện chưa có vị trí đang tuyển"
            body={c.email ? `Các vị trí mới sẽ được đăng tại đây. Bạn có thể liên hệ ${c.email} để được thông tin khi có đợt tuyển dụng.` : 'Các vị trí mới sẽ được đăng tại đây.'}
          />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {jobs.map((j) => (
              <li key={j.slug} className="p-5">
                <p className="font-semibold">{j.title}</p>
                <p className="text-sm text-slate-600">{j.location} · {j.employment_type} · Hạn {j.deadline}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <CtaBand />
    </>
  );
}

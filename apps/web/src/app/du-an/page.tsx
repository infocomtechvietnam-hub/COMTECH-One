import type { Metadata } from 'next';
import { CaseStudyCard } from '@/components/cards';
import { CtaBand } from '@/components/chrome';
import { ButtonLink, EmptyState, PageHero } from '@/components/ui';
import { content } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Dự án tiêu biểu',
  description: 'Dự án hạ tầng viễn thông và kỹ thuật COMTECH đã thực hiện.',
  alternates: { canonical: '/du-an' },
};

/** Case study chỉ hiển thị khi dự án được COMTECH xác nhận quyền công khai (SPEC 31.4). */
export default function ProjectsPage() {
  const cases = content.caseStudies();
  return (
    <>
      <PageHero breadcrumb={[{ label: 'Dự án' }]} eyebrow="Dự án" title="Dự án tiêu biểu" lead="Các dự án được công bố sau khi khách hàng và COMTECH xác nhận quyền công khai thông tin." />
      <section className="container-site py-14">
        {cases.length === 0 ? (
          <EmptyState
            title="Danh sách dự án đang được cập nhật"
            body="Chúng tôi chỉ công bố dự án khi đã được khách hàng đồng ý. Hãy liên hệ để nhận hồ sơ năng lực và thông tin dự án phù hợp với nhu cầu của bạn."
            action={<ButtonLink href="/yeu-cau-giai-phap">Yêu cầu hồ sơ năng lực</ButtonLink>}
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{cases.map((cs) => <CaseStudyCard key={cs.slug} cs={cs} />)}</div>
        )}
      </section>
      <CtaBand />
    </>
  );
}

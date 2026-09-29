import type { Metadata } from 'next';
import { NewsCard } from '@/components/cards';
import { CtaBand } from '@/components/chrome';
import { EmptyState, PageHero } from '@/components/ui';
import { content } from '@/lib/site';

export const metadata: Metadata = { title: 'Tin tức', description: 'Tin công ty và Góc kỹ thuật COMTECH.', alternates: { canonical: '/tin-tuc' } };

export default function NewsPage() {
  const news = content.news();
  return (
    <>
      <PageHero breadcrumb={[{ label: 'Tin tức' }]} eyebrow="Tin tức" title="Tin tức và Góc kỹ thuật" />
      <section className="container-site py-14">
        {news.length === 0 ? (
          <EmptyState title="Chưa có bài viết" body="Tin công ty và bài viết kỹ thuật sẽ được đăng tại đây." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{news.map((n) => <NewsCard key={n.slug} n={n} />)}</div>
        )}
      </section>
      <CtaBand />
    </>
  );
}

import { ArrowRight, CircleCheck } from 'lucide-react';
import Link from 'next/link';
import { CtaBand } from '@/components/chrome';
import { CapabilityCard, CaseStudyCard, NewsCard } from '@/components/cards';
import { HeroArt } from '@/components/hero-art';
import { ReviewBadges } from '@/components/review';
import { ButtonLink, Chip, Eyebrow, SectionHeading } from '@/components/ui';
import { contact, content, serviceHref } from '@/lib/site';

/** Trang chủ theo SPEC 34.1 (13 section). Section không có dữ liệu được phép hiển thị thì ẩn cả section. */
export default function HomePage() {
  const c = contact();
  const caps = content.capabilities();
  const telecom = caps.find((x) => x.code === 'T');
  const services = content.services();
  const cases = content.caseStudies().slice(0, 6);
  const news = content.news().slice(0, 3);
  const clients = content.clients();
  const equipment = content.equipment();
  const about = content.about();
  const why = content.why();
  const foundedYear = c.foundedDate?.slice(0, 4) ?? null;
  const sitesStat = content.setting('stats.sites_and_services'); // null khi chưa xác minh → ẩn ô

  // Chỉ số năng lực: chỉ dữ kiện đã xác nhận (SPEC 34.1 mục 2)
  const stats = [
    foundedYear && { value: `Từ ${foundedYear}`, label: 'hoạt động trong lĩnh vực hạ tầng kỹ thuật' },
    typeof sitesStat === 'number' && { value: sitesStat.toLocaleString('vi-VN'), label: 'trạm và dịch vụ đã thực hiện' },
    caps.length > 0 && { value: String(caps.length), label: 'năng lực C·O·M·T·E·C·H' },
    telecom && { value: '2G → 5G', label: 'công nghệ mạng di động đã triển khai' },
  ].filter(Boolean) as { value: string; label: string }[];

  // Quy trình dịch vụ (SPEC 34.1 mục 5)
  const flow = ['SURVEY', 'DESIGN', 'CONSTRUCTION', 'TESTING', 'COMMISSIONING', 'MAINTENANCE', 'EMERGENCY_RESPONSE']
    .map((code) => services.find((s) => s.code === code))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-grid-navy on-dark">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-brand-500/10 blur-3xl" />
        <div className="container-site relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <Eyebrow dark>Telecommunications Infrastructure &amp; Technology Solutions</Eyebrow>
            <h1 className="text-[34px] font-extrabold leading-[1.1] text-white sm:text-[44px] lg:text-[56px]">
              Hạ tầng viễn thông <span className="text-brand-500">vận hành ổn định</span>, từ trạm phát sóng đến tuyến truyền dẫn
            </h1>
            <p className="mt-5 max-w-2xl text-[18px] text-white/75">
              Khảo sát, lắp đặt, tích hợp, đo kiểm, bảo dưỡng và ứng cứu thông tin cho mạng 2G đến 5G; cùng năng lượng, cơ điện, PCCC, camera, CNTT và Smart Home.
            </p>
            {c.slogan && <p className="mt-6 font-mono text-[13px] tracking-[0.18em] text-brand-500">{c.slogan}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/yeu-cau-giai-phap" arrow>Yêu cầu giải pháp</ButtonLink>
              <ButtonLink href="/nang-luc" variant="outline-light">Xem năng lực</ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-[520px]">
              <HeroArt />
            </div>
          </div>
        </div>

        {/* 2. Chỉ số năng lực */}
        {stats.length > 0 && (
          <div className="relative border-t border-white/10">
            <dl className="container-site grid grid-cols-2 gap-px md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="py-6 pr-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <p className="tabular font-display text-[26px] font-bold text-white md:text-[32px]">{s.value}</p>
                    <p className="mt-1 text-[14px] text-white/65">{s.label}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      {/* 3. Về COMTECH */}
      {about && (
        <section className="container-site grid gap-8 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <Eyebrow>Về COMTECH</Eyebrow>
            <h2 className="text-[26px] font-bold md:text-[32px]">Kết nối, vận hành và phát triển bền vững</h2>
            <ReviewBadges v={about.visibility} className="mt-3" />
          </div>
          <div className="space-y-4 text-[17px] text-slate-600 md:col-span-7 md:col-start-6">
            {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
            <Link href="/ve-comtech" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline">
              Tìm hiểu thêm <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 4. 7 năng lực */}
      {caps.length > 0 && (
        <section className="bg-surface-alt py-16 md:py-20">
          <div className="container-site">
            <SectionHeading
              eyebrow="Năng lực C·O·M·T·E·C·H"
              title="7 năng lực, một đầu mối kỹ thuật"
              lead="Viễn thông là năng lực lõi. Các năng lực khác bổ trợ cho hạ tầng kỹ thuật của nhà mạng, doanh nghiệp và công trình."
              action={<ButtonLink href="/giai-phap" variant="outline" arrow>Tổng quan giải pháp</ButtonLink>}
            />
            <div className="grid gap-5 md:grid-cols-2 lg:auto-rows-fr lg:grid-cols-4">
              {caps.map((cap) => <CapabilityCard key={cap.code} cap={cap} featured={cap.code === 'T'} />)}
              <Link href="/lien-he" className="group flex flex-col justify-center rounded-lg border border-dashed border-navy-900/25 p-6 hover:border-brand-500 hover:bg-brand-50 md:col-span-2">
                <p className="font-display text-[19px] font-semibold text-navy-900">Chưa rõ hạng mục phù hợp?</p>
                <p className="mt-1.5 text-[15px] text-slate-600">Mô tả hiện trạng và mục tiêu, kỹ sư COMTECH sẽ đề xuất phạm vi và phương án.</p>
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-700">Trao đổi với kỹ sư <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. Dịch vụ kỹ thuật: quy trình */}
      {flow.length > 0 && (
        <section className="container-site py-16 md:py-20">
          <SectionHeading eyebrow="Dịch vụ kỹ thuật" title="Trọn vòng đời hạ tầng" lead="Từ khảo sát ban đầu đến bảo dưỡng định kỳ và ứng cứu khi có sự cố." action={<ButtonLink href="/dich-vu" variant="outline" arrow>Tất cả dịch vụ</ButtonLink>} />
          <ol className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-7">
            {flow.map((s, i) => (
              <li key={s.code} className="bg-white">
                <Link href={serviceHref(s.slug)} className="group flex h-full flex-col p-5 hover:bg-brand-50">
                  <span className="tabular font-mono text-[13px] font-semibold text-brand-700">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mt-2 font-display text-[17px] font-semibold text-navy-900">{s.title}</span>
                  <span className="mt-1.5 text-[14px] text-slate-600">{s.summary}</span>
                  <ReviewBadges v={s.visibility} className="mt-auto pt-3" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 6. Hạ tầng viễn thông (section navy) */}
      {telecom && (
        <section className="bg-grid-navy py-16 text-white on-dark md:py-20">
          <div className="container-site grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow dark>Năng lực lõi</Eyebrow>
              <h2 className="text-[26px] font-bold md:text-[32px]">Hạ tầng mạng di động và truyền dẫn</h2>
              <p className="mt-4 text-white/75">{telecom.description}</p>
              <div className="mt-8">
                <ButtonLink href="/giai-phap/vien-thong" arrow>Giải pháp viễn thông</ButtonLink>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {[
                ['2G / 3G / 4G / 5G', 'Lắp đặt, nâng cấp, swap thiết bị trên trạm đang vận hành'],
                ['BTS · NodeB · eNodeB · gNodeB', 'RRU/AAU, BBU, anten, feeder, cáp quang'],
                ['C-RAN · Remote Sector', 'Hub tập trung, fronthaul quang tới điểm phủ sóng'],
                ['Nguồn 48VDC', 'Tủ nguồn, rectifier, acquy dự phòng'],
                ['Truyền dẫn', 'Thi công, hàn nối, đo OTDR, ứng cứu đứt cáp'],
                ['Bảo dưỡng · ƯCTT', 'Bảo dưỡng định kỳ và ứng cứu thông tin'],
              ].map(([t, d]) => (
                <li key={t} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-mono text-[14px] font-semibold text-brand-500">{t}</p>
                  <p className="mt-1.5 text-[15px] text-white/75">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 7. Công nghệ và thiết bị */}
      {equipment.length > 0 && (
        <section className="container-site py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <Eyebrow>Công nghệ và thiết bị</Eyebrow>
              <h2 className="text-[26px] font-bold md:text-[32px]">Kinh nghiệm triển khai thiết bị nhiều hãng</h2>
              <p className="mt-3 text-slate-600">Đây là kinh nghiệm triển khai thực tế, không phải quan hệ đối tác hay phân phối ủy quyền.</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 md:col-span-7 sm:grid-cols-4">
              {equipment.map((e) => (
                <li key={e.name} className="flex flex-col items-center justify-center rounded-lg border border-border bg-white px-4 py-6 text-center">
                  <span className="font-display text-[20px] font-bold text-navy-900">{e.name}</span>
                  <span className="mt-1 text-[12px] text-slate-500">{e.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 8. Dự án tiêu biểu */}
      {cases.length > 0 && (
        <section className="bg-surface-alt py-16 md:py-20">
          <div className="container-site">
            <SectionHeading eyebrow="Dự án" title="Dự án tiêu biểu" action={<ButtonLink href="/du-an" variant="outline" arrow>Tất cả dự án</ButtonLink>} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((cs) => <CaseStudyCard key={cs.slug} cs={cs} />)}
            </div>
          </div>
        </section>
      )}

      {/* 9. Vì sao chọn COMTECH */}
      {why && (
        <section className="container-site py-16 md:py-20">
          <SectionHeading eyebrow="Vì sao chọn COMTECH" title="Những điểm có thể kiểm chứng" />
          <ReviewBadges v={why.visibility} className="-mt-6 mb-6" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {why.points.map((p) => (
              <li key={p.title} className="rounded-lg border border-border p-6">
                <CircleCheck aria-hidden className="size-6 text-success-700" />
                <h3 className="mt-4 text-[17px] font-semibold text-navy-900">{p.title}</h3>
                <p className="mt-2 text-[15px] text-slate-600">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 10. Khách hàng: chỉ tên, chưa dùng logo khi chưa có quyền */}
      {clients.length > 0 && (
        <section className="border-y border-border bg-surface-alt py-12">
          <div className="container-site flex flex-col gap-6 md:flex-row md:items-center">
            <p className="shrink-0 text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-600 md:w-56">Khách hàng đã phục vụ</p>
            <ul className="flex flex-wrap gap-2.5">
              {clients.map((cl) => <li key={cl.name}><Chip>{cl.name}</Chip></li>)}
            </ul>
          </div>
        </section>
      )}

      {/* 11. Tin tức */}
      {news.length > 0 && (
        <section className="container-site py-16 md:py-20">
          <SectionHeading eyebrow="Tin tức" title="Tin mới và góc kỹ thuật" action={<ButtonLink href="/tin-tuc" variant="outline" arrow>Tất cả tin</ButtonLink>} />
          <div className="grid gap-5 md:grid-cols-3">
            {news.map((n) => <NewsCard key={n.slug} n={n} />)}
          </div>
        </section>
      )}

      {/* 12. CTA */}
      <CtaBand />
    </>
  );
}

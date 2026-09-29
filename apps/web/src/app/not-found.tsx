import Link from 'next/link';
import { ButtonLink } from '@/components/ui';

export default function NotFound() {
  return (
    <section className="container-site grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-mono text-[14px] font-semibold text-brand-700">404</p>
        <h1 className="mt-2 text-[32px] font-bold">Không tìm thấy trang</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600">Trang bạn tìm có thể đã được đổi địa chỉ hoặc chưa được công bố.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Về trang chủ</ButtonLink>
          <ButtonLink href="/giai-phap" variant="outline">Xem giải pháp</ButtonLink>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Hoặc <Link href="/lien-he" className="font-medium text-brand-700 underline">liên hệ</Link> với chúng tôi.
        </p>
      </div>
    </section>
  );
}

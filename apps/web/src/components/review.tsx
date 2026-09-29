import type { Visibility } from '@comtech/content';
import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Nhãn duyệt chỉ xuất hiện ở bản xem trước (production không bao giờ có
 * visibility.badges vì nội dung chưa duyệt đã bị lọc bỏ).
 */
export function ReviewBadges({ v, className = '' }: { v: Visibility; className?: string }) {
  if (v.badges.length === 0) return null;
  return (
    <span className={`inline-flex flex-wrap gap-1 ${className}`}>
      {v.badges.map((b) => (
        <span
          key={b}
          className={`rounded-sm px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-tight ${
            b === 'DỮ LIỆU MẪU' ? 'bg-danger-700 text-white' : b === 'CHỜ DUYỆT' ? 'bg-warning-700 text-white' : 'bg-navy-900 text-brand-500'
          }`}
        >
          {b}
        </span>
      ))}
    </span>
  );
}

export function DemoFrame({ v, children, className = '' }: { v: Visibility; children: ReactNode; className?: string }) {
  const demo = v.badges.includes('DỮ LIỆU MẪU');
  return <div className={`${demo ? 'demo-watermark' : ''} ${className}`}>{children}</div>;
}

export function PreviewBanner() {
  return (
    <div role="note" className="bg-warning-700 text-white">
      <div className="container-site flex items-center gap-2 py-2 text-[13px] font-medium">
        <TriangleAlert aria-hidden className="size-4 shrink-0" />
        <span>
          BẢN XEM TRƯỚC NỘI BỘ: có nội dung đang chờ duyệt và dữ liệu mẫu (được đánh dấu). Bản production chỉ hiển thị nội dung đã xác minh.
        </span>
      </div>
    </div>
  );
}

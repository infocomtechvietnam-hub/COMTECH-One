import type { z } from 'zod';
import type { newsSchema } from '../types';
import { demo } from './_governance';

type NewsInput = z.input<typeof newsSchema>;

/** Chưa có bài viết thật. Các bài dưới đây là DỮ LIỆU MẪU để duyệt bố cục. */
export const news: NewsInput[] = [
  {
    slug: 'mau-goc-ky-thuat-kiem-tra-acquy',
    title: '[Mẫu] Góc kỹ thuật: các bước kiểm tra acquy trạm viễn thông',
    date: '2026-09-15',
    category: 'TECH',
    summary: 'Bài mẫu minh họa bố cục chuyên mục Góc kỹ thuật.',
    body: ['Đoạn nội dung mẫu thứ nhất.', 'Đoạn nội dung mẫu thứ hai.'],
    governance: demo('news.mau-kiem-tra-acquy'),
  },
  {
    slug: 'mau-tin-cong-ty',
    title: '[Mẫu] Tin công ty',
    date: '2026-09-01',
    category: 'COMPANY',
    summary: 'Bài mẫu minh họa bố cục tin công ty.',
    body: ['Đoạn nội dung mẫu.'],
    governance: demo('news.mau-tin-cong-ty'),
  },
];

import type { z } from 'zod';
import type { caseStudySchema } from '../types';
import { demo } from './_governance';

type CaseStudyInput = z.input<typeof caseStudySchema>;

/**
 * CHƯA CÓ dự án nào được COMTECH xác nhận quyền công khai (G0.3 C4).
 * Hai mục dưới đây là DỮ LIỆU MẪU chỉ để duyệt bố cục trang ở STAGING;
 * không mang tên khách hàng thật, không có số liệu thật, bị chặn ở production.
 */
export const caseStudies: CaseStudyInput[] = [
  {
    slug: 'mau-nang-cap-5g-cum-tram',
    title: '[Mẫu] Nâng cấp thiết bị 5G cho cụm trạm đô thị',
    client_display: 'Một nhà mạng lớn tại Việt Nam',
    region: 'Tỉnh mẫu',
    year: 2026,
    capability_code: 'T',
    services: ['SURVEY', 'INSTALLATION', 'INTEGRATION', 'TESTING'],
    scope: 'Mô tả phạm vi mẫu: khảo sát, lắp đặt AAU và BBU, tích hợp, đo kiểm cho một cụm trạm.',
    challenge: 'Nội dung mẫu: thi công trên trạm đang phát sóng, cửa sổ thi công ngắn.',
    solution: 'Nội dung mẫu: chia ca thi công, checklist ảnh theo từng trạm, phối hợp tích hợp trực tiếp.',
    results: ['Kết quả mẫu 1 (thay bằng số liệu đã xác minh)', 'Kết quả mẫu 2'],
    governance: demo('case.mau-nang-cap-5g'),
  },
  {
    slug: 'mau-bao-duong-nguon-dc',
    title: '[Mẫu] Bảo dưỡng hệ thống nguồn DC theo lịch',
    client_display: 'Một đơn vị viễn thông tại khu vực phía Nam',
    region: 'Khu vực mẫu',
    year: 2025,
    capability_code: 'E',
    services: ['MAINTENANCE', 'TESTING'],
    scope: 'Mô tả phạm vi mẫu: bảo dưỡng tủ nguồn, đo kiểm acquy.',
    challenge: 'Nội dung mẫu.',
    solution: 'Nội dung mẫu.',
    results: ['Kết quả mẫu'],
    governance: demo('case.mau-bao-duong-nguon'),
  },
];

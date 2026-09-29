import type { z } from 'zod';
import type { serviceSchema } from '../types';
import { drafted } from './_governance';

type ServiceInput = z.input<typeof serviceSchema>;

/** Dịch vụ kỹ thuật: trục thứ hai, áp dụng chéo mọi năng lực (SPEC 32.1, 32.2). */
export const services: ServiceInput[] = [
  {
    code: 'SURVEY', slug: 'khao-sat', order: 1, title: 'Khảo sát',
    summary: 'Khảo sát hiện trạng vị trí, cột, phòng máy, nguồn và tuyến trước khi thiết kế và thi công.',
    scope: ['Khảo sát vị trí, mặt bằng, kết cấu', 'Khảo sát nguồn điện, tiếp địa', 'Chụp ảnh, đo đạc, ghi tọa độ'],
    deliverables: ['Báo cáo khảo sát kèm ảnh hiện trạng', 'Danh mục vật tư sơ bộ'],
    governance: drafted('service.khao-sat'),
  },
  {
    code: 'DESIGN', slug: 'thiet-ke', order: 2, title: 'Thiết kế',
    summary: 'Lập phương án kỹ thuật và bản vẽ lắp đặt theo yêu cầu dự án.',
    scope: ['Phương án lắp đặt', 'Bản vẽ bố trí thiết bị', 'Bảng khối lượng (BOQ)'],
    deliverables: ['Hồ sơ thiết kế', 'BOQ'],
    governance: drafted('service.thiet-ke'),
  },
  {
    code: 'CONSTRUCTION', slug: 'thi-cong', order: 3, title: 'Thi công xây lắp',
    summary: 'Thi công hạng mục hạ tầng: tuyến cáp, nhà trạm, hệ thống cơ điện.',
    scope: ['Thi công tuyến cáp', 'Hạng mục cơ điện', 'An toàn lao động tại công trường'],
    deliverables: ['Nhật ký thi công', 'Ảnh hiện trường theo hạng mục'],
    governance: drafted('service.thi-cong'),
  },
  {
    code: 'INSTALLATION', slug: 'lap-dat', order: 4, title: 'Lắp đặt',
    summary: 'Lắp đặt thiết bị vô tuyến, truyền dẫn, nguồn và thiết bị phụ trợ.',
    scope: ['Lắp RRU/AAU, BBU, anten', 'Lắp tủ nguồn, acquy', 'Đấu nối cáp nguồn, cáp quang'],
    deliverables: ['Checklist lắp đặt', 'Ảnh bằng chứng theo từng mục'],
    governance: drafted('service.lap-dat'),
  },
  {
    code: 'INTEGRATION', slug: 'tich-hop', order: 5, title: 'Tích hợp',
    summary: 'Phối hợp tích hợp thiết bị với hệ thống của nhà mạng và hãng.',
    scope: ['Phối hợp với trung tâm điều hành', 'Kiểm tra cảnh báo', 'Xác nhận hoạt động'],
    deliverables: ['Biên bản tích hợp'],
    governance: drafted('service.tich-hop'),
  },
  {
    code: 'TESTING', slug: 'do-kiem', order: 6, title: 'Đo kiểm',
    summary: 'Đo kiểm thông số kỹ thuật sau lắp đặt và định kỳ.',
    scope: ['Đo suy hao, OTDR', 'Đo kiểm nguồn, acquy', 'Đo tiếp địa'],
    deliverables: ['Kết quả đo lưu theo trạm/tuyến'],
    governance: drafted('service.do-kiem'),
  },
  {
    code: 'COMMISSIONING', slug: 'commissioning', order: 7, title: 'Commissioning',
    summary: 'Chạy thử, nghiệm thu và bàn giao đưa vào khai thác.',
    scope: ['Chạy thử', 'Lập hồ sơ nghiệm thu', 'Bàn giao'],
    deliverables: ['Hồ sơ nghiệm thu theo trạm'],
    governance: drafted('service.commissioning'),
  },
  {
    code: 'OPTIMIZATION', slug: 'toi-uu', order: 8, title: 'Tối ưu',
    summary: 'Hỗ trợ điều chỉnh vật lý tại trạm theo yêu cầu tối ưu mạng.',
    scope: ['Chỉnh góc anten', 'Kiểm tra, xử lý lỗi phần cứng'],
    deliverables: ['Báo cáo thực hiện kèm ảnh trước/sau'],
    governance: drafted('service.toi-uu'),
  },
  {
    code: 'MAINTENANCE', slug: 'bao-duong', order: 9, title: 'Bảo dưỡng',
    summary: 'Bảo dưỡng định kỳ trạm, nguồn, tuyến cáp và hệ thống kỹ thuật.',
    scope: ['Bảo dưỡng theo lịch', 'Kiểm tra, vệ sinh thiết bị', 'Ghi nhận và đề xuất khắc phục'],
    deliverables: ['Biên bản bảo dưỡng kèm ảnh theo checklist'],
    governance: drafted('service.bao-duong'),
  },
  {
    code: 'SWAP_RELOCATION', slug: 'swap-di-doi', order: 10, title: 'Swap, di dời, tháo dỡ',
    summary: 'Thay thế thiết bị thế hệ cũ, di dời hoặc tháo dỡ trạm theo kế hoạch.',
    scope: ['Tháo dỡ, thu hồi thiết bị', 'Lắp đặt thiết bị thay thế', 'Kiểm kê vật tư thu hồi'],
    deliverables: ['Biên bản thu hồi, bàn giao vật tư'],
    governance: drafted('service.swap-di-doi'),
  },
  {
    code: 'EMERGENCY_RESPONSE', slug: 'ung-cuu-thong-tin', order: 11, title: 'Ứng cứu thông tin',
    summary: 'Xử lý sự cố hạ tầng: đứt cáp, mất nguồn, hỏng thiết bị.',
    scope: ['Tiếp nhận và điều phối sự cố', 'Xử lý tại hiện trường', 'Báo cáo nguyên nhân và khắc phục'],
    deliverables: ['Báo cáo sự cố'],
    governance: drafted('service.ung-cuu-thong-tin'),
  },
  {
    code: 'TECH_SUPPORT', slug: 'ho-tro-ky-thuat', order: 12, title: 'Hỗ trợ kỹ thuật',
    summary: 'Hỗ trợ kỹ thuật tại chỗ và từ xa cho hệ thống đã triển khai.',
    scope: ['Tư vấn kỹ thuật', 'Hỗ trợ xử lý lỗi'],
    deliverables: ['Phiếu hỗ trợ'],
    governance: drafted('service.ho-tro-ky-thuat'),
  },
];

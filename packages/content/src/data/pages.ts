import type { z } from 'zod';
import type { jobSchema, legalPageSchema } from '../types';
import { blocked, drafted } from './_governance';

// Stub constant (from @comtech/contracts)
const CONSENT_VERSION = '2026-09-29';

type LegalInput = z.input<typeof legalPageSchema>;
type JobInput = z.input<typeof jobSchema>;

/**
 * Chính sách xử lý dữ liệu cá nhân: BẢN NHÁP KỸ THUẬT, chưa phải văn bản pháp lý.
 * Theo SPEC 17, form lead chỉ được thu thập dữ liệu khi trang này đã được duyệt
 * và publish. Khi còn nhãn [LEGAL REVIEW REQUIRED], website production tự khóa form.
 */
export const privacyPolicy: LegalInput = {
  slug: 'chinh-sach-bao-mat',
  title: 'Chính sách xử lý dữ liệu cá nhân',
  updated_at: CONSENT_VERSION,
  sections: [
    {
      heading: 'Bên kiểm soát và xử lý dữ liệu',
      body: [
        'CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ KỸ THUẬT COMTECH (COMTECH), email info@comtechvietnam.vn.',
        'Địa chỉ trụ sở: [DATA CONFLICT - VERIFY BEFORE PUBLICATION].',
      ],
    },
    {
      heading: 'Dữ liệu chúng tôi thu thập qua website',
      body: [
        'Khi bạn gửi form Yêu cầu giải pháp: họ tên, tên công ty, email, số điện thoại, ngành, dịch vụ quan tâm, loại dự án, khu vực, thời gian dự kiến, mô tả nhu cầu.',
        'Dữ liệu kỹ thuật phục vụ an toàn hệ thống: địa chỉ IP, thời điểm gửi, trang gửi form.',
      ],
    },
    {
      heading: 'Mục đích và căn cứ xử lý',
      body: [
        'Liên hệ tư vấn, báo giá và trao đổi kỹ thuật theo yêu cầu của bạn, trên cơ sở sự đồng ý của bạn khi đánh dấu ô đồng ý trên form.',
        'Chống spam và bảo vệ hệ thống.',
      ],
    },
    {
      heading: 'Thời hạn lưu trữ',
      body: ['[COMTECH INPUT REQUIRED] Thời hạn lưu dữ liệu yêu cầu tư vấn (G0.3 B3).'],
    },
    {
      heading: 'Chia sẻ dữ liệu',
      body: ['COMTECH không bán dữ liệu cá nhân. Dữ liệu chỉ được truy cập bởi nhân sự có nhiệm vụ xử lý yêu cầu của bạn.'],
    },
    {
      heading: 'Quyền của bạn',
      body: [
        'Bạn có quyền được biết, đồng ý hoặc rút lại sự đồng ý, truy cập, yêu cầu chỉnh sửa, xóa, hạn chế xử lý dữ liệu cá nhân của mình theo quy định pháp luật.',
        'Gửi yêu cầu tới info@comtechvietnam.vn.',
      ],
    },
    {
      heading: 'Căn cứ pháp lý',
      body: ['Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và văn bản hướng dẫn. [LEGAL REVIEW REQUIRED]'],
    },
  ],
  governance: blocked(
    'page.privacy-policy',
    ['[LEGAL REVIEW REQUIRED]', '[COMTECH INPUT REQUIRED]'],
    'PENDING',
    'Bản nháp kỹ thuật theo SPEC 17; cần luật sư duyệt, điền thời hạn lưu và địa chỉ trụ sở',
  ),
};

/** Đoạn giới thiệu trang Về COMTECH (câu chữ chờ PO duyệt). */
export const aboutIntro = {
  paragraphs: [
    'COMTECH được thành lập ngày 15/07/2013 tại TP. Hồ Chí Minh, hoạt động trong lĩnh vực hạ tầng viễn thông và giải pháp kỹ thuật.',
    'Năng lực của COMTECH được tổ chức theo 7 mảng C·O·M·T·E·C·H: Camera, Office IT, M&E, Telecom, Energy, PCCC và Smart Home, trong đó Viễn thông là năng lực lõi.',
  ],
  governance: drafted('page.about-intro'),
};

/** Chưa có tin tuyển dụng được cung cấp. */
export const jobs: JobInput[] = [];

/**
 * "Vì sao chọn COMTECH" (SPEC 34.1 mục 9): mỗi điểm phải có dẫn chứng,
 * không tuyên bố tuyệt đối ("số 1", "duy nhất"). Dẫn chứng ghi ở trường evidence.
 */
export const whyComtech = {
  points: [
    { title: 'Hoạt động từ 2013', body: 'Thành lập ngày 15/07/2013 tại TP. Hồ Chí Minh.', evidence: 'Company profile' },
    { title: 'Năng lực lõi viễn thông', body: 'Kinh nghiệm thực tế với mạng di động 2G đến 5G, trạm BTS, NodeB, eNodeB, gNodeB, C-RAN và truyền dẫn.', evidence: 'Company profile' },
    { title: 'Kinh nghiệm thiết bị nhiều hãng', body: 'Đã triển khai thiết bị Huawei, Ericsson, Nokia và ZTE.', evidence: 'Company profile (kinh nghiệm triển khai)' },
    { title: 'Một đầu mối, nhiều năng lực', body: 'Viễn thông, năng lượng, cơ điện, PCCC, camera, CNTT và Smart Home trong cùng một đơn vị.', evidence: '7 năng lực C·O·M·T·E·C·H' },
  ],
  governance: drafted('page.why-comtech'),
};

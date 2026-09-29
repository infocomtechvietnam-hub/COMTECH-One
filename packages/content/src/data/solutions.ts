import type { z } from 'zod';
import type { solutionSchema } from '../types';
import { drafted } from './_governance';

type SolutionInput = z.input<typeof solutionSchema>;

/**
 * Giải pháp theo 7 năng lực (SPEC 32.1). Template trang: Vấn đề → Giải pháp →
 * Dịch vụ → Công nghệ → Dự án liên quan → FAQ → CTA (SPEC 34.2).
 * Không nêu số liệu, thời gian cam kết hay danh hiệu chưa kiểm chứng.
 */
export const solutions: SolutionInput[] = [
  // ---------- T · Viễn thông ----------
  {
    capability_code: 'T',
    slug: 'ha-tang-vien-thong',
    title: 'Hạ tầng viễn thông',
    summary:
      'Triển khai và duy trì hạ tầng mạng cho nhà mạng và hãng thiết bị: từ khảo sát vị trí, lắp đặt, tích hợp đến bảo dưỡng và ứng cứu thông tin.',
    problems: [
      'Tiến độ phủ sóng phụ thuộc nhiều đội thi công ở nhiều tỉnh, khó kiểm soát chất lượng đồng đều.',
      'Hồ sơ nghiệm thu, ảnh hiện trường và biên bản đo kiểm phân tán, dễ thiếu khi bàn giao.',
      'Sự cố hạ tầng cần phản ứng nhanh ngoài giờ hành chính.',
    ],
    approach: [
      { title: 'Một đầu mối kỹ thuật', body: 'Một đội dự án chịu trách nhiệm từ khảo sát đến bàn giao, phối hợp trực tiếp với kỹ sư của nhà mạng và hãng.' },
      { title: 'Quy trình theo từng trạm', body: 'Mỗi trạm có checklist công việc, ảnh bằng chứng và kết quả đo kiểm gắn với mã trạm.' },
      { title: 'Đội kỹ thuật theo khu vực', body: 'Bố trí nhân lực theo khu vực để rút ngắn thời gian di chuyển khi thi công và ứng cứu.' },
    ],
    services: ['SURVEY', 'INSTALLATION', 'INTEGRATION', 'TESTING', 'COMMISSIONING', 'MAINTENANCE', 'EMERGENCY_RESPONSE'],
    technologies: ['2G / 3G / 4G / 5G', 'BTS, NodeB, eNodeB, gNodeB', 'C-RAN, Remote Sector', 'Nguồn 48VDC', 'Truyền dẫn cáp quang'],
    faq: [
      { q: 'COMTECH làm việc với những hãng thiết bị nào?', a: 'COMTECH có kinh nghiệm triển khai thiết bị của Huawei, Ericsson, Nokia và ZTE. Đây là kinh nghiệm triển khai, không phải quan hệ đối tác ủy quyền.' },
      { q: 'Có nhận triển khai theo gói nhiều trạm tại nhiều tỉnh không?', a: 'Có. Phạm vi và tiến độ được thống nhất theo từng dự án sau khi khảo sát.' },
    ],
    seo_title: 'Hạ tầng viễn thông | COMTECH',
    seo_description: 'Khảo sát, lắp đặt, tích hợp, đo kiểm, bảo dưỡng và ứng cứu thông tin cho hạ tầng mạng di động và truyền dẫn.',
    governance: drafted('solution.ha-tang-vien-thong'),
  },
  {
    capability_code: 'T',
    slug: 'tram-bts-mang-di-dong',
    title: 'Trạm BTS và mạng di động 2G-5G',
    summary: 'Lắp đặt mới, mở rộng, nâng cấp và swap thiết bị vô tuyến tại trạm BTS, NodeB, eNodeB và gNodeB.',
    problems: [
      'Nâng cấp công nghệ (4G lên 5G) trên trạm đang vận hành, không được gián đoạn dịch vụ kéo dài.',
      'Thiết bị nhiều hãng, nhiều thế hệ cùng tồn tại trên một trạm.',
      'Cần bằng chứng lắp đặt rõ ràng để nghiệm thu từng hạng mục.',
    ],
    approach: [
      { title: 'Khảo sát trước thi công', body: 'Kiểm tra cột, phòng máy, nguồn, không gian lắp đặt; lập phương án và danh mục vật tư theo từng trạm.' },
      { title: 'Lắp đặt và tích hợp', body: 'Lắp đặt RRU/AAU, BBU, anten, feeder, cáp quang; phối hợp tích hợp với trung tâm điều hành của nhà mạng.' },
      { title: 'Đo kiểm và bàn giao', body: 'Đo kiểm theo yêu cầu kỹ thuật của dự án, chụp ảnh theo checklist, lập hồ sơ nghiệm thu theo trạm.' },
    ],
    services: ['SURVEY', 'INSTALLATION', 'INTEGRATION', 'TESTING', 'COMMISSIONING', 'SWAP_RELOCATION'],
    technologies: ['RRU / RRH / AAU', 'BBU', 'Anten, feeder, jumper', 'SFP, cáp quang'],
    faq: [],
    governance: drafted('solution.tram-bts-mang-di-dong'),
  },
  {
    capability_code: 'T',
    slug: 'cap-quang-truyen-dan',
    title: 'Cáp quang và truyền dẫn',
    summary: 'Thi công, hàn nối, đo kiểm và bảo dưỡng tuyến cáp quang, kết nối truyền dẫn cho trạm và khách hàng doanh nghiệp.',
    problems: [
      'Tuyến cáp đi qua nhiều địa hình, dễ đứt do thi công hạ tầng khác.',
      'Thiếu bản đồ tuyến và hồ sơ măng xông cập nhật khi xử lý sự cố.',
    ],
    approach: [
      { title: 'Thi công tuyến', body: 'Kéo cáp treo, cáp cống, lắp măng xông, ODF theo thiết kế được duyệt.' },
      { title: 'Đo kiểm', body: 'Hàn nối và đo suy hao, đo OTDR; lưu kết quả đo theo từng tuyến.' },
      { title: 'Bảo dưỡng và ứng cứu', body: 'Kiểm tra định kỳ, xử lý sự cố đứt cáp và cập nhật hồ sơ tuyến sau mỗi lần can thiệp.' },
    ],
    services: ['SURVEY', 'DESIGN', 'CONSTRUCTION', 'TESTING', 'MAINTENANCE', 'EMERGENCY_RESPONSE'],
    technologies: ['Cáp quang treo, cáp cống', 'Măng xông, ODF', 'Đo OTDR'],
    faq: [],
    governance: drafted('solution.cap-quang-truyen-dan'),
  },
  {
    capability_code: 'T',
    slug: 'c-ran-remote-sector',
    title: 'C-RAN và Remote Sector',
    summary: 'Triển khai kiến trúc vô tuyến tập trung và sector từ xa: đặt BBU tại hub, kéo quang tới các điểm RRU.',
    problems: ['Khó có mặt bằng đặt phòng máy tại từng vị trí phủ sóng.', 'Cần mở rộng vùng phủ nhanh tại khu vực mật độ cao.'],
    approach: [
      { title: 'Thiết kế hub và tuyến quang', body: 'Xác định vị trí hub, phương án truyền dẫn fronthaul tới từng điểm sector.' },
      { title: 'Lắp đặt và tích hợp', body: 'Lắp BBU tại hub, RRU và anten tại điểm phủ, đấu nối và tích hợp với mạng lõi.' },
    ],
    services: ['SURVEY', 'DESIGN', 'INSTALLATION', 'INTEGRATION', 'TESTING'],
    technologies: ['C-RAN hub', 'Fronthaul quang', 'Remote sector'],
    faq: [],
    governance: drafted('solution.c-ran-remote-sector'),
  },
  // ---------- E · Năng lượng ----------
  {
    capability_code: 'E',
    slug: 'he-thong-nguon-48vdc',
    title: 'Hệ thống nguồn 48VDC, tủ nguồn và acquy',
    summary: 'Lắp đặt, nâng cấp và bảo dưỡng hệ thống nguồn DC cho trạm viễn thông và phòng máy.',
    problems: ['Mất điện lưới làm gián đoạn trạm nếu acquy xuống cấp.', 'Tải thiết bị tăng khi nâng cấp công nghệ, nguồn cũ không đáp ứng.'],
    approach: [
      { title: 'Đánh giá tải', body: 'Khảo sát tải hiện tại và tải sau nâng cấp để chọn cấu hình rectifier và dung lượng acquy.' },
      { title: 'Lắp đặt và thay thế', body: 'Lắp tủ nguồn, module rectifier, acquy; đấu nối, kiểm tra cảnh báo.' },
      { title: 'Bảo dưỡng', body: 'Đo kiểm acquy, vệ sinh tủ, kiểm tra cảnh báo nguồn theo lịch.' },
    ],
    services: ['SURVEY', 'INSTALLATION', 'TESTING', 'MAINTENANCE', 'SWAP_RELOCATION'],
    technologies: ['Nguồn 48VDC', 'Rectifier', 'Acquy'],
    faq: [],
    governance: drafted('solution.he-thong-nguon-48vdc'),
  },
  {
    capability_code: 'E',
    slug: 'nang-luong-tai-tao',
    title: 'Năng lượng tái tạo',
    summary: 'Giải pháp điện mặt trời kết hợp nguồn lưới và acquy cho trạm và công trình.',
    problems: ['Chi phí điện năng vận hành cao.', 'Khu vực nguồn lưới không ổn định.'],
    approach: [{ title: 'Khảo sát và thiết kế', body: 'Đánh giá vị trí, tải tiêu thụ và phương án kết hợp nguồn phù hợp.' }],
    services: ['SURVEY', 'DESIGN', 'INSTALLATION', 'MAINTENANCE'],
    technologies: ['Điện mặt trời', 'Hybrid nguồn lưới và acquy'],
    faq: [],
    governance: drafted('solution.nang-luong-tai-tao'),
  },
  // ---------- M · Cơ điện ----------
  {
    capability_code: 'M',
    slug: 'co-dien-cong-trinh',
    title: 'Cơ điện công trình',
    summary: 'Thi công và bảo dưỡng hệ thống điện, chiếu sáng, điều hòa thông gió, tiếp địa, chống sét.',
    problems: ['Nhiều hạng mục cơ điện do nhiều nhà thầu, khó phối hợp.', 'Hệ thống tiếp địa, chống sét không đạt yêu cầu gây hỏng thiết bị.'],
    approach: [{ title: 'Thi công theo thiết kế', body: 'Thi công, kiểm tra và bàn giao từng hạng mục theo bản vẽ được duyệt.' }],
    services: ['DESIGN', 'CONSTRUCTION', 'INSTALLATION', 'TESTING', 'MAINTENANCE'],
    technologies: ['Điện động lực', 'Chiếu sáng', 'Điều hòa, thông gió', 'Tiếp địa, chống sét'],
    faq: [],
    governance: drafted('solution.co-dien-cong-trinh'),
  },
  // ---------- C · PCCC ----------
  {
    capability_code: 'C2',
    slug: 'phong-chay-chua-chay',
    title: 'Phòng cháy chữa cháy và truyền tin báo cháy',
    summary: 'Lắp đặt, bảo dưỡng hệ thống báo cháy, chữa cháy và thiết bị truyền tin báo cháy.',
    problems: ['Nhà trạm, phòng máy cần phát hiện cháy sớm khi không có người trực.'],
    approach: [{ title: 'Lắp đặt và bảo dưỡng', body: 'Lắp đặt thiết bị theo hồ sơ thiết kế, kiểm tra định kỳ và lập biên bản.' }],
    services: ['INSTALLATION', 'TESTING', 'MAINTENANCE'],
    technologies: ['Báo cháy tự động', 'Thiết bị truyền tin báo cháy'],
    faq: [],
    governance: drafted('solution.phong-chay-chua-chay'),
  },
  // ---------- C · Camera ----------
  {
    capability_code: 'C',
    slug: 'camera-giam-sat',
    title: 'Camera an ninh và giám sát',
    summary: 'Thiết kế, lắp đặt và bảo dưỡng hệ thống camera cho văn phòng, nhà xưởng và nhà trạm.',
    problems: ['Khu vực nhà trạm, kho bãi xa, khó giám sát trực tiếp.'],
    approach: [{ title: 'Thiết kế theo điểm cần giám sát', body: 'Chọn vị trí, loại camera, lưu trữ và đường truyền phù hợp hiện trạng.' }],
    services: ['SURVEY', 'DESIGN', 'INSTALLATION', 'MAINTENANCE'],
    technologies: ['Camera IP', 'Đầu ghi, lưu trữ', 'Giám sát tập trung'],
    faq: [],
    governance: drafted('solution.camera-giam-sat'),
  },
  // ---------- O · Office IT ----------
  {
    capability_code: 'O',
    slug: 'ha-tang-cntt-van-phong',
    title: 'Hạ tầng CNTT văn phòng',
    summary: 'Cáp cấu trúc, mạng LAN/WiFi và hỗ trợ kỹ thuật cho văn phòng doanh nghiệp.',
    problems: ['Mạng nội bộ chắp vá sau nhiều lần mở rộng.'],
    approach: [{ title: 'Khảo sát và chuẩn hóa', body: 'Khảo sát hiện trạng, đề xuất và thi công hệ thống cáp, mạng theo chuẩn.' }],
    services: ['SURVEY', 'DESIGN', 'INSTALLATION', 'TECH_SUPPORT'],
    technologies: ['Cáp cấu trúc', 'LAN / WiFi'],
    faq: [],
    governance: drafted('solution.ha-tang-cntt-van-phong'),
  },
  {
    capability_code: 'O',
    slug: 'data-center-phong-may',
    title: 'Data Center và phòng máy',
    summary: 'Thi công phòng máy, tủ rack, nguồn, làm mát và giám sát môi trường.',
    problems: ['Phòng máy quá nhiệt, thiếu nguồn dự phòng.'],
    approach: [{ title: 'Thiết kế và thi công', body: 'Bố trí rack, nguồn, làm mát, tiếp địa và giám sát theo quy mô.' }],
    services: ['DESIGN', 'CONSTRUCTION', 'INSTALLATION', 'MAINTENANCE'],
    technologies: ['Tủ rack', 'Nguồn UPS / DC', 'Làm mát', 'Giám sát môi trường'],
    faq: [],
    governance: drafted('solution.data-center-phong-may'),
  },
  // ---------- H · Smart Home ----------
  {
    capability_code: 'H',
    slug: 'nha-thong-minh',
    title: 'Nhà thông minh',
    summary: 'Điều khiển chiếu sáng, thiết bị và an ninh trong nhà qua hạ tầng kết nối.',
    problems: ['Thiết bị nhiều hãng, khó điều khiển tập trung.'],
    approach: [{ title: 'Tư vấn và lắp đặt', body: 'Khảo sát nhu cầu, đề xuất cấu hình và lắp đặt.' }],
    services: ['SURVEY', 'INSTALLATION', 'TECH_SUPPORT'],
    technologies: ['Điều khiển chiếu sáng', 'Thiết bị thông minh'],
    faq: [],
    governance: drafted('solution.nha-thong-minh'),
  },
  {
    capability_code: 'H',
    slug: 'smart-building-city',
    title: 'Smart Building và Smart City',
    summary: 'Ứng dụng kết nối và giám sát cho tòa nhà, khu đô thị.',
    problems: ['Hệ thống tòa nhà vận hành rời rạc.'],
    approach: [{ title: 'Tích hợp hệ thống', body: 'Kết nối các hệ thống kỹ thuật về một điểm giám sát.' }],
    services: ['DESIGN', 'INTEGRATION', 'MAINTENANCE'],
    technologies: ['Giám sát tập trung', 'IoT'],
    faq: [],
    governance: drafted('solution.smart-building-city'),
  },
];

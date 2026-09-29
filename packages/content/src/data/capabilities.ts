import type { z } from 'zod';
import type { capabilitySchema } from '../types';
import { drafted } from './_governance';

type CapabilityInput = z.input<typeof capabilitySchema>;

/**
 * 7 năng lực C·O·M·T·E·C·H: trục phân loại chính của website (SPEC 32.1).
 * Telecom là năng lực lõi, luôn đứng đầu (order = 1).
 * Mô tả chỉ nêu phạm vi công việc, không nêu số liệu hay tuyên bố chưa kiểm chứng.
 */
export const capabilities: CapabilityInput[] = [
  {
    code: 'T',
    letter: 'T',
    slug: 'vien-thong',
    order: 1,
    name: 'Viễn thông',
    name_en: 'Telecom',
    tagline: 'Hạ tầng mạng di động và truyền dẫn từ 2G đến 5G',
    description:
      'Năng lực lõi của COMTECH: khảo sát, lắp đặt, tích hợp, đo kiểm, bảo dưỡng và ứng cứu thông tin cho trạm BTS, NodeB, eNodeB, gNodeB, C-RAN, remote sector và tuyến truyền dẫn cáp quang.',
    highlights: ['Trạm BTS / NodeB / eNodeB / gNodeB', 'C-RAN và Remote Sector', 'Cáp quang và truyền dẫn', 'Swap, di dời, tháo dỡ thiết bị'],
    governance: drafted('capability.t'),
  },
  {
    code: 'E',
    letter: 'E',
    slug: 'nang-luong',
    order: 2,
    name: 'Năng lượng',
    name_en: 'Energy',
    tagline: 'Nguồn điện ổn định cho hạ tầng kỹ thuật',
    description:
      'Hệ thống nguồn 48VDC, tủ nguồn, rectifier và acquy cho trạm viễn thông và phòng máy; giải pháp năng lượng tái tạo cho công trình.',
    highlights: ['Nguồn 48VDC, tủ nguồn, rectifier', 'Acquy dự phòng', 'Năng lượng tái tạo'],
    governance: drafted('capability.e'),
  },
  {
    code: 'M',
    letter: 'M',
    slug: 'co-dien',
    order: 3,
    name: 'Cơ điện (M&E)',
    name_en: 'M&E',
    tagline: 'Hệ thống cơ điện cho công trình',
    description: 'Thi công, lắp đặt và bảo dưỡng hệ thống cơ điện công trình: điện động lực, chiếu sáng, điều hòa thông gió, tiếp địa và chống sét.',
    highlights: ['Điện động lực và chiếu sáng', 'Điều hòa, thông gió', 'Tiếp địa, chống sét'],
    governance: drafted('capability.m'),
  },
  {
    code: 'C2',
    letter: 'C',
    slug: 'pccc',
    order: 4,
    name: 'Phòng cháy chữa cháy',
    name_en: 'Fire protection',
    tagline: 'PCCC và truyền tin báo cháy',
    description: 'Lắp đặt, bảo dưỡng hệ thống phòng cháy chữa cháy và thiết bị truyền tin báo cháy cho nhà trạm, phòng máy và công trình.',
    highlights: ['Hệ thống báo cháy', 'Thiết bị truyền tin báo cháy', 'Bảo dưỡng định kỳ'],
    governance: drafted('capability.c2'),
  },
  {
    code: 'C',
    letter: 'C',
    slug: 'camera',
    order: 5,
    name: 'Camera an ninh',
    name_en: 'Camera & surveillance',
    tagline: 'Giám sát an ninh cho công trình và hạ tầng',
    description: 'Thiết kế, lắp đặt và bảo dưỡng hệ thống camera an ninh, giám sát cho văn phòng, nhà xưởng, nhà trạm và khu vực công cộng.',
    highlights: ['Camera IP, đầu ghi', 'Giám sát tập trung', 'Bảo dưỡng hệ thống'],
    governance: drafted('capability.c'),
  },
  {
    code: 'O',
    letter: 'O',
    slug: 'cntt-van-phong',
    order: 6,
    name: 'Hạ tầng CNTT văn phòng',
    name_en: 'Office IT',
    tagline: 'Mạng, máy chủ và phòng máy cho doanh nghiệp',
    description: 'Hạ tầng mạng LAN/WiFi, cáp cấu trúc, phòng máy và Data Center quy mô doanh nghiệp.',
    highlights: ['Cáp cấu trúc, LAN/WiFi', 'Phòng máy, Data Center', 'Hỗ trợ kỹ thuật'],
    governance: drafted('capability.o'),
  },
  {
    code: 'H',
    letter: 'H',
    slug: 'nha-thong-minh',
    order: 7,
    name: 'Smart Home',
    name_en: 'Smart Home',
    tagline: 'Nhà và tòa nhà thông minh',
    description: 'Giải pháp nhà thông minh, Smart Building và các ứng dụng đô thị thông minh dựa trên hạ tầng kết nối.',
    highlights: ['Nhà thông minh', 'Smart Building', 'Smart City'],
    governance: drafted('capability.h'),
  },
];

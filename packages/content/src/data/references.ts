import type { z } from 'zod';
import type { namedItemSchema } from '../types';
import { blocked, fromProfile } from './_governance';

type NamedInput = z.input<typeof namedItemSchema>;

/**
 * Khách hàng đã phục vụ (MASTER PROMPT 3.1): chỉ nêu tên dạng chữ.
 * Logo khách hàng cần xác nhận quyền sử dụng thương hiệu nên CHƯA dùng logo.
 */
export const clientsServed: NamedInput[] = [
  { name: 'VinaPhone / VNPT', governance: fromProfile('client.vnpt') },
  { name: 'MobiFone', governance: fromProfile('client.mobifone') },
  { name: 'Viettel', governance: fromProfile('client.viettel') },
  { name: 'Vietnamobile', governance: fromProfile('client.vietnamobile') },
  { name: 'Vishipel', governance: fromProfile('client.vishipel') },
];

export const clientLogosPermission: NamedInput = {
  name: 'Logo khách hàng',
  governance: blocked('client.logos', ['[VERIFY BEFORE PUBLICATION]'], 'PENDING', 'Cần văn bản cho phép dùng logo (G0.3 C5)'),
};

/**
 * Kinh nghiệm thiết bị. Bắt buộc ghi "kinh nghiệm triển khai",
 * KHÔNG ghi "đối tác chính thức / nhà phân phối ủy quyền" (MASTER PROMPT 3.1, 14.7).
 */
export const equipmentExperience: NamedInput[] = [
  { name: 'Huawei', note: 'Kinh nghiệm triển khai', governance: fromProfile('vendor.huawei') },
  { name: 'Ericsson', note: 'Kinh nghiệm triển khai', governance: fromProfile('vendor.ericsson') },
  { name: 'Nokia', note: 'Kinh nghiệm triển khai', governance: fromProfile('vendor.nokia') },
  { name: 'ZTE', note: 'Kinh nghiệm triển khai', governance: fromProfile('vendor.zte') },
];

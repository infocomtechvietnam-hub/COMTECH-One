import type { z } from 'zod';
import type { settingSchema } from '../types';
import { blocked, fromProfile } from './_governance';

type SettingInput = z.input<typeof settingSchema>;

/**
 * Thông tin công ty công khai (SPEC 10.12 settings, key company.*).
 * Chỉ key VERIFIED mới xuất hiện trên website production (footer, liên hệ, schema.org).
 */
export const settings: SettingInput[] = [
  { key: 'company.legal_name', value: 'CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ KỸ THUẬT COMTECH', governance: fromProfile('setting.company-legal-name') },
  { key: 'company.short_name', value: 'COMT Co., Ltd.', governance: fromProfile('setting.company-short-name') },
  { key: 'company.brand', value: 'COMTECH', governance: fromProfile('setting.company-brand') },
  { key: 'company.founded_date', value: '2013-07-15', governance: fromProfile('setting.company-founded-date') },
  { key: 'company.founded_place', value: 'TP. Hồ Chí Minh', governance: fromProfile('setting.company-founded-place') },
  { key: 'company.website', value: 'https://www.comtechvietnam.vn', governance: fromProfile('setting.company-website') },
  { key: 'company.hotline', value: '+84888804567', governance: fromProfile('setting.company-hotline') },
  { key: 'company.phone', value: '+842839683268', governance: fromProfile('setting.company-phone') },
  { key: 'company.email', value: 'info@comtechvietnam.vn', governance: fromProfile('setting.company-email') },
  { key: 'company.slogan', value: 'KẾT NỐI · VẬN HÀNH · PHÁT TRIỂN BỀN VỮNG', governance: fromProfile('setting.company-slogan') },
  {
    key: 'company.hq_address',
    value: null,
    governance: blocked(
      'setting.company-hq-address',
      ['[DATA CONFLICT - VERIFY BEFORE PUBLICATION]'],
      'CONFLICT',
      'Tên phường/địa chỉ khác nhau giữa các phần profile; cần cập nhật theo đơn vị hành chính 2 cấp từ 01/07/2025 (G0.3 C2)',
    ),
  },
  {
    key: 'company.tax_code',
    value: null,
    governance: blocked('setting.company-tax-code', ['[COMTECH INPUT REQUIRED]'], 'MISSING', 'Chưa có trong nguồn (G0.3 C3)'),
  },
  {
    key: 'stats.sites_and_services',
    value: 9674,
    governance: blocked(
      'setting.stats-sites-and-services',
      ['[DATA CONFLICT - VERIFY BEFORE PUBLICATION]'],
      'CONFLICT',
      'Profile ghi 9.674 cho giai đoạn 2013-2025; biểu đồ thống kê dùng phạm vi năm khác (G0.3 C1). Chưa xác minh thì ẩn cả ô.',
    ),
  },
  {
    key: 'stats.provinces_served',
    value: null,
    governance: blocked('setting.stats-provinces-served', ['[DATA SOURCE REQUIRED]'], 'MISSING', 'Chưa có nguồn số tỉnh đã phục vụ'),
  },
  {
    key: 'workspace.url',
    value: null,
    governance: blocked('setting.workspace-url', ['[COMTECH INPUT REQUIRED]'], 'MISSING', 'Workspace (app.comtechvietnam.vn) chưa triển khai; ẩn nút Đăng nhập'),
  },
];

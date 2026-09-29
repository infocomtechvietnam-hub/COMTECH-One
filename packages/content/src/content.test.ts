import { describe, expect, it } from 'vitest';
import { buildRepository, contentReport, createContent, evaluate, resolveMode } from './index';

describe('chế độ hiển thị', () => {
  it('mặc định là production', () => expect(resolveMode({})).toBe('production'));
  it('preview khi CONTENT_PREVIEW=true', () => expect(resolveMode({ CONTENT_PREVIEW: 'true' })).toBe('preview'));
  it('cấm preview ở APP_ENV=production', () =>
    expect(() => resolveMode({ CONTENT_PREVIEW: 'true', APP_ENV: 'production' })).toThrow());
});

describe('No Fake Data (MASTER PROMPT 3.3)', () => {
  const prod = createContent('production');

  it('production không có bất kỳ dữ liệu DEMO nào', () => {
    expect(prod.caseStudies()).toHaveLength(0);
    expect(prod.news()).toHaveLength(0);
  });

  it('số liệu xung đột bị ẩn hẳn (không để số tạm)', () => {
    expect(prod.setting('stats.sites_and_services')).toBeNull();
    expect(prod.setting('company.hq_address')).toBeNull();
    expect(prod.setting('company.tax_code')).toBeNull();
  });

  it('thông tin liên hệ đã xác nhận được hiển thị', () => {
    expect(prod.setting('company.hotline')).toBe('+84888804567');
    expect(prod.setting('company.email')).toBe('info@comtechvietnam.vn');
  });

  it('kinh nghiệm thiết bị luôn ghi "Kinh nghiệm triển khai", không ghi đối tác ủy quyền', () => {
    for (const e of prod.equipment()) {
      expect(e.note).toBe('Kinh nghiệm triển khai');
      expect(JSON.stringify(e).toLowerCase()).not.toMatch(/ủy quyền|authorized|official partner/);
    }
  });

  it('form lead khóa ở production khi chính sách dữ liệu chưa duyệt pháp lý', () => {
    expect(prod.leadFormEnabled()).toBe(false);
  });

  it('không dùng logo khách hàng khi chưa có quyền', () => {
    expect(prod.clientLogosAllowed()).toBe(false);
  });

  it('không có tuyên bố tuyệt đối chưa kiểm chứng trong nội dung', () => {
    const repo = buildRepository();
    const blob = JSON.stringify(repo).toLowerCase();
    for (const banned of ['số 1', 'hàng đầu', 'duy nhất', 'đối tác chính thức', 'nhà phân phối ủy quyền']) {
      expect(blob).not.toContain(banned);
    }
  });
});

describe('chế độ xem trước', () => {
  const preview = createContent('preview');

  it('hiển thị DEMO kèm nhãn DỮ LIỆU MẪU', () => {
    const cs = preview.caseStudies();
    expect(cs.length).toBeGreaterThan(0);
    for (const c of cs) expect(c.visibility.badges).toContain('DỮ LIỆU MẪU');
  });

  it('nội dung chờ duyệt có nhãn CHỜ DUYỆT', () => {
    const t = preview.capability('vien-thong');
    expect(t?.visibility.badges).toContain('CHỜ DUYỆT');
  });

  it('số liệu xung đột bị ẩn cả ở bản xem trước', () => {
    expect(preview.setting('stats.sites_and_services')).toBeNull();
    expect(preview.setting('company.hq_address')).toBeNull();
  });

  it('Viễn thông luôn đứng đầu danh sách năng lực', () => {
    expect(preview.capabilities()[0]?.code).toBe('T');
    expect(preview.capabilities()).toHaveLength(7);
  });
});

describe('sổ duyệt', () => {
  it('duyệt một mục làm mục đó hiển thị ở production', () => {
    const repo = buildRepository({ 'capability.t': { reviewed_by: 'PO', reviewed_at: '2026-10-01' } });
    const prod = createContent('production', repo);
    expect(prod.capability('vien-thong')).not.toBeNull();
    expect(prod.capability('nang-luong')).toBeNull();
  });

  it('không cho duyệt mục DEMO', () => {
    expect(() => buildRepository({ 'case.mau-nang-cap-5g': { reviewed_by: 'PO', reviewed_at: 'x' } })).toThrow(/DEMO/);
  });

  it('không cho duyệt mục còn nhãn mở', () => {
    expect(() => buildRepository({ 'setting.company-hq-address': { reviewed_by: 'PO', reviewed_at: 'x' } })).toThrow(/nhãn mở/);
  });

  it('không cho duyệt id không tồn tại', () => {
    expect(() => buildRepository({ 'khong-ton-tai': { reviewed_by: 'PO', reviewed_at: 'x' } })).toThrow();
  });
});

describe('báo cáo', () => {
  it('mọi mục bị chặn đều có lý do', () => {
    for (const r of contentReport()) if (!r.publishable) expect(r.reasons.length).toBeGreaterThan(0);
  });
  it('evaluate chặn DEMO dù đã VERIFIED', () => {
    const v = evaluate(
      { id: 'x', status: 'PUBLISHED', verification_status: 'VERIFIED', open_labels: [], data_origin: 'DEMO', source: 's' },
      'production',
    );
    expect(v.visible).toBe(false);
  });
});

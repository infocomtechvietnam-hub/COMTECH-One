import { describe, expect, it } from 'vitest';
import { CONSENT_VERSION, leadCreateSchema } from './lead';
import { formatVnPhone, normalizeVnPhone } from './phone';

const valid = {
  full_name: '  Nguyễn   Văn A ',
  company_name: 'Công ty X',
  email: ' A@Example.COM ',
  phone: '0912 345 678',
  message: 'Cần khảo sát 10 trạm',
  consent: true,
  consent_version: CONSENT_VERSION,
};

describe('normalizeVnPhone', () => {
  it.each([
    ['0912345678', '+84912345678'],
    ['+84 912 345 678', '+84912345678'],
    ['84912345678', '+84912345678'],
    ['028 3968 3268', '+842839683268'],
    ['(+84) 8888 04567', '+84888804567'],
  ])('%s -> %s', (input, out) => expect(normalizeVnPhone(input)).toBe(out));

  it.each(['12345', '0123', 'abc', '+1 415 555 0100', '09123456789'])('từ chối %s', (input) =>
    expect(normalizeVnPhone(input)).toBeNull(),
  );

  it('định dạng hiển thị', () => {
    expect(formatVnPhone('+84912345678')).toBe('0912 345 678');
    expect(formatVnPhone('+842839683268')).toBe('028 3968 3268');
  });
});

describe('leadCreateSchema', () => {
  it('chuẩn hóa dữ liệu hợp lệ', () => {
    const r = leadCreateSchema.parse(valid);
    expect(r.full_name).toBe('Nguyễn Văn A');
    expect(r.email).toBe('a@example.com');
    expect(r.phone).toBe('+84912345678');
    expect(r.service_interest).toEqual([]);
  });

  it('bắt buộc đồng ý xử lý dữ liệu', () => {
    const r = leadCreateSchema.safeParse({ ...valid, consent: false });
    expect(r.success).toBe(false);
  });

  it('từ chối phiên bản chính sách cũ', () => {
    expect(leadCreateSchema.safeParse({ ...valid, consent_version: '2020' }).success).toBe(false);
  });

  it('từ chối trường không khai báo (mass assignment)', () => {
    const r = leadCreateSchema.safeParse({ ...valid, status: 'CONVERTED', owner_employee_id: 'x' });
    expect(r.success).toBe(false);
  });

  it('từ chối mã danh mục không hợp lệ', () => {
    expect(leadCreateSchema.safeParse({ ...valid, industry_code: 'HACK' }).success).toBe(false);
    expect(leadCreateSchema.safeParse({ ...valid, service_interest: ['SURVEY', 'X'] }).success).toBe(false);
  });

  it('báo lỗi tiếng Việt theo trường', () => {
    const r = leadCreateSchema.safeParse({ ...valid, email: 'sai', phone: '123', message: '   ' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const fields = r.error.issues.map((i) => i.path.join('.'));
      expect(fields).toEqual(expect.arrayContaining(['email', 'phone', 'message']));
      expect(r.error.issues.find((i) => i.path[0] === 'phone')?.message).toContain('Việt Nam');
    }
  });
});

/**
 * Chuẩn hóa số điện thoại Việt Nam sang E.164 (+84...), SPEC 35.2.
 * Chấp nhận: 0912345678, 0912 345 678, +84912345678, 84912345678,
 * số bàn 028 3968 3268 (11 chữ số có số 0 đầu).
 * Trả về null nếu không hợp lệ.
 */
export function normalizeVnPhone(input: string): string | null {
  const digits = input.replace(/[\s.\-()]/g, '');
  if (!/^\+?\d+$/.test(digits)) return null;

  let national: string;
  if (digits.startsWith('+84')) national = digits.slice(3);
  else if (digits.startsWith('84') && digits.length >= 11) national = digits.slice(2);
  else if (digits.startsWith('0')) national = digits.slice(1);
  else return null;

  // Di động: 9 chữ số (3|5|7|8|9 đầu). Cố định: 10 chữ số bắt đầu bằng 2.
  // Hotline dạng 8888 04567 của COMTECH: 9 chữ số bắt đầu bằng 8, nằm trong nhóm di động.
  const mobile = /^[35789]\d{8}$/;
  const landline = /^2\d{9}$/;
  if (!mobile.test(national) && !landline.test(national)) return null;
  return `+84${national}`;
}

/** Hiển thị kiểu Việt Nam: 0912 345 678 hoặc 028 3968 3268. */
export function formatVnPhone(e164: string): string {
  const national = '0' + e164.replace(/^\+84/, '');
  if (national.length === 10) return `${national.slice(0, 4)} ${national.slice(4, 7)} ${national.slice(7)}`;
  if (national.length === 11) return `${national.slice(0, 3)} ${national.slice(3, 7)} ${national.slice(7)}`;
  return national;
}

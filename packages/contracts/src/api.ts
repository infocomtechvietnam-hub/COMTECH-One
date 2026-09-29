/** Envelope và mã lỗi chuẩn theo SPEC 18.2, 18.4. */

export const ERROR_CODES = {
  AUTHENTICATION_REQUIRED: { http: 401, message: 'Vui lòng đăng nhập lại.' },
  PERMISSION_DENIED: { http: 403, message: 'Bạn không có quyền thực hiện thao tác này.' },
  NOT_FOUND: { http: 404, message: 'Không tìm thấy dữ liệu.' },
  VALIDATION_ERROR: { http: 422, message: 'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra các trường được đánh dấu.' },
  DUPLICATE: { http: 409, message: 'Dữ liệu đã tồn tại. Vui lòng kiểm tra mã hoặc tên trước khi tiếp tục.' },
  IDEMPOTENCY_KEY_REQUIRED: { http: 428, message: 'Thiếu khóa chống gửi trùng. Vui lòng tải lại trang.' },
  IDEMPOTENCY_KEY_REUSED: { http: 422, message: 'Yêu cầu trùng khóa nhưng khác nội dung.' },
  RATE_LIMITED: { http: 429, message: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.' },
  INTERNAL_ERROR: { http: 500, message: 'Đã có lỗi xảy ra. Mã hỗ trợ: {request_id}.' },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export interface ErrorDetail {
  field: string;
  code: string;
  message: string;
}

export interface ApiMeta {
  request_id: string;
  page?: number;
  page_size?: number;
  total?: number;
  next_cursor?: string | null;
}

export type ApiEnvelope<T> =
  | { success: true; data: T; meta: ApiMeta; error: null }
  | {
      success: false;
      data: null;
      meta: ApiMeta;
      error: { code: ErrorCode; message: string; details?: ErrorDetail[] };
    };

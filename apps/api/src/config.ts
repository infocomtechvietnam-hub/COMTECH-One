import { z } from 'zod';

/**
 * Cấu hình từ biến môi trường, kiểm tra khi khởi động (fail fast).
 * Secret không có giá trị mặc định (SPEC 16.4).
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(['dev', 'staging', 'production']).default('dev'),
  PORT: z.coerce.number().int().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL bắt buộc'),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).default(10),
  /** Danh sách origin website được gọi API, phân tách dấu phẩy. */
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  /** Số proxy tin cậy phía trước (Nginx/Cloudflare) để lấy IP thật. */
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).default(1),
  /** Cloudflare Turnstile. Không đặt = tắt captcha (chỉ chấp nhận ở dev). */
  TURNSTILE_SECRET: z.string().optional(),
  LEAD_RATE_LIMIT_PER_MIN: z.coerce.number().int().min(1).default(30),
  // Email (worker)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  MAIL_FROM: z.string().default('COMTECH <no-reply@comtechvietnam.vn>'),
  LEAD_NOTIFY_TO: z.string().optional(),
  OUTBOX_POLL_MS: z.coerce.number().int().min(200).default(5000),
});

export type AppConfig = z.infer<typeof schema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const r = schema.safeParse(env);
  if (!r.success) {
    // Không in giá trị biến (có thể chứa secret), chỉ in tên và lỗi.
    const msg = r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Cấu hình không hợp lệ: ${msg}`);
  }
  const cfg = r.data;
  if (cfg.APP_ENV === 'production' && !cfg.TURNSTILE_SECRET) {
    throw new Error('TURNSTILE_SECRET bắt buộc ở production (chống spam form công khai, SPEC 34.3)');
  }
  return cfg;
}

export const APP_CONFIG = Symbol('APP_CONFIG');

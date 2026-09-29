import nodemailer, { type Transporter } from 'nodemailer';
import type { AppConfig } from '../config';

export interface MailMessage {
  to: string[];
  subject: string;
  text: string;
}

export interface Mailer {
  readonly enabled: boolean;
  send(msg: MailMessage): Promise<void>;
}

/** SMTP qua nodemailer. Không cấu hình SMTP_HOST (dev) thì bỏ qua gửi, không lỗi. */
export function createMailer(cfg: AppConfig): Mailer {
  if (!cfg.SMTP_HOST) {
    return { enabled: false, async send() {} };
  }
  const transport: Transporter = nodemailer.createTransport({
    host: cfg.SMTP_HOST,
    port: cfg.SMTP_PORT,
    secure: cfg.SMTP_PORT === 465,
    auth: cfg.SMTP_USER ? { user: cfg.SMTP_USER, pass: cfg.SMTP_PASSWORD ?? '' } : undefined,
  });
  return {
    enabled: true,
    async send(msg) {
      if (msg.to.length === 0) return;
      await transport.sendMail({ from: cfg.MAIL_FROM, to: msg.to.join(', '), subject: msg.subject, text: msg.text });
    },
  };
}

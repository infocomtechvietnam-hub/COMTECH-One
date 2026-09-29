'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { CircleCheck, Lock, TriangleAlert } from 'lucide-react';
import { z } from 'zod';

// Constants (inline from @comtech/contracts)
const CONSENT_VERSION = '2026-09-29';
const INDUSTRIES = ['Telecom', 'Energy', 'IT Infrastructure', 'Smart Building', 'Other'] as const;
const PROJECT_TYPES = ['Infrastructure', 'Services', 'Consulting', 'Maintenance'] as const;
const TIMELINES = ['Immediate (0-1 month)', 'Short-term (1-3 months)', 'Medium-term (3-6 months)', 'Long-term (6+ months)', 'Undecided'] as const;

// Schema
const leadCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
}).strict();

// Types
interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface LeadCreatedResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface Props {
  enabled: boolean;
  apiUrl: string;
  services: { code: string; title: string }[];
  fallback: { hotline: string | null; hotlineHref: string | null; email: string | null };
  turnstileSiteKey?: string;
}

type Errors = Partial<Record<string, string>>;
type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; code: string | null } | { kind: 'error'; message: string; requestId?: string };

const newKey = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `k${Date.now()}${Math.random().toString(36).slice(2)}`);

/**
 * Form "Yêu cầu giải pháp" (SPEC 34.3).
 * Validate phía client bằng CÙNG schema với API (@comtech/contracts) để báo lỗi sớm;
 * API vẫn validate lại (N3). Idempotency-Key giữ nguyên qua các lần thử lại
 * để mạng chập chờn không tạo lead trùng.
 */
export function LeadForm({ enabled, apiUrl, services, fallback, turnstileSiteKey }: Props) {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>({ kind: 'idle' });
  const keyRef = useRef<string>(newKey());
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  useEffect(() => {
    if (!turnstileSiteKey || !enabled) return;
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    document.head.appendChild(s);
    return () => s.remove();
  }, [turnstileSiteKey, enabled]);

  const utm = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const p = new URLSearchParams(window.location.search);
    const out: Record<string, string> = {};
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const v = p.get(k);
      if (v) out[k] = v.slice(0, 200);
    }
    return Object.keys(out).length ? out : undefined;
  }, []);

  if (!enabled) {
    return (
      <div className="rounded-lg border border-border bg-surface-alt p-6">
        <p className="flex items-center gap-2 font-display text-lg font-semibold text-navy-900">
          <Lock aria-hidden className="size-5 text-brand-700" /> Form trực tuyến đang được hoàn thiện
        </p>
        <p className="mt-2 text-slate-600">
          Chúng tôi sẽ mở form sau khi hoàn tất chính sách xử lý dữ liệu cá nhân. Trong thời gian này, vui lòng liên hệ trực tiếp:
        </p>
        <ul className="mt-3 space-y-1">
          {fallback.hotline && fallback.hotlineHref && (
            <li>Hotline: <a href={fallback.hotlineHref} className="tabular font-semibold text-brand-700 hover:underline">{fallback.hotline}</a></li>
          )}
          {fallback.email && (
            <li>Email: <a href={`mailto:${fallback.email}`} className="font-semibold text-brand-700 hover:underline">{fallback.email}</a></li>
          )}
        </ul>
      </div>
    );
  }

  if (state.kind === 'done') {
    return (
      <div role="status" className="rounded-lg border border-success-700/30 bg-success-700/5 p-6">
        <p className="flex items-center gap-2 font-display text-xl font-semibold text-navy-900">
          <CircleCheck aria-hidden className="size-6 text-success-700" /> Đã gửi yêu cầu
        </p>
        {state.code && (
          <p className="mt-3 text-slate-600">
            Mã yêu cầu của bạn: <span className="font-mono text-lg font-semibold text-navy-900">{state.code}</span>
          </p>
        )}
        <p className="mt-2 text-slate-600">Bộ phận kinh doanh COMTECH sẽ liên hệ lại theo thông tin bạn cung cấp.</p>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const opt = (k: string) => {
      const v = String(fd.get(k) ?? '').trim();
      return v === '' ? undefined : v;
    };
    const payload = {
      full_name: String(fd.get('full_name') ?? ''),
      company_name: String(fd.get('company_name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      industry_code: opt('industry_code'),
      service_interest: fd.getAll('service_interest').map(String),
      project_type: opt('project_type'),
      location_text: opt('location_text'),
      estimated_timeline: opt('estimated_timeline'),
      message: String(fd.get('message') ?? ''),
      consent: fd.get('consent') === 'on',
      consent_version: CONSENT_VERSION,
      landing_page: window.location.pathname,
      utm,
      website: opt('website'),
      captcha_token: opt('cf-turnstile-response'),
    };

    const check = leadCreateSchema.safeParse(payload);
    if (!check.success) {
      const errs: Errors = {};
      for (const i of check.error.issues) {
        const f = String(i.path[0] ?? '_root');
        errs[f] ??= i.message;
      }
      setErrors(errs);
      setState({ kind: 'idle' });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setState({ kind: 'sending' });
    try {
      const res = await fetch(`${apiUrl}/api/v1/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': keyRef.current, 'Accept-Language': 'vi' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => null)) as ApiEnvelope<LeadCreatedResponse> | null;
      if (body?.success) {
        setState({ kind: 'done', code: body.data.lead_code });
        return;
      }
      if (body && !body.success && body.error.code === 'VALIDATION_ERROR' && body.error.details) {
        const errs: Errors = {};
        for (const d of body.error.details) errs[d.field.split('.')[0] ?? '_root'] ??= d.message;
        setErrors(errs);
        setState({ kind: 'idle' });
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setState({ kind: 'error', message: body?.error?.message ?? 'Không gửi được yêu cầu. Vui lòng thử lại.', requestId: body?.meta.request_id });
    } catch {
      setState({ kind: 'error', message: 'Không kết nối được máy chủ. Kiểm tra mạng và thử lại; yêu cầu sẽ không bị gửi trùng.' });
    }
  }

  const errCount = Object.keys(errors).length;
  const f = (name: string) => ({
    id: `${uid}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-err` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6">
      {errCount > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-md border border-danger-700/30 bg-danger-700/5 p-4 text-sm text-danger-700">
          <p className="font-semibold">Vui lòng kiểm tra {errCount} trường được đánh dấu.</p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Họ và tên" required err={errors.full_name} fid={`${uid}-full_name`}>
          <input {...f('full_name')} autoComplete="name" maxLength={160} className={input(errors.full_name)} />
        </Field>
        <Field label="Công ty" required err={errors.company_name} fid={`${uid}-company_name`}>
          <input {...f('company_name')} autoComplete="organization" maxLength={255} className={input(errors.company_name)} />
        </Field>
        <Field label="Email" required err={errors.email} fid={`${uid}-email`}>
          <input {...f('email')} type="email" autoComplete="email" inputMode="email" maxLength={254} className={input(errors.email)} />
        </Field>
        <Field label="Điện thoại" required err={errors.phone} fid={`${uid}-phone`} hint="Ví dụ: 0912 345 678">
          <input {...f('phone')} type="tel" autoComplete="tel" inputMode="tel" maxLength={20} className={input(errors.phone)} />
        </Field>
        <Field label="Ngành" err={errors.industry_code} fid={`${uid}-industry_code`}>
          <select {...f('industry_code')} className={input(errors.industry_code)} defaultValue="">
            <option value="">Chọn ngành</option>
            {INDUSTRIES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Loại dự án" err={errors.project_type} fid={`${uid}-project_type`}>
          <select {...f('project_type')} className={input(errors.project_type)} defaultValue="">
            <option value="">Chọn loại dự án</option>
            {PROJECT_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Tỉnh/thành, khu vực" err={errors.location_text} fid={`${uid}-location_text`}>
          <input {...f('location_text')} maxLength={160} className={input(errors.location_text)} />
        </Field>
        <Field label="Thời gian dự kiến" err={errors.estimated_timeline} fid={`${uid}-estimated_timeline`}>
          <select {...f('estimated_timeline')} className={input(errors.estimated_timeline)} defaultValue="">
            <option value="">Chọn thời gian</option>
            {TIMELINES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
      </div>

      {services.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-[15px] font-medium text-navy-900">Dịch vụ quan tâm</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <label key={s.code} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border px-3 text-[15px] hover:border-navy-900/40 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                <input type="checkbox" name="service_interest" value={s.code} className="size-4 accent-brand-700" />
                {s.title}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <Field label="Mô tả nhu cầu" required err={errors.message} fid={`${uid}-message`} hint="Phạm vi, số lượng trạm/tuyến, khu vực, yêu cầu đặc biệt.">
        <textarea {...f('message')} rows={5} maxLength={5000} className={input(errors.message)} />
      </Field>

      {/* Honeypot: ẩn với người dùng và trình đọc màn hình */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {turnstileSiteKey && <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-language="vi" />}

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[15px] text-slate-600">
          {/* Không tích sẵn (SPEC 17) */}
          <input type="checkbox" name="consent" className="mt-1 size-4 shrink-0 accent-brand-700" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? `${uid}-consent-err` : undefined} />
          <span>
            Tôi đồng ý để COMTECH xử lý dữ liệu cá nhân trong form này nhằm liên hệ tư vấn, theo{' '}
            <Link href="/chinh-sach-bao-mat" className="font-medium text-brand-700 underline underline-offset-2">Chính sách xử lý dữ liệu cá nhân</Link>.
            <span className="text-danger-700"> *</span>
          </span>
        </label>
        {errors.consent && <p id={`${uid}-consent-err`} className="mt-1 pl-7 text-sm text-danger-700">{errors.consent}</p>}
      </div>

      {state.kind === 'error' && (
        <div role="alert" className="flex gap-2 rounded-md border border-danger-700/30 bg-danger-700/5 p-4 text-sm text-danger-700">
          <TriangleAlert aria-hidden className="size-5 shrink-0" />
          <div>
            <p className="font-semibold">{state.message}</p>
            {state.requestId && <p className="mt-1 font-mono text-xs">Mã hỗ trợ: {state.requestId}</p>}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={state.kind === 'sending'} className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-500 px-7 font-semibold text-navy-900 shadow-sm hover:bg-brand-600 disabled:opacity-60">
          {state.kind === 'sending' ? 'Đang gửi…' : 'Gửi yêu cầu'}
        </button>
        <p className="text-[13px] text-slate-500">Trường có dấu <span className="text-danger-700">*</span> là bắt buộc.</p>
      </div>
    </form>
  );
}

function input(err?: string) {
  return `block w-full min-h-11 rounded-md border bg-white px-3 py-2 text-[16px] text-navy-900 placeholder:text-slate-500 focus:outline-2 focus:outline-offset-0 focus:outline-navy-900 ${
    err ? 'border-danger-700' : 'border-border hover:border-navy-900/40'
  }`;
}

function Field({ label, required, err, fid, hint, children }: { label: string; required?: boolean; err?: string; fid: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={fid} className="mb-1.5 block text-[15px] font-medium text-navy-900">
        {label}
        {required && <span className="text-danger-700"> *</span>}
      </label>
      {children}
      {hint && !err && <p className="mt-1 text-[13px] text-slate-500">{hint}</p>}
      {err && <p id={`${fid}-err`} className="mt-1 text-sm text-danger-700">{err}</p>}
    </div>
  );
}

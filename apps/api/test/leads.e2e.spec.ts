import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CONSENT_VERSION } from '@comtech/contracts';
import { createApp } from '../src/bootstrap';
import { query, resetDatabase, testConfig, TEST_DB } from './helpers';

/**
 * Kiểm thử tích hợp trên PostgreSQL thật (không mock).
 * Chạy: TEST_DATABASE_URL=postgresql://... pnpm --filter @comtech/api test
 */
const d = TEST_DB ? describe : describe.skip;

const valid = () => ({
  full_name: 'Nguyễn Văn A',
  company_name: 'Công ty Kiểm Thử',
  email: 'a@example.com',
  phone: '0912 345 678',
  industry_code: 'TELECOM_OPERATOR',
  service_interest: ['SURVEY', 'INSTALLATION'],
  project_type: 'NEW_DEPLOYMENT',
  location_text: 'Lâm Đồng',
  estimated_timeline: 'WITHIN_3M',
  message: 'Cần khảo sát và lắp đặt 12 trạm.',
  consent: true,
  consent_version: CONSENT_VERSION,
  landing_page: '/yeu-cau-giai-phap',
});

let seq = 0;
const key = () => `test-key-${Date.now()}-${seq++}`;

d('POST /api/v1/public/leads', () => {
  let app: INestApplication;
  const url = TEST_DB as string;

  beforeAll(async () => {
    await resetDatabase(url);
    app = await createApp(testConfig(url, { LEAD_RATE_LIMIT_PER_MIN: '1000' }));
    await app.init();
  });
  afterAll(async () => app?.close());

  it('tạo lead, trả envelope + mã LD-YYMM-0000, ghi outbox trong cùng giao dịch', async () => {
    const res = await request(app.getHttpServer()).post('/api/v1/public/leads').set('Idempotency-Key', key()).send(valid());
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.meta.request_id).toBeTruthy();
    expect(res.headers['x-request-id']).toBe(res.body.meta.request_id);
    expect(res.body.data.lead_code).toMatch(/^LD-\d{4}-\d{4}$/);

    const [lead] = await query(url, 'SELECT * FROM leads WHERE lead_code = $1', [res.body.data.lead_code]);
    expect(lead).toMatchObject({ source: 'WEBSITE', status: 'NEW', phone: '+84912345678', data_origin: 'REAL', consent_version: CONSENT_VERSION });
    expect(lead?.consent_at).toBeTruthy();
    const events = await query(url, 'SELECT * FROM domain_events WHERE aggregate_id = $1', [lead?.id]);
    expect(events).toHaveLength(1);
    expect(events[0]?.event_type).toBe('lead.created');
    // Payload event không chứa dữ liệu cá nhân
    expect(JSON.stringify(events[0]?.payload)).not.toMatch(/example\.com|0912|Nguyễn/);
  });

  it('gửi lại cùng Idempotency-Key: trả cùng kết quả, không tạo bản ghi mới', async () => {
    const k = key();
    const a = await request(app.getHttpServer()).post('/api/v1/public/leads').set('Idempotency-Key', k).send(valid());
    const b = await request(app.getHttpServer()).post('/api/v1/public/leads').set('Idempotency-Key', k).send(valid());
    expect(b.status).toBe(201);
    expect(b.headers['idempotent-replayed']).toBe('true');
    expect(b.body.data).toEqual(a.body.data);
    const rows = await query(url, 'SELECT count(*)::int AS n FROM leads WHERE lead_code = $1', [a.body.data.lead_code]);
    expect(rows[0]?.n).toBe(1);
  });

  it('cùng khóa nhưng khác nội dung → 422 IDEMPOTENCY_KEY_REUSED', async () => {
    const k = key();
    await request(app.getHttpServer()).post('/api/v1/public/leads').set('Idempotency-Key', k).send(valid());
    const r = await request(app.getHttpServer()).post('/api/v1/public/leads').set('Idempotency-Key', k).send({ ...valid(), message: 'khác' });
    expect(r.status).toBe(422);
    expect(r.body.error.code).toBe('IDEMPOTENCY_KEY_REUSED');
  });

  it('thiếu Idempotency-Key → 428', async () => {
    const r = await request(app.getHttpServer()).post('/api/v1/public/leads').send(valid());
    expect(r.status).toBe(428);
    expect(r.body.error.code).toBe('IDEMPOTENCY_KEY_REQUIRED');
  });

  it('dữ liệu sai → 422 VALIDATION_ERROR có chi tiết theo trường, thông điệp tiếng Việt', async () => {
    const r = await request(app.getHttpServer())
      .post('/api/v1/public/leads')
      .set('Idempotency-Key', key())
      .send({ ...valid(), email: 'sai', phone: '123', consent: false });
    expect(r.status).toBe(422);
    expect(r.body.error.code).toBe('VALIDATION_ERROR');
    const fields = r.body.error.details.map((x: { field: string }) => x.field);
    expect(fields).toEqual(expect.arrayContaining(['email', 'phone', 'consent']));
  });

  it('mass assignment: gửi status/owner → 422, không ghi DB', async () => {
    const before = await query(url, 'SELECT count(*)::int AS n FROM leads');
    const r = await request(app.getHttpServer())
      .post('/api/v1/public/leads')
      .set('Idempotency-Key', key())
      .send({ ...valid(), status: 'CONVERTED', owner_employee_id: '00000000-0000-0000-0000-000000000001', data_origin: 'DEMO' });
    expect(r.status).toBe(422);
    const after = await query(url, 'SELECT count(*)::int AS n FROM leads');
    expect(after[0]?.n).toBe(before[0]?.n);
  });

  it('JSON hỏng → 422, không lộ stack trace', async () => {
    const r = await request(app.getHttpServer())
      .post('/api/v1/public/leads')
      .set('Idempotency-Key', key())
      .set('Content-Type', 'application/json')
      .send('{"full_name": ');
    expect(r.status).toBe(422);
    expect(JSON.stringify(r.body)).not.toMatch(/at \w+ \(|node_modules/);
  });

  it('honeypot: bot điền trường ẩn → 201 nhưng không lưu', async () => {
    const before = await query(url, 'SELECT count(*)::int AS n FROM leads');
    const r = await request(app.getHttpServer())
      .post('/api/v1/public/leads')
      .set('Idempotency-Key', key())
      .send({ ...valid(), website: 'http://spam.example' });
    expect(r.status).toBe(201);
    expect(r.body.data.lead_code).toBeNull();
    const after = await query(url, 'SELECT count(*)::int AS n FROM leads');
    expect(after[0]?.n).toBe(before[0]?.n);
  });

  it('20 request đồng thời sinh 20 mã khác nhau, liên tục (code_sequences trong transaction)', async () => {
    const results = await Promise.all(
      Array.from({ length: 20 }, () => request(app.getHttpServer()).post('/api/v1/public/leads').set('Idempotency-Key', key()).send(valid())),
    );
    expect(results.every((r) => r.status === 201)).toBe(true);
    const codes = results.map((r) => r.body.data.lead_code as string);
    expect(new Set(codes).size).toBe(20);
  });

  it('CHECK constraint DB: lead WEBSITE thiếu consent bị từ chối kể cả khi ghi thẳng DB', async () => {
    await expect(
      query(url, `INSERT INTO leads (id, lead_code, full_name, source) VALUES (gen_random_uuid(), 'LD-X', 'x', 'WEBSITE')`),
    ).rejects.toThrow(/ck_leads_website_consent/);
  });

  it('health và ready', async () => {
    expect((await request(app.getHttpServer()).get('/health')).body.data.status).toBe('ok');
    const r = await request(app.getHttpServer()).get('/ready');
    expect(r.status).toBe(200);
    expect(r.body.data.checks.database).toBe('ok');
  });

  it('route không tồn tại → 404 NOT_FOUND envelope', async () => {
    const r = await request(app.getHttpServer()).get('/api/v1/khong-co');
    expect(r.status).toBe(404);
    expect(r.body.error.code).toBe('NOT_FOUND');
  });
});

d('Giới hạn tần suất', () => {
  let app: INestApplication;
  const url = TEST_DB as string;
  beforeAll(async () => {
    app = await createApp(testConfig(url));
    await app.init();
  });
  afterAll(async () => app?.close());

  it('vượt 30 request/phút/IP → 429 RATE_LIMITED', async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 32; i++) {
      // Payload sai để không ghi DB; guard chạy trước validate.
      statuses.push((await request(app.getHttpServer()).post('/api/v1/public/leads').send({})).status);
    }
    expect(statuses.slice(0, 30).every((s) => s !== 429)).toBe(true);
    expect(statuses.at(-1)).toBe(429);
  });
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CONSENT_VERSION } from '@comtech/contracts';
import { createPrismaClient, newId, type PrismaClient } from '@comtech/db';
import { OutboxRelay, customerBody, internalBody } from '../src/outbox/outbox-relay';
import type { MailMessage, Mailer } from '../src/outbox/mailer';
import { query, resetDatabase, TEST_DB } from './helpers';

const d = TEST_DB ? describe : describe.skip;

class FakeMailer implements Mailer {
  enabled = true;
  sent: MailMessage[] = [];
  failNext = 0;
  async send(m: MailMessage) {
    if (this.failNext > 0) {
      this.failNext--;
      throw new Error('SMTP tạm lỗi');
    }
    this.sent.push(m);
  }
}

async function seedLead(prisma: PrismaClient) {
  const id = newId();
  await prisma.lead.create({
    data: {
      id, lead_code: `LD-9999-${Math.floor(Math.random() * 9000 + 1000)}`, full_name: 'Trần B', company_name: 'Cty B',
      email: 'b@example.com', phone: '+84912345678', service_interest: ['SURVEY'], message: 'Nội dung',
      source: 'WEBSITE', consent_at: new Date(), consent_version: CONSENT_VERSION,
    },
  });
  await prisma.domainEvent.create({ data: { id: newId(), event_type: 'lead.created', aggregate_type: 'lead', aggregate_id: id, payload: {} } });
  return id;
}

d('Outbox relay', () => {
  const url = TEST_DB as string;
  let prisma: PrismaClient;
  beforeAll(async () => {
    await resetDatabase(url);
    prisma = createPrismaClient(url, { max: 3 });
  });
  afterAll(async () => prisma?.$disconnect());

  it('gửi email nội bộ + xác nhận cho khách, đánh dấu published', async () => {
    const mailer = new FakeMailer();
    const relay = new OutboxRelay(prisma, mailer, { notifyTo: ['sales@example.com'] });
    const id = await seedLead(prisma);
    const r = await relay.runOnce();
    expect(r).toEqual({ processed: 1, failed: 0 });
    expect(mailer.sent.map((m) => m.to[0])).toEqual(['sales@example.com', 'b@example.com']);
    expect(mailer.sent[0]?.text).toContain('0912 345 678');
    const [ev] = await query(url, 'SELECT published_at FROM domain_events WHERE aggregate_id = $1', [id]);
    expect(ev?.published_at).toBeTruthy();
    expect((await relay.runOnce()).processed).toBe(0);
  });

  it('lỗi SMTP: tăng attempts, lùi lịch thử lại, không mất event', async () => {
    const mailer = new FakeMailer();
    mailer.failNext = 1;
    const relay = new OutboxRelay(prisma, mailer, { notifyTo: ['sales@example.com'] });
    const id = await seedLead(prisma);
    const r = await relay.runOnce();
    expect(r.failed).toBe(1);
    const [ev] = await query<{ attempts: number; published_at: Date | null; next_attempt_at: Date; last_error: string }>(
      url, 'SELECT attempts, published_at, next_attempt_at, last_error FROM domain_events WHERE aggregate_id = $1', [id]);
    expect(ev?.attempts).toBe(1);
    expect(ev?.published_at).toBeNull();
    expect(new Date(ev!.next_attempt_at).getTime()).toBeGreaterThan(Date.now() + 50_000);
    expect(ev?.last_error).toContain('SMTP');
  });

  it('hai worker song song không xử lý trùng một event (SKIP LOCKED)', async () => {
    await prisma.domainEvent.updateMany({ data: { published_at: new Date() } });
    for (let i = 0; i < 6; i++) await seedLead(prisma);
    const m1 = new FakeMailer();
    const m2 = new FakeMailer();
    const [a, b] = await Promise.all([
      new OutboxRelay(prisma, m1, { notifyTo: ['s@example.com'], batchSize: 6 }).claimBatch(),
      new OutboxRelay(prisma, m2, { notifyTo: ['s@example.com'], batchSize: 6 }).claimBatch(),
    ]);
    const ids = [...a, ...b].map((e) => e.id);
    expect(ids.length).toBe(6);
    expect(new Set(ids).size).toBe(6);
  });

  it('nội dung email định dạng Việt Nam', () => {
    const lead = {
      lead_code: 'LD-2609-0001', full_name: 'A', company_name: 'B', email: 'a@x.vn', phone: '+842839683268',
      industry_code: 'TELECOM_OPERATOR', service_interest: ['SURVEY', 'EMERGENCY_RESPONSE'], project_type: null,
      location_text: null, estimated_timeline: 'ASAP', message: 'm', spam_score: null,
      created_at: new Date('2026-09-23T01:30:00Z'),
    } as unknown as Parameters<typeof internalBody>[0];
    const t = internalBody(lead);
    expect(t).toContain('028 3968 3268');
    expect(t).toContain('Nhà mạng viễn thông');
    expect(t).toContain('Khảo sát, Ứng cứu thông tin');
    expect(t).toContain('08:30');
    expect(customerBody(lead)).toContain('LD-2609-0001');
  });
});

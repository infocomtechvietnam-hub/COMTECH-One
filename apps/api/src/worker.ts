import { Logger } from '@nestjs/common';
import { createPrismaClient } from '@comtech/db';
import { loadConfig } from './config';
import { createMailer } from './outbox/mailer';
import { OutboxRelay } from './outbox/outbox-relay';

/**
 * Worker tách process (SPEC 5.1, N11): xử lý outbox, gửi email, dọn dữ liệu tạm.
 * Giai đoạn website-first chạy vòng lặp polling; chuyển sang BullMQ khi có Redis (ADR-001 mục 2.3).
 */
async function main() {
  const cfg = loadConfig();
  const log = new Logger('Worker');
  const prisma = createPrismaClient(cfg.DATABASE_URL, { max: 3 });
  const relay = new OutboxRelay(prisma, createMailer(cfg), {
    notifyTo: (cfg.LEAD_NOTIFY_TO ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  });

  let stopping = false;
  const stop = () => {
    stopping = true;
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  let lastPurge = 0;
  log.log(`Worker chạy, chu kỳ ${cfg.OUTBOX_POLL_MS} ms`);
  while (!stopping) {
    try {
      const r = await relay.runOnce();
      if (r.processed) log.log(`outbox: xử lý ${r.processed}, lỗi ${r.failed}`);
      if (Date.now() - lastPurge > 3_600_000) {
        await relay.purgeIdempotencyKeys();
        lastPurge = Date.now();
      }
    } catch (e) {
      log.error(e instanceof Error ? e.message : 'lỗi vòng lặp worker');
    }
    await new Promise((r) => setTimeout(r, cfg.OUTBOX_POLL_MS));
  }
  await prisma.$disconnect();
  log.log('Worker dừng');
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : 'Worker khởi động thất bại');
  process.exit(1);
});

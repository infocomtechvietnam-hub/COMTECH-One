import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { createApp } from './bootstrap';
import { loadConfig } from './config';

async function main() {
  const cfg = loadConfig();
  const app = await createApp(cfg);
  await app.listen(cfg.PORT);
  new Logger('Bootstrap').log(`COMTECH One API chạy tại cổng ${cfg.PORT} (APP_ENV=${cfg.APP_ENV})`);
}

main().catch((e: unknown) => {
  // Chỉ in thông điệp, không in object lỗi có thể chứa chuỗi kết nối.
  console.error(e instanceof Error ? e.message : 'Khởi động thất bại');
  process.exit(1);
});

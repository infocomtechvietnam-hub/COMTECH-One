import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { json } from 'express';
import { AppModule } from './app.module';
import type { AppConfig } from './config';

/** Dựng app dùng chung cho main.ts và test. */
export async function createApp(cfg: AppConfig): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule.forRoot(cfg), {
    bodyParser: false,
    logger: cfg.NODE_ENV === 'test' ? false : ['log', 'warn', 'error'],
  });
  app.set('trust proxy', cfg.TRUST_PROXY_HOPS);
  app.disable('x-powered-by');
  app.use(helmet());
  // Giới hạn kích thước body: form lead không cần hơn 32 KB.
  app.use(json({ limit: '32kb' }));
  app.enableCors({
    origin: cfg.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Idempotency-Key', 'X-Request-Id', 'Accept-Language'],
    exposedHeaders: ['X-Request-Id', 'Idempotent-Replayed'],
    maxAge: 600,
  });
  app.enableShutdownHooks();
  return app;
}

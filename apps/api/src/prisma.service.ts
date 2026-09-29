import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { createPrismaClient, type PrismaClient } from '@comtech/db';
import { APP_CONFIG, type AppConfig } from './config';

/** Bọc PrismaClient (Prisma 7 + adapter pg) cho DI của Nest. */
@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly client: PrismaClient;

  constructor(@Inject(APP_CONFIG) cfg: AppConfig) {
    this.client = createPrismaClient(cfg.DATABASE_URL, { max: cfg.DATABASE_POOL_MAX });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}

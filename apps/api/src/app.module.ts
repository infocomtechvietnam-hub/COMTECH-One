import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_CONFIG, type AppConfig } from './config';
import { ApiExceptionFilter, EnvelopeInterceptor, RequestIdMiddleware } from './common/http';
import { HealthController } from './health/health.controller';
import { LeadsService } from './leads/leads.service';
import { PublicLeadsController } from './leads/public-leads.controller';
import { PrismaService } from './prisma.service';

@Module({})
export class AppModule implements NestModule {
  static forRoot(cfg: AppConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // Mặc định 600 req/phút (SPEC 16.1). Bộ đếm trong bộ nhớ: đủ cho 1 instance;
        // khi chạy >1 instance API phải chuyển sang Redis storage (Open Issue OI-W-03).
        ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 600 }]),
      ],
      controllers: [HealthController, PublicLeadsController],
      providers: [
        { provide: APP_CONFIG, useValue: cfg },
        PrismaService,
        LeadsService,
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_INTERCEPTOR, useClass: EnvelopeInterceptor },
        { provide: APP_FILTER, useClass: ApiExceptionFilter },
      ],
    };
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}

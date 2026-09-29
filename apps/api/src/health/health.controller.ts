import { Controller, Get, HttpCode } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../prisma.service';
import { ApiException } from '../common/http';

/** SPEC 38: /health (liveness, không phụ thuộc bên ngoài) và /ready (DB). */
@SkipThrottle()
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  @HttpCode(200)
  health() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HttpCode(200)
  async ready() {
    try {
      await this.prisma.client.$queryRaw`SELECT 1`;
      return { status: 'ready', checks: { database: 'ok' } };
    } catch {
      throw new ApiException('INTERNAL_ERROR', undefined, 'Cơ sở dữ liệu chưa sẵn sàng.');
    }
  }
}

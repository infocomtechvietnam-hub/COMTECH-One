import { Body, Controller, Headers, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import type { RequestWithId } from '../common/http';
import { LeadsService } from './leads.service';

/**
 * API công khai (không đăng nhập) ở không gian /api/v1/public/* tách biệt (SPEC 19.2).
 * Giới hạn 30 request/phút/IP cho form (SPEC 16.1), cấu hình qua LEAD_RATE_LIMIT_PER_MIN.
 */
@Controller('api/v1/public/leads')
export class PublicLeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: Number(process.env.LEAD_RATE_LIMIT_PER_MIN ?? 30), ttl: 60_000 } })
  async create(
    @Body() body: unknown,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Req() req: RequestWithId,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.leads.createFromWebsite(body, {
      idempotencyKey,
      ip: req.ip,
      requestId: req.requestId,
    });
    if (result.replayed) res.setHeader('Idempotent-Replayed', 'true');
    return result.body;
  }
}

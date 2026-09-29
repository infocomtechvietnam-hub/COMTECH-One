import { PrismaPg } from '@prisma/adapter-pg';
import { randomBytes } from 'node:crypto';
import { Prisma, PrismaClient } from '../generated/client';

export { Prisma, PrismaClient };
export type { Lead, DomainEvent, IdempotencyKey, CodeSequence } from '../generated/client';

/** UUID v7 sinh ở ứng dụng (SPEC 8.1): có thứ tự thời gian, B-tree hiệu quả. */
export function newId(): string {
  // RFC 9562: 48 bit unix ms | ver 7 | 12 bit rand | variant 10 | 62 bit rand
  const b = randomBytes(16);
  const ms = BigInt(Date.now());
  for (let i = 0; i < 6; i++) b[i] = Number((ms >> BigInt(8 * (5 - i))) & 0xffn);
  b[6] = (b[6]! & 0x0f) | 0x70;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = b.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** user_id quy ước cho request công khai chưa đăng nhập (bảng idempotency_keys). */
export const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000';

export function createPrismaClient(databaseUrl: string, opts: { max?: number } = {}): PrismaClient {
  if (!databaseUrl) throw new Error('DATABASE_URL chưa được cấu hình');
  const adapter = new PrismaPg({ connectionString: databaseUrl, max: opts.max ?? 10 });
  return new PrismaClient({ adapter });
}

/**
 * Sinh mã nghiệp vụ trong transaction (SPEC 8.1): khóa hàng code_sequences
 * bằng INSERT ... ON CONFLICT DO UPDATE nên hai request đồng thời không thể
 * nhận cùng một số. Mã đã cấp không bao giờ đổi.
 */
export async function nextCode(
  tx: Prisma.TransactionClient,
  entity: string,
  period: string,
): Promise<bigint> {
  const rows = await tx.$queryRaw<{ last_value: bigint }[]>`
    INSERT INTO code_sequences (entity, period, last_value)
    VALUES (${entity}, ${period}, 1)
    ON CONFLICT (entity, period)
    DO UPDATE SET last_value = code_sequences.last_value + 1
    RETURNING last_value`;
  const row = rows[0];
  if (!row) throw new Error('Không sinh được mã');
  return BigInt(row.last_value);
}

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';
import { loadConfig, type AppConfig } from '../src/config';

export const TEST_DB = process.env.TEST_DATABASE_URL;

/** Tạo lại schema sạch và áp toàn bộ migration SQL theo thứ tự (giống prisma migrate deploy). */
export async function resetDatabase(url: string): Promise<void> {
  const c = new Client({ connectionString: url });
  await c.connect();
  try {
    await c.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
    const dir = join(__dirname, '../../../packages/db/prisma/migrations');
    for (const m of readdirSync(dir).filter((d) => /^\d{14}_/.test(d)).sort()) {
      await c.query(readFileSync(join(dir, m, 'migration.sql'), 'utf8'));
    }
  } finally {
    await c.end();
  }
}

export async function query<T = Record<string, unknown>>(url: string, sql: string, params: unknown[] = []): Promise<T[]> {
  const c = new Client({ connectionString: url });
  await c.connect();
  try {
    return (await c.query(sql, params)).rows as T[];
  } finally {
    await c.end();
  }
}

export function testConfig(url: string, extra: Record<string, string> = {}): AppConfig {
  return loadConfig({
    NODE_ENV: 'test',
    APP_ENV: 'dev',
    DATABASE_URL: url,
    TRUST_PROXY_HOPS: '1',
    ...extra,
  } as NodeJS.ProcessEnv);
}

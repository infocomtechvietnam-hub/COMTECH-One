/**
 * pnpm content:check
 * In báo cáo nội dung: mục nào đã được phép lên production, mục nào bị chặn và vì sao.
 * Tham số --md ghi bảng Markdown (dùng cho docs/content-verification.md).
 */
import { contentReport } from './index';

const rows = contentReport();
const ok = rows.filter((r) => r.publishable);
const blocked = rows.filter((r) => !r.publishable);

if (process.argv.includes('--md')) {
  const esc = (s: string) => s.replace(/\|/g, '\\|');
  const lines = [
    '| # | id | Loại | Nội dung | Production | Lý do chặn / ghi chú |',
    '|---|---|---|---|---|---|',
    ...rows.map((r, i) =>
      `| ${i + 1} | \`${r.id}\` | ${r.kind} | ${esc(r.title)} | ${r.publishable ? 'Hiển thị' : 'Chặn'} | ${esc([...r.reasons, r.note ?? ''].filter(Boolean).join('; '))} |`,
    ),
  ];
  console.log(lines.join('\n'));
} else {
  console.log(`Nội dung: ${rows.length} mục; được hiển thị production: ${ok.length}; bị chặn: ${blocked.length}`);
  for (const r of blocked) console.log(`  CHẶN  ${r.id.padEnd(40)} ${r.reasons.join('; ')}`);
}

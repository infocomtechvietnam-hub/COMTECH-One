import { z } from 'zod';
import { approvals as approvalBook, type Approval } from './approvals';
import { evaluate, governanceSchema, type ContentMode, type Governance, type Visibility } from './governance';
import {
  capabilitySchema,
  caseStudySchema,
  jobSchema,
  legalPageSchema,
  namedItemSchema,
  newsSchema,
  serviceSchema,
  settingSchema,
  solutionSchema,
} from './types';
import { settings as rawSettings } from './data/settings';
import { capabilities as rawCapabilities } from './data/capabilities';
import { solutions as rawSolutions } from './data/solutions';
import { services as rawServices } from './data/services';
import { caseStudies as rawCaseStudies } from './data/case-studies';
import { news as rawNews } from './data/news';
import { clientsServed as rawClients, clientLogosPermission as rawLogos, equipmentExperience as rawEquipment } from './data/references';
import { aboutIntro as rawAbout, jobs as rawJobs, privacyPolicy as rawPrivacy, whyComtech as rawWhy } from './data/pages';

export * from './governance';
export * from './types';

export type WithVisibility<T> = T & { visibility: Visibility };

// ---------------------------------------------------------------------------
// Chế độ hiển thị
// ---------------------------------------------------------------------------

/**
 * production: chỉ nội dung đã duyệt. preview: thêm nội dung chờ duyệt + DEMO có nhãn.
 * Chặn cứng: không được bật preview ở APP_ENV=production (MASTER PROMPT 3.3).
 */
export function resolveMode(env: Record<string, string | undefined> = process.env): ContentMode {
  const preview = env.CONTENT_PREVIEW === 'true';
  if (preview && env.APP_ENV === 'production') {
    throw new Error('CONTENT_PREVIEW=true bị cấm khi APP_ENV=production (không được lộ dữ liệu DEMO/chưa duyệt).');
  }
  return preview ? 'preview' : 'production';
}

// ---------------------------------------------------------------------------
// Nạp, kiểm tra schema, áp sổ duyệt
// ---------------------------------------------------------------------------

function applyApproval(g: Governance, book: Record<string, Approval>): Governance {
  const a = book[g.id];
  if (!a) return g;
  if (g.open_labels.length > 0) throw new Error(`Không thể duyệt "${g.id}": còn nhãn mở ${g.open_labels.join(', ')}`);
  if (g.data_origin !== 'REAL') throw new Error(`Không thể duyệt "${g.id}": data_origin=${g.data_origin}`);
  return { ...g, status: 'PUBLISHED', verification_status: 'VERIFIED', reviewed_by: a.reviewed_by, reviewed_at: a.reviewed_at };
}

function load<S extends z.ZodType<{ governance: Governance }>>(schema: S, items: unknown[], label: string, book: Record<string, Approval>) {
  return items.map((item, i) => {
    const r = schema.safeParse(item);
    if (!r.success) throw new Error(`Nội dung "${label}"[${i}] sai schema: ${z.prettifyError(r.error)}`);
    const data = r.data as z.output<S>;
    return { ...data, governance: applyApproval(data.governance, book) } as z.output<S>;
  });
}

export function buildRepository(book: Record<string, Approval> = approvalBook) {
  const store = {
    settings: load(settingSchema, rawSettings, 'settings', book),
    capabilities: load(capabilitySchema, rawCapabilities, 'capabilities', book),
    solutions: load(solutionSchema, rawSolutions, 'solutions', book),
    services: load(serviceSchema, rawServices, 'services', book),
    caseStudies: load(caseStudySchema, rawCaseStudies, 'case-studies', book),
    news: load(newsSchema, rawNews, 'news', book),
    clients: load(namedItemSchema, rawClients, 'clients', book),
    clientLogos: load(namedItemSchema, [rawLogos], 'client-logos', book)[0]!,
    equipment: load(namedItemSchema, rawEquipment, 'equipment', book),
    privacy: load(legalPageSchema, [rawPrivacy], 'privacy', book)[0]!,
    jobs: load(jobSchema, rawJobs, 'jobs', book),
    about: { ...rawAbout, governance: applyApproval(governanceSchema.parse(rawAbout.governance), book) },
    why: { ...rawWhy, governance: applyApproval(governanceSchema.parse(rawWhy.governance), book) },
  };
  assertIntegrity(store, book);
  return store;
}

export type Repository = ReturnType<typeof buildRepository>;

function assertIntegrity(s: Repository, book: Record<string, Approval>) {
  const ids = new Map<string, number>();
  const all: Governance[] = [
    ...s.settings, ...s.capabilities, ...s.solutions, ...s.services, ...s.caseStudies,
    ...s.news, ...s.clients, s.clientLogos, ...s.equipment, s.privacy, ...s.jobs, s.about, s.why,
  ].map((x) => x.governance);
  for (const g of all) ids.set(g.id, (ids.get(g.id) ?? 0) + 1);
  const dup = [...ids].filter(([, n]) => n > 1).map(([id]) => id);
  if (dup.length) throw new Error(`Trùng governance.id: ${dup.join(', ')}`);

  const unknown = Object.keys(book).filter((k) => !ids.has(k));
  if (unknown.length) throw new Error(`approvals.ts tham chiếu id không tồn tại: ${unknown.join(', ')}`);

  const capCodes = new Set(s.capabilities.map((c) => c.code));
  for (const sol of s.solutions) {
    if (!capCodes.has(sol.capability_code)) throw new Error(`Giải pháp ${sol.slug} thuộc năng lực không tồn tại`);
  }
  const uniq = (label: string, xs: string[]) => {
    const seen = new Set<string>();
    for (const x of xs) {
      if (seen.has(x)) throw new Error(`Trùng slug ${label}: ${x}`);
      seen.add(x);
    }
  };
  uniq('capability', s.capabilities.map((c) => c.slug));
  uniq('solution', s.solutions.map((c) => c.slug));
  uniq('service', s.services.map((c) => c.slug));
  uniq('case-study', s.caseStudies.map((c) => c.slug));
  uniq('news', s.news.map((c) => c.slug));
}

// ---------------------------------------------------------------------------
// API đọc nội dung cho website (đã lọc theo chế độ)
// ---------------------------------------------------------------------------

export function createContent(mode: ContentMode, repo: Repository = buildRepository()) {
  const vis = <T extends { governance: Governance }>(items: T[]): WithVisibility<T>[] =>
    items
      .map((it) => ({ ...it, visibility: evaluate(it.governance, mode) }))
      .filter((it) => it.visibility.visible);
  const one = <T extends { governance: Governance }>(item: T | undefined): WithVisibility<T> | null =>
    item ? (vis([item])[0] ?? null) : null;

  const capabilities = () => vis([...repo.capabilities].sort((a, b) => a.order - b.order));

  return {
    mode,
    /** Giá trị setting chỉ khi được phép hiển thị; ngược lại null (ẩn cả ô, không để số tạm). */
    setting(key: string): string | number | null {
      const s = one(repo.settings.find((x) => x.key === key));
      return s ? s.value : null;
    },
    settingEntry(key: string) {
      return one(repo.settings.find((x) => x.key === key));
    },
    capabilities,
    capability: (slug: string) => one(repo.capabilities.find((c) => c.slug === slug)),
    solutions: (capabilityCode?: string) =>
      vis(repo.solutions.filter((s) => !capabilityCode || s.capability_code === capabilityCode)),
    solution: (capabilitySlug: string, slug: string) => {
      const cap = repo.capabilities.find((c) => c.slug === capabilitySlug);
      if (!cap || !one(cap)) return null;
      return one(repo.solutions.find((s) => s.slug === slug && s.capability_code === cap.code));
    },
    services: () => vis([...repo.services].sort((a, b) => a.order - b.order)),
    service: (slug: string) => one(repo.services.find((s) => s.slug === slug)),
    serviceByCode: (code: string) => one(repo.services.find((s) => s.code === code)),
    caseStudies: () => vis([...repo.caseStudies].sort((a, b) => b.year - a.year)),
    caseStudy: (slug: string) => one(repo.caseStudies.find((c) => c.slug === slug)),
    news: () => vis([...repo.news].sort((a, b) => b.date.localeCompare(a.date))),
    newsItem: (slug: string) => one(repo.news.find((n) => n.slug === slug)),
    clients: () => vis(repo.clients),
    /** Logo chỉ dùng khi quyền sử dụng đã được xác nhận thật (kể cả ở chế độ xem trước). */
    clientLogosAllowed: () => evaluate(repo.clientLogos.governance, 'production').visible,
    equipment: () => vis(repo.equipment),
    privacy: () => one(repo.privacy),
    /** Form lead chỉ mở khi chính sách dữ liệu đã được duyệt (production) hoặc đang xem trước. */
    leadFormEnabled: () => one(repo.privacy) !== null,
    about: () => one(repo.about),
    why: () => one(repo.why),
    jobs: () => vis(repo.jobs),
  };
}

export type Content = ReturnType<typeof createContent>;

// ---------------------------------------------------------------------------
// Báo cáo kiểm tra nội dung (pnpm content:check)
// ---------------------------------------------------------------------------

export interface ReportRow {
  id: string;
  kind: string;
  title: string;
  publishable: boolean;
  reasons: string[];
  note?: string;
  source: string;
}

export function contentReport(repo: Repository = buildRepository()): ReportRow[] {
  const rows: ReportRow[] = [];
  const add = (kind: string, title: string, g: Governance) => {
    const v = evaluate(g, 'production');
    rows.push({ id: g.id, kind, title, publishable: v.visible, reasons: v.blocked_reasons, note: g.note, source: g.source });
  };
  repo.settings.forEach((s) => add('setting', s.key, s.governance));
  repo.capabilities.forEach((c) => add('capability', c.name, c.governance));
  repo.solutions.forEach((s) => add('solution', s.title, s.governance));
  repo.services.forEach((s) => add('service', s.title, s.governance));
  repo.caseStudies.forEach((c) => add('case-study', c.title, c.governance));
  repo.news.forEach((n) => add('news', n.title, n.governance));
  repo.clients.forEach((c) => add('client', c.name, c.governance));
  add('client-logos', repo.clientLogos.name, repo.clientLogos.governance);
  repo.equipment.forEach((e) => add('equipment', e.name, e.governance));
  add('page', repo.privacy.title, repo.privacy.governance);
  add('page', 'Giới thiệu (Về COMTECH)', repo.about.governance);
  add('page', 'Vì sao chọn COMTECH', repo.why.governance);
  return rows;
}

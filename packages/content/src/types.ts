import { z } from 'zod';
import { governanceSchema } from './governance';

// Correct constants for COMTECH (7 capabilities + 12 services)
const CAPABILITY_CODES = ['T', 'E', 'M', 'C2', 'C', 'O', 'H'] as const;
const SERVICE_CODES = [
  'SURVEY', 'DESIGN', 'CONSTRUCTION', 'INSTALLATION', 'INTEGRATION', 'TESTING',
  'COMMISSIONING', 'OPTIMIZATION', 'MAINTENANCE', 'SWAP_RELOCATION', 'EMERGENCY_RESPONSE', 'TECH_SUPPORT'
] as const;

const text = z.string().min(1);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug chỉ gồm a-z, 0-9 và dấu gạch nối');

/** Thông tin công ty dạng key-value (SPEC 10.12 settings, is_public). */
export const settingSchema = z
  .object({
    key: z.string(),
    value: z.union([z.string(), z.number(), z.null()]),
    governance: governanceSchema,
  })
  .strict();

export const capabilitySchema = z
  .object({
    code: z.enum(CAPABILITY_CODES),
    letter: z.string().length(1),
    slug,
    order: z.number().int(),
    name: text,
    name_en: text,
    tagline: text,
    description: text,
    highlights: z.array(text),
    governance: governanceSchema,
  })
  .strict();

export const solutionSchema = z
  .object({
    capability_code: z.enum(CAPABILITY_CODES),
    slug,
    title: text,
    summary: text,
    problems: z.array(text).min(1),
    approach: z.array(z.object({ title: text, body: text }).strict()).min(1),
    services: z.array(z.enum(SERVICE_CODES)),
    technologies: z.array(text),
    faq: z.array(z.object({ q: text, a: text }).strict()).default([]),
    seo_title: z.string().max(60).optional(),
    seo_description: z.string().max(160).optional(),
    governance: governanceSchema,
  })
  .strict();

export const serviceSchema = z
  .object({
    code: z.enum(SERVICE_CODES),
    slug,
    order: z.number().int(),
    title: text,
    summary: text,
    scope: z.array(text).min(1),
    deliverables: z.array(text),
    governance: governanceSchema,
  })
  .strict();

export const caseStudySchema = z
  .object({
    slug,
    title: text,
    client_display: text,
    region: text,
    year: z.number().int(),
    capability_code: z.enum(CAPABILITY_CODES),
    services: z.array(z.enum(SERVICE_CODES)),
    scope: text,
    challenge: text,
    solution: text,
    results: z.array(text),
    governance: governanceSchema,
  })
  .strict();

export const newsSchema = z
  .object({
    slug,
    title: text,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    category: z.enum(['COMPANY', 'TECH']),
    summary: text,
    body: z.array(text).min(1),
    governance: governanceSchema,
  })
  .strict();

export const namedItemSchema = z
  .object({
    name: text,
    note: z.string().optional(),
    governance: governanceSchema,
  })
  .strict();

export const legalPageSchema = z
  .object({
    slug,
    title: text,
    updated_at: z.string(),
    sections: z.array(z.object({ heading: text, body: z.array(text) }).strict()),
    governance: governanceSchema,
  })
  .strict();

export const jobSchema = z
  .object({
    slug,
    title: text,
    location: text,
    employment_type: text,
    deadline: z.string(),
    description: z.array(text),
    governance: governanceSchema,
  })
  .strict();

export type Setting = z.infer<typeof settingSchema>;
export type Capability = z.infer<typeof capabilitySchema>;
export type Solution = z.infer<typeof solutionSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type News = z.infer<typeof newsSchema>;
export type NamedItem = z.infer<typeof namedItemSchema>;
export type LegalPage = z.infer<typeof legalPageSchema>;
export type Job = z.infer<typeof jobSchema>;

import { z } from 'zod';

// Constants
export const CONSENT_VERSION = '2026-09-29';

export const INDUSTRIES = [
  'Telecom',
  'Energy',
  'IT Infrastructure',
  'Smart Building',
  'Other',
] as const;

export const PROJECT_TYPES = [
  'Infrastructure',
  'Services',
  'Consulting',
  'Maintenance',
] as const;

export const TIMELINES = [
  'Immediate (0-1 month)',
  'Short-term (1-3 months)',
  'Medium-term (3-6 months)',
  'Long-term (6+ months)',
  'Undecided',
] as const;

// Capabilities and Services for form options
export const CAPABILITY_CODES = ['T', 'E', 'M', 'C2', 'C', 'O', 'H'] as const;
export const SERVICE_CODES = [
  'SURVEY', 'DESIGN', 'CONSTRUCTION', 'INSTALLATION', 'INTEGRATION', 'TESTING',
  'COMMISSIONING', 'OPTIMIZATION', 'MAINTENANCE', 'SWAP_RELOCATION', 'EMERGENCY_RESPONSE', 'TECH_SUPPORT'
] as const;

// Schemas
export const leadCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  industry: z.enum(INDUSTRIES).optional(),
  project_type: z.enum(PROJECT_TYPES).optional(),
  timeline: z.enum(TIMELINES).optional(),
  consent_version: z.string().optional(),
}).strict();

export type LeadCreateInput = z.input<typeof leadCreateSchema>;
export type LeadCreateOutput = z.output<typeof leadCreateSchema>;

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LeadCreatedResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

// Type exports
export type Capability = typeof CAPABILITY_CODES[number];
export type Service = typeof SERVICE_CODES[number];
export type Industry = typeof INDUSTRIES[number];
export type ProjectType = typeof PROJECT_TYPES[number];
export type Timeline = typeof TIMELINES[number];

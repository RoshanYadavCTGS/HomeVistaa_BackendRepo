import { z } from 'zod';

const phoneSchema = z.string().trim().regex(
  /^[+]?[0-9\s\-().]{7,20}$/,
  'Enter a valid phone number'
);

export const createInquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  phone: phoneSchema,
  message: z.string().trim().min(5, 'Message is required').max(2000),
  inquiryType: z
    .enum(['general', 'visit', 'brochure', 'callback', 'advisor'])
    .default('general'),
  propertyId: z.string().uuid().optional(),
  propertyName: z.string().trim().max(200).optional(),
  datePreference: z.string().trim().optional(),
});

export const createAdvisorInquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  phone: phoneSchema,
});

export const createServiceRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  phone: phoneSchema,
  address: z.string().trim().max(500).optional(),
  details: z.string().trim().max(2000).optional(),
  serviceType: z.enum(['agreement', 'verification', 'management'], {
    errorMap: () => ({ message: 'Invalid service type' }),
  }),
});

export const createAlertSchema = z.object({
  title: z.string().trim().min(2, 'Alert title is required').max(200),
  description: z.string().trim().min(2).max(500),
  filtersJson: z.record(z.unknown()).default({}),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type CreateAdvisorInquiryInput = z.infer<typeof createAdvisorInquirySchema>;
export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>;
export type CreateAlertInput = z.infer<typeof createAlertSchema>;

import { z } from 'zod';

export const createProfessionalSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  phone: z.string().trim().regex(/^[+]?[0-9\s\-().]{7,20}$/, 'Invalid phone number'),
  company: z.string().trim().min(2, 'Company name is required').max(200),
  reraId: z.string().trim().max(100).optional(),
  experience: z.coerce.number().int().min(0).max(60).default(1),
  role: z.enum(['agent', 'developer'], {
    errorMap: () => ({ message: 'Role must be "agent" or "developer"' }),
  }),
});

export const updateProfessionalStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
  adminNote: z.string().trim().max(500).optional(),
});

export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessionalStatusInput = z.infer<typeof updateProfessionalStatusSchema>;

import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters'); // Flexible minimum to accommodate user test credentials

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: passwordSchema,
  role: z.string().trim().optional(),
  rememberMe: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address').toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: passwordSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().trim().min(8, 'Phone number must be at least 8 digits').optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  dob: z.string().optional(),
  city: z.string().trim().optional(),
  pinCode: z.string().trim().optional(),
  preferredLanguages: z.array(z.string()).optional(),
  propertyPreferences: z.any().optional(),
  employmentDetails: z.any().optional(),
  accountType: z.string().trim().optional(),
  addressDetails: z.any().optional(),
  securitySettings: z.any().optional(),
  notificationPrefs: z.any().optional(),
  documents: z.any().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

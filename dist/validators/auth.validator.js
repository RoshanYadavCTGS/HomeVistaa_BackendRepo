"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.refreshTokenSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(6, 'Password must be at least 6 characters'); // Flexible minimum to accommodate user test credentials
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: zod_1.z.string().trim().email('Invalid email address').toLowerCase(),
    password: passwordSchema,
    role: zod_1.z.string().trim().optional(),
    rememberMe: zod_1.z.boolean().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email('Invalid email address').toLowerCase(),
    password: zod_1.z.string().min(1, 'Password is required'),
    rememberMe: zod_1.z.boolean().optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email('Invalid email address').toLowerCase(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token is required'),
    newPassword: passwordSchema,
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().optional(),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
    phone: zod_1.z.string().trim().min(8, 'Phone number must be at least 8 digits').optional(),
    avatarUrl: zod_1.z.string().url('Invalid avatar URL').optional(),
    dob: zod_1.z.string().optional(),
    city: zod_1.z.string().trim().optional(),
    pinCode: zod_1.z.string().trim().optional(),
    preferredLanguages: zod_1.z.array(zod_1.z.string()).optional(),
    propertyPreferences: zod_1.z.any().optional(),
    employmentDetails: zod_1.z.any().optional(),
    accountType: zod_1.z.string().trim().optional(),
    addressDetails: zod_1.z.any().optional(),
    securitySettings: zod_1.z.any().optional(),
    notificationPrefs: zod_1.z.any().optional(),
    documents: zod_1.z.any().optional(),
});
//# sourceMappingURL=auth.validator.js.map
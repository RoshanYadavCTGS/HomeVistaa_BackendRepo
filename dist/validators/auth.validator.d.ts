import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodOptional<z.ZodString>;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role?: string | undefined;
    rememberMe?: boolean | undefined;
}, {
    name: string;
    email: string;
    password: string;
    role?: string | undefined;
    rememberMe?: boolean | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    rememberMe: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    rememberMe?: boolean | undefined;
}, {
    email: string;
    password: string;
    rememberMe?: boolean | undefined;
}>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newPassword: string;
    token: string;
}, {
    newPassword: string;
    token: string;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    refreshToken?: string | undefined;
}, {
    refreshToken?: string | undefined;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    dob: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    pinCode: z.ZodOptional<z.ZodString>;
    preferredLanguages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    propertyPreferences: z.ZodOptional<z.ZodAny>;
    employmentDetails: z.ZodOptional<z.ZodAny>;
    accountType: z.ZodOptional<z.ZodString>;
    addressDetails: z.ZodOptional<z.ZodAny>;
    securitySettings: z.ZodOptional<z.ZodAny>;
    notificationPrefs: z.ZodOptional<z.ZodAny>;
    documents: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    dob?: string | undefined;
    city?: string | undefined;
    pinCode?: string | undefined;
    preferredLanguages?: string[] | undefined;
    propertyPreferences?: any;
    employmentDetails?: any;
    accountType?: string | undefined;
    addressDetails?: any;
    securitySettings?: any;
    notificationPrefs?: any;
    documents?: any;
}, {
    name?: string | undefined;
    avatarUrl?: string | undefined;
    phone?: string | undefined;
    dob?: string | undefined;
    city?: string | undefined;
    pinCode?: string | undefined;
    preferredLanguages?: string[] | undefined;
    propertyPreferences?: any;
    employmentDetails?: any;
    accountType?: string | undefined;
    addressDetails?: any;
    securitySettings?: any;
    notificationPrefs?: any;
    documents?: any;
}>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
//# sourceMappingURL=auth.validator.d.ts.map
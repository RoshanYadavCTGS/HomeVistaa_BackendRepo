import { z } from 'zod';
export declare const createInquirySchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    message: z.ZodString;
    inquiryType: z.ZodDefault<z.ZodEnum<["general", "visit", "brochure", "callback", "advisor"]>>;
    propertyId: z.ZodOptional<z.ZodString>;
    propertyName: z.ZodOptional<z.ZodString>;
    datePreference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    name: string;
    email: string;
    phone: string;
    inquiryType: "general" | "visit" | "brochure" | "callback" | "advisor";
    propertyId?: string | undefined;
    propertyName?: string | undefined;
    datePreference?: string | undefined;
}, {
    message: string;
    name: string;
    email: string;
    phone: string;
    propertyId?: string | undefined;
    inquiryType?: "general" | "visit" | "brochure" | "callback" | "advisor" | undefined;
    propertyName?: string | undefined;
    datePreference?: string | undefined;
}>;
export declare const createAdvisorInquirySchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    phone: string;
}, {
    name: string;
    email: string;
    phone: string;
}>;
export declare const createServiceRequestSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodString>;
    serviceType: z.ZodEnum<["agreement", "verification", "management"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    phone: string;
    serviceType: "agreement" | "verification" | "management";
    address?: string | undefined;
    details?: string | undefined;
}, {
    name: string;
    email: string;
    phone: string;
    serviceType: "agreement" | "verification" | "management";
    address?: string | undefined;
    details?: string | undefined;
}>;
export declare const createAlertSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    filtersJson: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    filtersJson: Record<string, unknown>;
}, {
    title: string;
    description: string;
    filtersJson?: Record<string, unknown> | undefined;
}>;
export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type CreateAdvisorInquiryInput = z.infer<typeof createAdvisorInquirySchema>;
export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>;
export type CreateAlertInput = z.infer<typeof createAlertSchema>;
//# sourceMappingURL=inquiry.validator.d.ts.map
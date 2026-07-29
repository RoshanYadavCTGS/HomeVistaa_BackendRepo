import { z } from 'zod';
export declare const createProfessionalSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    company: z.ZodString;
    reraId: z.ZodOptional<z.ZodString>;
    experience: z.ZodDefault<z.ZodNumber>;
    role: z.ZodEnum<["agent", "developer"]>;
}, "strip", z.ZodTypeAny, {
    role: "agent" | "developer";
    name: string;
    email: string;
    phone: string;
    company: string;
    experience: number;
    reraId?: string | undefined;
}, {
    role: "agent" | "developer";
    name: string;
    email: string;
    phone: string;
    company: string;
    reraId?: string | undefined;
    experience?: number | undefined;
}>;
export declare const updateProfessionalStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "approved", "rejected"]>;
    adminNote: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "approved" | "rejected";
    adminNote?: string | undefined;
}, {
    status: "pending" | "approved" | "rejected";
    adminNote?: string | undefined;
}>;
export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessionalStatusInput = z.infer<typeof updateProfessionalStatusSchema>;
//# sourceMappingURL=professional.validator.d.ts.map
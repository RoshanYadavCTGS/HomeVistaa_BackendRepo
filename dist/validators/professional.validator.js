"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfessionalStatusSchema = exports.createProfessionalSchema = void 0;
const zod_1 = require("zod");
exports.createProfessionalSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name is required').max(100),
    email: zod_1.z.string().trim().email('Invalid email address').toLowerCase(),
    phone: zod_1.z.string().trim().regex(/^[+]?[0-9\s\-().]{7,20}$/, 'Invalid phone number'),
    company: zod_1.z.string().trim().min(2, 'Company name is required').max(200),
    reraId: zod_1.z.string().trim().max(100).optional(),
    experience: zod_1.z.coerce.number().int().min(0).max(60).default(1),
    role: zod_1.z.enum(['agent', 'developer'], {
        errorMap: () => ({ message: 'Role must be "agent" or "developer"' }),
    }),
});
exports.updateProfessionalStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'approved', 'rejected']),
    adminNote: zod_1.z.string().trim().max(500).optional(),
});
//# sourceMappingURL=professional.validator.js.map
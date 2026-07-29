"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlertSchema = exports.createServiceRequestSchema = exports.createAdvisorInquirySchema = exports.createInquirySchema = void 0;
const zod_1 = require("zod");
const phoneSchema = zod_1.z.string().trim().regex(/^[+]?[0-9\s\-().]{7,20}$/, 'Enter a valid phone number');
exports.createInquirySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    email: zod_1.z.string().trim().email('Invalid email address').toLowerCase(),
    phone: phoneSchema,
    message: zod_1.z.string().trim().min(5, 'Message is required').max(2000),
    inquiryType: zod_1.z
        .enum(['general', 'visit', 'brochure', 'callback', 'advisor'])
        .default('general'),
    propertyId: zod_1.z.string().uuid().optional(),
    propertyName: zod_1.z.string().trim().max(200).optional(),
    datePreference: zod_1.z.string().trim().optional(),
});
exports.createAdvisorInquirySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100),
    email: zod_1.z.string().trim().email().toLowerCase(),
    phone: phoneSchema,
});
exports.createServiceRequestSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100),
    email: zod_1.z.string().trim().email().toLowerCase(),
    phone: phoneSchema,
    address: zod_1.z.string().trim().max(500).optional(),
    details: zod_1.z.string().trim().max(2000).optional(),
    serviceType: zod_1.z.enum(['agreement', 'verification', 'management'], {
        errorMap: () => ({ message: 'Invalid service type' }),
    }),
});
exports.createAlertSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(2, 'Alert title is required').max(200),
    description: zod_1.z.string().trim().min(2).max(500),
    filtersJson: zod_1.z.record(zod_1.z.unknown()).default({}),
});
//# sourceMappingURL=inquiry.validator.js.map
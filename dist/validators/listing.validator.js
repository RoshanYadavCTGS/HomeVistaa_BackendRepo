"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateListingSchema = exports.createListingSchema = void 0;
const zod_1 = require("zod");
exports.createListingSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(5, 'Title must be at least 5 characters').max(200),
    type: zod_1.z.enum(['apartment', 'villa', 'plot', 'commercial'], {
        errorMap: () => ({ message: 'Invalid property type' }),
    }),
    listingType: zod_1.z.enum(['sell', 'rent'], {
        errorMap: () => ({ message: 'Must be "sell" or "rent"' }),
    }),
    role: zod_1.z.enum(['owner', 'agent'], {
        errorMap: () => ({ message: 'Must be "owner" or "agent"' }),
    }),
    price: zod_1.z.number({ required_error: 'Price is required' }).positive('Price must be positive'),
    area: zod_1.z.number({ required_error: 'Area is required' }).positive('Area must be positive'),
    locality: zod_1.z.string().trim().min(2, 'Locality is required').max(100),
    city: zod_1.z.string().trim().min(2, 'City is required').max(100),
    address: zod_1.z.string().trim().min(5, 'Address must be at least 5 characters').max(500),
    zipcode: zod_1.z.string().trim().regex(/^\d{6}$/, 'Zipcode must be a 6-digit number'),
    beds: zod_1.z.number().int().min(1).max(20).optional(),
    baths: zod_1.z.number().int().min(1).max(20).optional(),
    possessionStatus: zod_1.z.enum(['ready', 'under_construction']),
    possessionDate: zod_1.z.string().trim().optional(),
    reraId: zod_1.z.string().trim().max(100).optional(),
    ownerName: zod_1.z.string().trim().min(2, 'Owner name is required').max(100),
    ownerPhone: zod_1.z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    imageUrls: zod_1.z.array(zod_1.z.string().url()).optional().default([]),
});
exports.updateListingSchema = exports.createListingSchema.partial();
//# sourceMappingURL=listing.validator.js.map
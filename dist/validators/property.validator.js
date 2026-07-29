"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPropertySchema = exports.propertyFiltersSchema = void 0;
const zod_1 = require("zod");
exports.propertyFiltersSchema = zod_1.z.object({
    city: zod_1.z.string().trim().optional(),
    type: zod_1.z.enum(['all', 'apartment', 'villa', 'plot', 'commercial']).optional(),
    beds: zod_1.z.coerce.number().int().positive().optional(),
    priceMin: zod_1.z.coerce.number().nonnegative().optional(),
    priceMax: zod_1.z.coerce.number().positive().optional(),
    possessionStatus: zod_1.z.enum(['all', 'ready', 'under_construction']).optional(),
    searchQuery: zod_1.z.string().trim().max(200).optional(),
    sortBy: zod_1.z.enum(['popular', 'price_asc', 'price_desc', 'newest']).optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    featured: zod_1.z.coerce.boolean().optional(),
    verified: zod_1.z.coerce.boolean().optional(),
    ids: zod_1.z.string().optional(),
});
exports.createPropertySchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(5, 'Title must be at least 5 characters').max(200),
    description: zod_1.z.string().trim().min(20, 'Description must be at least 20 characters'),
    price: zod_1.z.number().positive('Price must be positive'),
    priceFormatted: zod_1.z.string().trim().min(1),
    location: zod_1.z.string().trim().min(3),
    locality: zod_1.z.string().trim().min(2),
    city: zod_1.z.string().trim().min(2),
    type: zod_1.z.enum(['apartment', 'villa', 'plot', 'commercial']),
    commercialType: zod_1.z.enum(['office', 'retail', 'warehouse']).optional(),
    beds: zod_1.z.number().int().positive().optional(),
    baths: zod_1.z.number().int().positive().optional(),
    area: zod_1.z.number().positive('Area must be positive'),
    pricePerSqFt: zod_1.z.number().positive(),
    possessionDate: zod_1.z.string().trim().min(1),
    possessionStatus: zod_1.z.enum(['ready', 'under_construction']),
    reraId: zod_1.z.string().trim().optional(),
    featured: zod_1.z.boolean().default(false),
    rating: zod_1.z.number().min(0).max(5).default(4.0),
    verified: zod_1.z.boolean().default(false),
    builderId: zod_1.z.string().uuid(),
    amenities: zod_1.z.array(zod_1.z.string().trim()).default([]),
    floorPlans: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().trim().min(1),
        beds: zod_1.z.number().int().positive(),
        baths: zod_1.z.number().int().positive(),
        area: zod_1.z.number().positive(),
        price: zod_1.z.number().positive(),
        image: zod_1.z.string().url(),
    })).default([]),
    distanceHubs: zod_1.z.array(zod_1.z.object({
        place: zod_1.z.string().trim().min(1),
        distance: zod_1.z.string().trim().min(1),
    })).default([]),
    images: zod_1.z.array(zod_1.z.string().url()).min(1, 'At least one image is required'),
});
//# sourceMappingURL=property.validator.js.map
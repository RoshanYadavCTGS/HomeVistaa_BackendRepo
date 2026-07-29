import { z } from 'zod';

export const propertyFiltersSchema = z.object({
  city: z.string().trim().optional(),
  type: z.enum(['all', 'apartment', 'villa', 'plot', 'commercial']).optional(),
  beds: z.coerce.number().int().positive().optional(),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().positive().optional(),
  possessionStatus: z.enum(['all', 'ready', 'under_construction']).optional(),
  searchQuery: z.string().trim().max(200).optional(),
  sortBy: z.enum(['popular', 'price_asc', 'price_desc', 'newest']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  featured: z.coerce.boolean().optional(),
  verified: z.coerce.boolean().optional(),
  ids: z.string().optional(),
});

export const createPropertySchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().trim().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be positive'),
  priceFormatted: z.string().trim().min(1),
  location: z.string().trim().min(3),
  locality: z.string().trim().min(2),
  city: z.string().trim().min(2),
  type: z.enum(['apartment', 'villa', 'plot', 'commercial']),
  commercialType: z.enum(['office', 'retail', 'warehouse']).optional(),
  beds: z.number().int().positive().optional(),
  baths: z.number().int().positive().optional(),
  area: z.number().positive('Area must be positive'),
  pricePerSqFt: z.number().positive(),
  possessionDate: z.string().trim().min(1),
  possessionStatus: z.enum(['ready', 'under_construction']),
  reraId: z.string().trim().optional(),
  featured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(4.0),
  verified: z.boolean().default(false),
  builderId: z.string().uuid(),
  amenities: z.array(z.string().trim()).default([]),
  floorPlans: z.array(z.object({
    name: z.string().trim().min(1),
    beds: z.number().int().positive(),
    baths: z.number().int().positive(),
    area: z.number().positive(),
    price: z.number().positive(),
    image: z.string().url(),
  })).default([]),
  distanceHubs: z.array(z.object({
    place: z.string().trim().min(1),
    distance: z.string().trim().min(1),
  })).default([]),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
});

export type PropertyFiltersInput = z.infer<typeof propertyFiltersSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(200),
  type: z.enum(['apartment', 'villa', 'plot', 'commercial'], {
    errorMap: () => ({ message: 'Invalid property type' }),
  }),
  listingType: z.enum(['sell', 'rent'], {
    errorMap: () => ({ message: 'Must be "sell" or "rent"' }),
  }),
  role: z.enum(['owner', 'agent'], {
    errorMap: () => ({ message: 'Must be "owner" or "agent"' }),
  }),
  price: z.number({ required_error: 'Price is required' }).positive('Price must be positive'),
  area: z.number({ required_error: 'Area is required' }).positive('Area must be positive'),
  locality: z.string().trim().min(2, 'Locality is required').max(100),
  city: z.string().trim().min(2, 'City is required').max(100),
  address: z.string().trim().min(5, 'Address must be at least 5 characters').max(500),
  zipcode: z.string().trim().regex(/^\d{6}$/, 'Zipcode must be a 6-digit number'),
  beds: z.number().int().min(1).max(20).optional(),
  baths: z.number().int().min(1).max(20).optional(),
  possessionStatus: z.enum(['ready', 'under_construction']),
  possessionDate: z.string().trim().optional(),
  reraId: z.string().trim().max(100).optional(),
  ownerName: z.string().trim().min(2, 'Owner name is required').max(100),
  ownerPhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  imageUrls: z.array(z.string().url()).optional().default([]),
});

export const updateListingSchema = createListingSchema.partial();

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;

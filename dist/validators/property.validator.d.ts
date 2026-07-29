import { z } from 'zod';
export declare const propertyFiltersSchema: z.ZodObject<{
    city: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["all", "apartment", "villa", "plot", "commercial"]>>;
    beds: z.ZodOptional<z.ZodNumber>;
    priceMin: z.ZodOptional<z.ZodNumber>;
    priceMax: z.ZodOptional<z.ZodNumber>;
    possessionStatus: z.ZodOptional<z.ZodEnum<["all", "ready", "under_construction"]>>;
    searchQuery: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodEnum<["popular", "price_asc", "price_desc", "newest"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    featured: z.ZodOptional<z.ZodBoolean>;
    verified: z.ZodOptional<z.ZodBoolean>;
    ids: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    city?: string | undefined;
    type?: "all" | "apartment" | "villa" | "plot" | "commercial" | undefined;
    beds?: number | undefined;
    possessionStatus?: "all" | "ready" | "under_construction" | undefined;
    sortBy?: "popular" | "price_asc" | "price_desc" | "newest" | undefined;
    priceMin?: number | undefined;
    priceMax?: number | undefined;
    searchQuery?: string | undefined;
    featured?: boolean | undefined;
    verified?: boolean | undefined;
    ids?: string | undefined;
}, {
    limit?: number | undefined;
    city?: string | undefined;
    type?: "all" | "apartment" | "villa" | "plot" | "commercial" | undefined;
    beds?: number | undefined;
    possessionStatus?: "all" | "ready" | "under_construction" | undefined;
    sortBy?: "popular" | "price_asc" | "price_desc" | "newest" | undefined;
    priceMin?: number | undefined;
    priceMax?: number | undefined;
    searchQuery?: string | undefined;
    page?: number | undefined;
    featured?: boolean | undefined;
    verified?: boolean | undefined;
    ids?: string | undefined;
}>;
export declare const createPropertySchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    priceFormatted: z.ZodString;
    location: z.ZodString;
    locality: z.ZodString;
    city: z.ZodString;
    type: z.ZodEnum<["apartment", "villa", "plot", "commercial"]>;
    commercialType: z.ZodOptional<z.ZodEnum<["office", "retail", "warehouse"]>>;
    beds: z.ZodOptional<z.ZodNumber>;
    baths: z.ZodOptional<z.ZodNumber>;
    area: z.ZodNumber;
    pricePerSqFt: z.ZodNumber;
    possessionDate: z.ZodString;
    possessionStatus: z.ZodEnum<["ready", "under_construction"]>;
    reraId: z.ZodOptional<z.ZodString>;
    featured: z.ZodDefault<z.ZodBoolean>;
    rating: z.ZodDefault<z.ZodNumber>;
    verified: z.ZodDefault<z.ZodBoolean>;
    builderId: z.ZodString;
    amenities: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    floorPlans: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        beds: z.ZodNumber;
        baths: z.ZodNumber;
        area: z.ZodNumber;
        price: z.ZodNumber;
        image: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        price: number;
        area: number;
        beds: number;
        baths: number;
        image: string;
    }, {
        name: string;
        price: number;
        area: number;
        beds: number;
        baths: number;
        image: string;
    }>, "many">>;
    distanceHubs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        place: z.ZodString;
        distance: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        place: string;
        distance: string;
    }, {
        place: string;
        distance: string;
    }>, "many">>;
    images: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    city: string;
    title: string;
    type: "apartment" | "villa" | "plot" | "commercial";
    price: number;
    area: number;
    locality: string;
    possessionStatus: "ready" | "under_construction";
    possessionDate: string;
    amenities: string[];
    images: string[];
    description: string;
    builderId: string;
    featured: boolean;
    verified: boolean;
    priceFormatted: string;
    location: string;
    pricePerSqFt: number;
    rating: number;
    floorPlans: {
        name: string;
        price: number;
        area: number;
        beds: number;
        baths: number;
        image: string;
    }[];
    distanceHubs: {
        place: string;
        distance: string;
    }[];
    beds?: number | undefined;
    baths?: number | undefined;
    reraId?: string | undefined;
    commercialType?: "office" | "retail" | "warehouse" | undefined;
}, {
    city: string;
    title: string;
    type: "apartment" | "villa" | "plot" | "commercial";
    price: number;
    area: number;
    locality: string;
    possessionStatus: "ready" | "under_construction";
    possessionDate: string;
    images: string[];
    description: string;
    builderId: string;
    priceFormatted: string;
    location: string;
    pricePerSqFt: number;
    beds?: number | undefined;
    baths?: number | undefined;
    reraId?: string | undefined;
    amenities?: string[] | undefined;
    featured?: boolean | undefined;
    verified?: boolean | undefined;
    commercialType?: "office" | "retail" | "warehouse" | undefined;
    rating?: number | undefined;
    floorPlans?: {
        name: string;
        price: number;
        area: number;
        beds: number;
        baths: number;
        image: string;
    }[] | undefined;
    distanceHubs?: {
        place: string;
        distance: string;
    }[] | undefined;
}>;
export type PropertyFiltersInput = z.infer<typeof propertyFiltersSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
//# sourceMappingURL=property.validator.d.ts.map
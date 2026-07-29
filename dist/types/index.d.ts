import { Request } from 'express';
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    accountType?: string;
    permissions?: string[];
    iat?: number;
    exp?: number;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: PaginationMeta;
    errors?: ValidationError[];
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface ValidationError {
    field: string;
    message: string;
}
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}
export interface PropertyFilters {
    city?: string;
    type?: string;
    beds?: number;
    priceMin?: number;
    priceMax?: number;
    possessionStatus?: string;
    searchQuery?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}
export interface PropertyResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    priceFormatted: string;
    location: string;
    locality: string;
    city: string;
    type: string;
    commercialType?: string;
    beds?: number;
    baths?: number;
    area: number;
    pricePerSqFt: number;
    possessionDate: string;
    possessionStatus: string;
    reraId?: string;
    featured: boolean;
    rating: number;
    verified: boolean;
    builder: BuilderResponse;
    images: string[];
    amenities: string[];
    floorPlans: FloorPlanResponse[];
    distanceFromHubs: DistanceHubResponse[];
    createdAt: Date;
}
export interface BuilderResponse {
    id: string;
    name: string;
    logo: string;
    rating: number;
    experience: number;
    projectsCount: number;
    description: string;
}
export interface FloorPlanResponse {
    name: string;
    beds: number;
    baths: number;
    area: number;
    price: number;
    image: string;
}
export interface DistanceHubResponse {
    place: string;
    distance: string;
}
export interface CreateListingInput {
    title: string;
    type: 'apartment' | 'villa' | 'plot' | 'commercial';
    listingType: 'sell' | 'rent';
    role: 'owner' | 'agent';
    price: number;
    area: number;
    locality: string;
    city: string;
    address: string;
    zipcode: string;
    beds?: number;
    baths?: number;
    possessionStatus: 'ready' | 'under_construction';
    possessionDate?: string;
    reraId?: string;
    ownerName: string;
    ownerPhone: string;
    imageUrls?: string[];
}
export interface CreateInquiryInput {
    name: string;
    email: string;
    phone: string;
    message: string;
    inquiryType: 'general' | 'visit' | 'brochure' | 'callback' | 'advisor';
    propertyId?: string;
    propertyName?: string;
    datePreference?: string;
}
export interface CreateAlertInput {
    title: string;
    description: string;
    filtersJson: Record<string, unknown>;
}
export interface CreateServiceRequestInput {
    name: string;
    email: string;
    phone: string;
    address?: string;
    details?: string;
    serviceType: 'agreement' | 'verification' | 'management';
}
export interface CreateProfessionalInput {
    name: string;
    email: string;
    phone: string;
    company: string;
    reraId?: string;
    experience: number;
    role: 'agent' | 'developer';
}
//# sourceMappingURL=index.d.ts.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProperties = findProperties;
exports.findPropertyById = findPropertyById;
exports.createProperty = createProperty;
exports.deleteProperty = deleteProperty;
exports.getFeaturedProperties = getFeaturedProperties;
const database_1 = __importDefault(require("../config/database"));
const pagination_1 = require("../utils/pagination");
// Prisma include definition for full property response
const propertyInclude = {
    builder: true,
    images: { orderBy: { sortOrder: 'asc' } },
    amenities: true,
    floorPlans: true,
    distanceHubs: true,
};
// Map DB row to clean API response shape
function mapProperty(p) {
    return {
        id: p.id,
        title: p.title,
        description: p.description,
        price: Number(p.price),
        priceFormatted: p.priceFormatted,
        location: p.location,
        locality: p.locality,
        city: p.city,
        type: p.type,
        commercialType: p.commercialType ?? undefined,
        beds: p.beds ?? undefined,
        baths: p.baths ?? undefined,
        area: p.area,
        pricePerSqFt: p.pricePerSqFt,
        possessionDate: p.possessionDate,
        possessionStatus: p.possessionStatus,
        reraId: p.reraId ?? undefined,
        featured: p.featured,
        rating: p.rating,
        verified: p.verified,
        builder: {
            id: p.builder.id,
            name: p.builder.name,
            logo: p.builder.logo,
            rating: p.builder.rating,
            experience: p.builder.experience,
            projectsCount: p.builder.projectsCount,
            description: p.builder.description,
        },
        images: p.images.map((img) => img.url),
        amenities: p.amenities.map((a) => a.amenity),
        floorPlans: p.floorPlans.map((fp) => ({
            name: fp.name,
            beds: fp.beds,
            baths: fp.baths,
            area: fp.area,
            price: Number(fp.price),
            image: fp.image,
        })),
        distanceFromHubs: p.distanceHubs.map((d) => ({
            place: d.place,
            distance: d.distance,
        })),
        createdAt: p.createdAt,
    };
}
async function findProperties(filters) {
    const { page, limit, skip } = (0, pagination_1.parsePagination)({ page: filters.page, limit: filters.limit });
    const where = {};
    if (filters.city && filters.city !== 'all') {
        where.city = { equals: filters.city, mode: 'insensitive' };
    }
    if (filters.type && filters.type !== 'all') {
        where.type = filters.type;
    }
    if (filters.possessionStatus && filters.possessionStatus !== 'all') {
        where.possessionStatus = filters.possessionStatus;
    }
    if (filters.beds) {
        where.beds = filters.beds;
    }
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        where.price = {
            ...(filters.priceMin !== undefined && { gte: filters.priceMin }),
            ...(filters.priceMax !== undefined && { lte: filters.priceMax }),
        };
    }
    if (filters.searchQuery) {
        const q = filters.searchQuery;
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { location: { contains: q, mode: 'insensitive' } },
            { locality: { contains: q, mode: 'insensitive' } },
            { builder: { name: { contains: q, mode: 'insensitive' } } },
        ];
    }
    if (filters.featured !== undefined)
        where.featured = filters.featured;
    if (filters.verified !== undefined)
        where.verified = filters.verified;
    if (filters.ids) {
        where.id = { in: filters.ids.split(',').map((id) => id.trim()).filter(Boolean) };
    }
    // Sort order
    let orderBy = { rating: 'desc' };
    if (filters.sortBy === 'price_asc')
        orderBy = { price: 'asc' };
    else if (filters.sortBy === 'price_desc')
        orderBy = { price: 'desc' };
    else if (filters.sortBy === 'newest')
        orderBy = { createdAt: 'desc' };
    const [total, rows] = await Promise.all([
        database_1.default.property.count({ where }),
        database_1.default.property.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: propertyInclude,
        }),
    ]);
    return {
        properties: rows.map(mapProperty),
        meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
    };
}
async function findPropertyById(id) {
    const p = await database_1.default.property.findUnique({
        where: { id },
        include: propertyInclude,
    });
    return p ? mapProperty(p) : null;
}
async function createProperty(data) {
    const { amenities, images, floorPlans, distanceHubs, ...propertyData } = data;
    return database_1.default.property.create({
        data: {
            ...propertyData,
            price: BigInt(Math.round(propertyData.price)),
            type: propertyData.type,
            possessionStatus: propertyData.possessionStatus,
            commercialType: propertyData.commercialType,
            amenities: { create: amenities.map((amenity) => ({ amenity })) },
            images: {
                create: images.map((url, idx) => ({ url, isPrimary: idx === 0, sortOrder: idx })),
            },
            floorPlans: {
                create: floorPlans.map((fp) => ({ ...fp, price: BigInt(Math.round(fp.price)) })),
            },
            distanceHubs: { create: distanceHubs },
        },
        include: propertyInclude,
    });
}
async function deleteProperty(id) {
    return database_1.default.property.delete({ where: { id } });
}
async function getFeaturedProperties(limit = 6) {
    const rows = await database_1.default.property.findMany({
        where: { featured: true },
        take: limit,
        orderBy: { rating: 'desc' },
        include: propertyInclude,
    });
    return rows.map(mapProperty);
}
//# sourceMappingURL=property.repository.js.map
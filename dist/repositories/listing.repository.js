"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListing = createListing;
exports.findListingsByUser = findListingsByUser;
exports.findListingById = findListingById;
exports.updateListing = updateListing;
exports.deleteListing = deleteListing;
exports.findAllListings = findAllListings;
exports.updateListingStatus = updateListingStatus;
const database_1 = __importDefault(require("../config/database"));
const pagination_1 = require("../utils/pagination");
const listingInclude = { images: true, _count: { select: { leads: true } } };
function mapListing(l) {
    return {
        id: l.id,
        userId: l.userId,
        title: l.title,
        type: l.type,
        listingType: l.listingType,
        role: l.role,
        price: Number(l.price),
        area: l.area,
        locality: l.locality,
        city: l.city,
        address: l.address,
        zipcode: l.zipcode,
        beds: l.beds ?? undefined,
        baths: l.baths ?? undefined,
        possessionStatus: l.possessionStatus,
        possessionDate: l.possessionDate ?? undefined,
        reraId: l.reraId ?? undefined,
        ownerName: l.ownerName,
        ownerPhone: l.ownerPhone,
        status: l.status,
        adminNote: l.adminNote ?? undefined,
        images: l.images.map((img) => img.url),
        expiryDate: l.expiryDate,
        analytics: l.analytics,
        leadsCount: l._count?.leads || 0,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
    };
}
async function createListing(userId, data) {
    const { imageUrls = [], ...listingData } = data;
    const listing = await database_1.default.listing.create({
        data: {
            ...listingData,
            userId,
            price: BigInt(Math.round(data.price)),
            type: data.type,
            listingType: data.listingType,
            role: data.role,
            possessionStatus: data.possessionStatus,
            status: 'draft',
            images: {
                create: imageUrls.map((url) => ({ url })),
            },
        },
        include: listingInclude,
    });
    return mapListing(listing);
}
async function findListingsByUser(userId, page = 1, limit = 20, filters = {}) {
    const { skip } = (0, pagination_1.parsePagination)({ page, limit });
    const where = { userId };
    if (filters.search) {
        where.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { id: { equals: filters.search } }
        ];
    }
    if (filters.status) {
        where.status = filters.status;
    }
    else {
        where.status = { not: 'draft' };
    }
    if (filters.type)
        where.type = filters.type;
    if (filters.listingType)
        where.listingType = filters.listingType;
    if (filters.city)
        where.city = filters.city;
    const orderBy = {};
    if (filters.sort === 'oldest')
        orderBy.createdAt = 'asc';
    else
        orderBy.createdAt = 'desc';
    const [total, rows] = await Promise.all([
        database_1.default.listing.count({ where }),
        database_1.default.listing.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: listingInclude,
        }),
    ]);
    return {
        listings: rows.map(r => mapListing(r)),
        meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
    };
}
async function findListingById(id) {
    const l = await database_1.default.listing.findUnique({ where: { id }, include: listingInclude });
    return l ? mapListing(l) : null;
}
async function updateListing(id, data) {
    const { imageUrls: _img, ...rest } = data;
    const l = await database_1.default.listing.update({
        where: { id },
        data: {
            ...rest,
            ...(rest.price && { price: BigInt(Math.round(rest.price)) }),
        },
        include: listingInclude,
    });
    return mapListing(l);
}
async function deleteListing(id) {
    return database_1.default.listing.delete({ where: { id } });
}
// Admin: list all listings with pagination
async function findAllListings(page = 1, limit = 20, status) {
    const { skip } = (0, pagination_1.parsePagination)({ page, limit });
    const where = status ? { status: status } : {};
    const [total, rows] = await Promise.all([
        database_1.default.listing.count({ where }),
        database_1.default.listing.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: listingInclude,
        }),
    ]);
    return {
        listings: rows.map(mapListing),
        meta: (0, pagination_1.buildPaginationMeta)(total, page, limit),
    };
}
async function updateListingStatus(id, status, adminNote) {
    return database_1.default.listing.update({
        where: { id },
        data: { status: status, adminNote },
    });
}
//# sourceMappingURL=listing.repository.js.map
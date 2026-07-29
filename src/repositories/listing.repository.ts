import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { CreateListingInput } from '../validators/listing.validator';

const listingInclude: Prisma.ListingInclude = { images: true, _count: { select: { leads: true } } };

function mapListing(l: Prisma.ListingGetPayload<{ include: typeof listingInclude }>) {
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
    expiryDate: (l as any).expiryDate,
    analytics: (l as any).analytics,
    leadsCount: (l as any)._count?.leads || 0,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  };
}

export async function createListing(userId: string, data: CreateListingInput) {
  const { imageUrls = [], ...listingData } = data;

  const listing = await prisma.listing.create({
    data: {
      ...listingData,
      userId,
      price: BigInt(Math.round(data.price)),
      type: data.type as any,
      listingType: data.listingType as any,
      role: data.role as any,
      possessionStatus: data.possessionStatus as any,
      status: 'draft',
      images: {
        create: imageUrls.map((url) => ({ url })),
      },
    },
    include: listingInclude,
  });

  return mapListing(listing as any);
}

export async function findListingsByUser(userId: string, page = 1, limit = 20, filters: any = {}) {
  const { skip } = parsePagination({ page, limit });

  const where: any = { userId };
  
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { id: { equals: filters.search } }
    ];
  }
  if (filters.status) {
    where.status = filters.status;
  } else {
    where.status = { not: 'draft' };
  }
  if (filters.type) where.type = filters.type;
  if (filters.listingType) where.listingType = filters.listingType;
  if (filters.city) where.city = filters.city;

  const orderBy: any = {};
  if (filters.sort === 'oldest') orderBy.createdAt = 'asc';
  else orderBy.createdAt = 'desc';

  const [total, rows] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: listingInclude,
    }),
  ]);

  return {
    listings: rows.map(r => mapListing(r as any)),
    meta: buildPaginationMeta(total, page, limit),
  };
}

export async function findListingById(id: string) {
  const l = await prisma.listing.findUnique({ where: { id }, include: listingInclude });
  return l ? mapListing(l) : null;
}

export async function updateListing(id: string, data: Partial<CreateListingInput>) {
  const { imageUrls: _img, ...rest } = data;
  const l = await prisma.listing.update({
    where: { id },
    data: {
      ...rest,
      ...(rest.price && { price: BigInt(Math.round(rest.price)) }),
    },
    include: listingInclude,
  });
  return mapListing(l);
}

export async function deleteListing(id: string) {
  return prisma.listing.delete({ where: { id } });
}

// Admin: list all listings with pagination
export async function findAllListings(page = 1, limit = 20, status?: string) {
  const { skip } = parsePagination({ page, limit });
  const where = status ? { status: status as Prisma.EnumListingStatusFilter } : {};

  const [total, rows] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: listingInclude,
    }),
  ]);

  return {
    listings: rows.map(mapListing),
    meta: buildPaginationMeta(total, page, limit),
  };
}

export async function updateListingStatus(id: string, status: string, adminNote?: string) {
  return prisma.listing.update({
    where: { id },
    data: { status: status as any, adminNote },
  });
}

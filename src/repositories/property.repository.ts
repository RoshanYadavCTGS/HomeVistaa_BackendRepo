import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { PropertyFiltersInput } from '../validators/property.validator';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';

// Prisma include definition for full property response
const propertyInclude: Prisma.PropertyInclude = {
  builder: true,
  images: { orderBy: { sortOrder: 'asc' } },
  amenities: true,
  floorPlans: true,
  distanceHubs: true,
};

// Map DB row to clean API response shape
function mapProperty(p: Prisma.PropertyGetPayload<{ include: typeof propertyInclude }>) {
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

export async function findProperties(filters: PropertyFiltersInput) {
  const { page, limit, skip } = parsePagination({ page: filters.page, limit: filters.limit });

  const where: Prisma.PropertyWhereInput = {};

  if (filters.city && filters.city !== 'all') {
    where.city = { equals: filters.city, mode: 'insensitive' };
  }

  if (filters.type && filters.type !== 'all') {
    where.type = filters.type as Prisma.EnumPropertyTypeFilter;
  }

  if (filters.possessionStatus && filters.possessionStatus !== 'all') {
    where.possessionStatus = filters.possessionStatus as Prisma.EnumPossessionStatusFilter;
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

  if (filters.featured !== undefined) where.featured = filters.featured;
  if (filters.verified !== undefined) where.verified = filters.verified;

  if (filters.ids) {
    where.id = { in: filters.ids.split(',').map((id) => id.trim()).filter(Boolean) };
  }

  // Sort order
  let orderBy: Prisma.PropertyOrderByWithRelationInput = { rating: 'desc' };
  if (filters.sortBy === 'price_asc') orderBy = { price: 'asc' };
  else if (filters.sortBy === 'price_desc') orderBy = { price: 'desc' };
  else if (filters.sortBy === 'newest') orderBy = { createdAt: 'desc' };

  const [total, rows] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: propertyInclude,
    }),
  ]);

  return {
    properties: rows.map(mapProperty),
    meta: buildPaginationMeta(total, page, limit),
  };
}

export async function findPropertyById(id: string) {
  const p = await prisma.property.findUnique({
    where: { id },
    include: propertyInclude,
  });
  return p ? mapProperty(p) : null;
}

export async function createProperty(data: {
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
  builderId: string;
  amenities: string[];
  images: string[];
  floorPlans: Array<{ name: string; beds: number; baths: number; area: number; price: number; image: string }>;
  distanceHubs: Array<{ place: string; distance: string }>;
}) {
  const { amenities, images, floorPlans, distanceHubs, ...propertyData } = data;

  return prisma.property.create({
    data: {
      ...propertyData,
      price: BigInt(Math.round(propertyData.price)),
      type: propertyData.type as any,
      possessionStatus: propertyData.possessionStatus as any,
      commercialType: propertyData.commercialType as any,
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

export async function deleteProperty(id: string) {
  return prisma.property.delete({ where: { id } });
}

export async function getFeaturedProperties(limit = 6) {
  const rows = await prisma.property.findMany({
    where: { featured: true },
    take: limit,
    orderBy: { rating: 'desc' },
    include: propertyInclude,
  });
  return rows.map(mapProperty);
}

import prisma from '../config/database';
import crypto from 'crypto';

export interface SearchCriteria {
  keyword?: string;
  city?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  propertyType?: string;
  listingPurpose?: string;
  bhk?: number;
  minPrice?: number;
  maxPrice?: number;
  builder?: string;
  possessionStatus?: string;
  sortBy?: string;
  resultsCount?: number;
  filtersJson?: Record<string, any>;
  device?: string;
  browser?: string;
  ipAddress?: string;
}

/** Generate a deterministic hash for dedup */
function buildSearchHash(userId: string, criteria: SearchCriteria): string {
  const normalized = {
    keyword: (criteria.keyword || '').toLowerCase().trim(),
    city: (criteria.city || '').toLowerCase().trim(),
    locality: (criteria.locality || '').toLowerCase().trim(),
    propertyType: criteria.propertyType || 'all',
    listingPurpose: criteria.listingPurpose || 'buy',
    bhk: criteria.bhk ?? null,
    minPrice: criteria.minPrice ?? 0,
    maxPrice: criteria.maxPrice ?? 150000000,
    possessionStatus: criteria.possessionStatus || 'all',
    sortBy: criteria.sortBy || 'popular',
  };
  const str = userId + '|' + JSON.stringify(normalized);
  return crypto.createHash('sha256').update(str).digest('hex').slice(0, 32);
}

/** Auto-generate a human-readable search title */
function buildSearchTitle(criteria: SearchCriteria): string {
  const parts: string[] = [];

  if (criteria.bhk) {
    parts.push(`${criteria.bhk} BHK`);
  }

  if (criteria.propertyType && criteria.propertyType !== 'all') {
    const typeMap: Record<string, string> = {
      apartment: 'Apartments',
      villa: 'Villas',
      plot: 'Plots',
      commercial: 'Commercial',
    };
    parts.push(typeMap[criteria.propertyType] || criteria.propertyType);
  } else if (parts.length === 0) {
    parts.push('Properties');
  }

  if (criteria.listingPurpose) {
    parts.push(criteria.listingPurpose === 'rent' ? 'For Rent' : 'For Buy');
  }

  if (criteria.locality) {
    parts.push(`in ${criteria.locality}`);
  } else if (criteria.city) {
    parts.push(`in ${criteria.city}`);
  }

  if (criteria.keyword && !criteria.locality && !criteria.city) {
    parts.push(`"${criteria.keyword}"`);
  }

  return parts.length > 0 ? parts.join(' ') : 'All Properties';
}

/** Upsert: insert new or update lastSearchedAt + resultsCount on duplicate */
export async function upsertSearchHistory(userId: string, criteria: SearchCriteria) {
  const searchHash = buildSearchHash(userId, criteria);
  const searchTitle = buildSearchTitle(criteria);

  const record = await prisma.searchHistory.upsert({
    where: { userId_searchHash: { userId, searchHash } },
    update: {
      lastSearchedAt: new Date(),
      resultsCount: criteria.resultsCount ?? 0,
      filtersJson: criteria.filtersJson as any,
      device: criteria.device,
      browser: criteria.browser,
      ipAddress: criteria.ipAddress,
      latitude: criteria.latitude,
      longitude: criteria.longitude,
      builder: criteria.builder
    },
    create: {
      userId,
      searchHash,
      searchTitle,
      keyword: criteria.keyword || null,
      city: criteria.city || null,
      locality: criteria.locality || null,
      latitude: criteria.latitude || null,
      longitude: criteria.longitude || null,
      propertyType: criteria.propertyType || 'all',
      listingPurpose: criteria.listingPurpose || 'buy',
      bhk: criteria.bhk ?? null,
      minPrice: criteria.minPrice != null ? BigInt(Math.round(criteria.minPrice)) : null,
      maxPrice: criteria.maxPrice != null ? BigInt(Math.round(criteria.maxPrice)) : null,
      builder: criteria.builder || null,
      possessionStatus: criteria.possessionStatus || null,
      sortBy: criteria.sortBy || 'popular',
      filtersJson: criteria.filtersJson as any,
      resultsCount: criteria.resultsCount ?? 0,
      device: criteria.device,
      browser: criteria.browser,
      ipAddress: criteria.ipAddress,
    },
  });

  return mapRecord(record);
}

/** Map a raw SearchHistory record to a serializable object */
function mapRecord(s: any) {
  return {
    id: s.id,
    searchTitle: s.searchTitle,
    keyword: s.keyword,
    city: s.city,
    locality: s.locality,
    latitude: s.latitude,
    longitude: s.longitude,
    propertyType: s.propertyType,
    listingPurpose: s.listingPurpose,
    bhk: s.bhk,
    minPrice: s.minPrice != null ? Number(s.minPrice) : null,
    maxPrice: s.maxPrice != null ? Number(s.maxPrice) : null,
    builder: s.builder,
    possessionStatus: s.possessionStatus,
    sortBy: s.sortBy,
    filtersJson: s.filtersJson,
    resultsCount: s.resultsCount,
    device: s.device,
    browser: s.browser,
    ipAddress: s.ipAddress,
    createdAt: s.createdAt,
    lastSearchedAt: s.lastSearchedAt,
  };
}

/** Get paginated search history for a user */
export async function getSearchHistory(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [total, rows] = await Promise.all([
    prisma.searchHistory.count({ where: { userId } }),
    prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { lastSearchedAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);
  return {
    searches: rows.map(mapRecord),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + rows.length < total,
    },
  };
}

/** Delete a single search record */
export async function deleteSearchHistory(id: string) {
  return prisma.searchHistory.delete({ where: { id } });
}

/** Clear all search history for a user */
export async function clearAllSearchHistory(userId: string) {
  return prisma.searchHistory.deleteMany({ where: { userId } });
}

export async function findSearchById(id: string) {
  return prisma.searchHistory.findUnique({ where: { id } });
}


// --- Saved Searches ---

export async function createSavedSearch(userId: string, searchName: string, filtersJson: any, alertEnabled = false, notificationFrequency = 'daily') {
  return prisma.savedSearch.create({
    data: {
      userId,
      searchName,
      filtersJson,
      alertEnabled,
      notificationFrequency
    }
  });
}

export async function getSavedSearches(userId: string) {
  return prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateSavedSearch(id: string, data: { searchName?: string, alertEnabled?: boolean, notificationFrequency?: string }) {
  return prisma.savedSearch.update({
    where: { id },
    data
  });
}

export async function deleteSavedSearch(id: string) {
  return prisma.savedSearch.delete({ where: { id } });
}

export async function findSavedSearchById(id: string) {
  return prisma.savedSearch.findUnique({ where: { id } });
}

// --- Recently Viewed ---
export async function getRecentlyViewed(userId: string, limit = 20) {
  const history = await prisma.propertyBrowsingHistory.findMany({
    where: { userId },
    orderBy: { visitedAt: 'desc' },
    take: 50,
    include: {
      property: {
        include: {
          builder: true,
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      }
    }
  });

  const seenPropertyIds = new Set<string>();
  const results: any[] = [];

  for (const h of history) {
    if (!h.property) continue;
    if (seenPropertyIds.has(h.property.id)) continue;
    seenPropertyIds.add(h.property.id);

    results.push({
      id: h.id,
      visitedAt: h.visitedAt,
      property: {
        id: h.property.id,
        title: h.property.title,
        type: h.property.type,
        city: h.property.city,
        locality: h.property.locality,
        location: h.property.location,
        price: Number(h.property.price),
        priceFormatted: h.property.priceFormatted,
        bhk: h.property.beds,
        builderName: h.property.builder?.name || 'HomeVistaa Partner',
        image: h.property.images[0]?.url || ''
      }
    });

    if (results.length >= limit) break;
  }

  return results;
}

// --- Recommendations Engine ---
export async function getRecommendations(userId: string) {
  // Simple heuristic based algorithm:
  // Find top city and property type from history
  const history = await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { resultsCount: 'desc' },
    take: 5
  });

  if (history.length === 0) {
    // Fallback if no history: just return popular properties
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { builder: true, images: { where: { isPrimary: true }, take: 1 } }
    });
    return properties.map((p: any) => ({
      ...p, price: Number(p.price), image: p.images[0]?.url || '', builderName: p.builder?.name
    }));
  }

  // Find preferred city & type from most frequent search
  const preferredCity = history[0].city;
  const preferredType = history[0].propertyType;

  const where: any = {};
  if (preferredCity) where.city = preferredCity;
  if (preferredType && preferredType !== 'all') where.type = preferredType as any;

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { builder: true, images: { where: { isPrimary: true }, take: 1 } }
  });

  return properties.map((p: any) => ({
    ...p, price: Number(p.price), image: p.images[0]?.url || '', builderName: p.builder?.name
  }));
}

export async function getDashboardSummary(userId: string) {
  const [totalSearches, savedSearches, activeAlerts] = await Promise.all([
    prisma.searchHistory.count({ where: { userId } }),
    prisma.savedSearch.count({ where: { userId } }),
    prisma.savedSearch.count({ where: { userId, alertEnabled: true } })
  ]);
  return { totalSearches, savedSearches, activeAlerts };
}

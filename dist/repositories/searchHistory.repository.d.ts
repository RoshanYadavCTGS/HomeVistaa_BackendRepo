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
/** Upsert: insert new or update lastSearchedAt + resultsCount on duplicate */
export declare function upsertSearchHistory(userId: string, criteria: SearchCriteria): Promise<{
    id: any;
    searchTitle: any;
    keyword: any;
    city: any;
    locality: any;
    latitude: any;
    longitude: any;
    propertyType: any;
    listingPurpose: any;
    bhk: any;
    minPrice: number | null;
    maxPrice: number | null;
    builder: any;
    possessionStatus: any;
    sortBy: any;
    filtersJson: any;
    resultsCount: any;
    device: any;
    browser: any;
    ipAddress: any;
    createdAt: any;
    lastSearchedAt: any;
}>;
/** Get paginated search history for a user */
export declare function getSearchHistory(userId: string, page?: number, limit?: number): Promise<{
    searches: {
        id: any;
        searchTitle: any;
        keyword: any;
        city: any;
        locality: any;
        latitude: any;
        longitude: any;
        propertyType: any;
        listingPurpose: any;
        bhk: any;
        minPrice: number | null;
        maxPrice: number | null;
        builder: any;
        possessionStatus: any;
        sortBy: any;
        filtersJson: any;
        resultsCount: any;
        device: any;
        browser: any;
        ipAddress: any;
        createdAt: any;
        lastSearchedAt: any;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    };
}>;
/** Delete a single search record */
export declare function deleteSearchHistory(id: string): Promise<{
    builder: string | null;
    id: string;
    city: string | null;
    createdAt: Date;
    device: string | null;
    browser: string | null;
    ipAddress: string | null;
    userId: string;
    locality: string | null;
    possessionStatus: string | null;
    filtersJson: import("@prisma/client/runtime/library").JsonValue | null;
    propertyType: string | null;
    searchTitle: string;
    keyword: string | null;
    latitude: number | null;
    longitude: number | null;
    listingPurpose: string | null;
    bhk: number | null;
    minPrice: bigint | null;
    maxPrice: bigint | null;
    sortBy: string | null;
    resultsCount: number;
    searchHash: string;
    lastSearchedAt: Date;
}>;
/** Clear all search history for a user */
export declare function clearAllSearchHistory(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare function findSearchById(id: string): Promise<{
    builder: string | null;
    id: string;
    city: string | null;
    createdAt: Date;
    device: string | null;
    browser: string | null;
    ipAddress: string | null;
    userId: string;
    locality: string | null;
    possessionStatus: string | null;
    filtersJson: import("@prisma/client/runtime/library").JsonValue | null;
    propertyType: string | null;
    searchTitle: string;
    keyword: string | null;
    latitude: number | null;
    longitude: number | null;
    listingPurpose: string | null;
    bhk: number | null;
    minPrice: bigint | null;
    maxPrice: bigint | null;
    sortBy: string | null;
    resultsCount: number;
    searchHash: string;
    lastSearchedAt: Date;
} | null>;
export declare function createSavedSearch(userId: string, searchName: string, filtersJson: any, alertEnabled?: boolean, notificationFrequency?: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    filtersJson: import("@prisma/client/runtime/library").JsonValue;
    searchName: string;
    alertEnabled: boolean;
    notificationFrequency: string;
}>;
export declare function getSavedSearches(userId: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    filtersJson: import("@prisma/client/runtime/library").JsonValue;
    searchName: string;
    alertEnabled: boolean;
    notificationFrequency: string;
}[]>;
export declare function updateSavedSearch(id: string, data: {
    searchName?: string;
    alertEnabled?: boolean;
    notificationFrequency?: string;
}): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    filtersJson: import("@prisma/client/runtime/library").JsonValue;
    searchName: string;
    alertEnabled: boolean;
    notificationFrequency: string;
}>;
export declare function deleteSavedSearch(id: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    filtersJson: import("@prisma/client/runtime/library").JsonValue;
    searchName: string;
    alertEnabled: boolean;
    notificationFrequency: string;
}>;
export declare function findSavedSearchById(id: string): Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    filtersJson: import("@prisma/client/runtime/library").JsonValue;
    searchName: string;
    alertEnabled: boolean;
    notificationFrequency: string;
} | null>;
export declare function getRecentlyViewed(userId: string, limit?: number): Promise<any[]>;
export declare function getRecommendations(userId: string): Promise<any[]>;
export declare function getDashboardSummary(userId: string): Promise<{
    totalSearches: number;
    savedSearches: number;
    activeAlerts: number;
}>;
//# sourceMappingURL=searchHistory.repository.d.ts.map
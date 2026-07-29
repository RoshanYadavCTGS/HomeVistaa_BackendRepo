export declare function addFavorite(userId: string, propertyId: string): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    propertyId: string;
}>;
export declare function removeFavorite(userId: string, propertyId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare function getFavoriteIds(userId: string): Promise<string[]>;
export declare function isFavorited(userId: string, propertyId: string): Promise<boolean>;
export declare function getFavoritesCount(userId: string): Promise<number>;
//# sourceMappingURL=favorite.repository.d.ts.map
import prisma from '../config/database';

export async function addFavorite(userId: string, propertyId: string) {
  // Upsert to handle duplicate clicks gracefully
  return prisma.favorite.upsert({
    where: { userId_propertyId: { userId, propertyId } },
    create: { userId, propertyId },
    update: {}, // no-op if already exists
  });
}

export async function removeFavorite(userId: string, propertyId: string) {
  return prisma.favorite.deleteMany({ where: { userId, propertyId } });
}

export async function getFavoriteIds(userId: string): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { propertyId: true },
    orderBy: { createdAt: 'desc' },
  });
  return favorites.map((f) => f.propertyId);
}

export async function isFavorited(userId: string, propertyId: string): Promise<boolean> {
  const count = await prisma.favorite.count({ where: { userId, propertyId } });
  return count > 0;
}

export async function getFavoritesCount(userId: string): Promise<number> {
  return prisma.favorite.count({ where: { userId } });
}

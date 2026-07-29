import { Prisma, User, UserRole } from '@prisma/client';
import prisma from '../config/database';

export type SafeUser = Omit<User, 'passwordHash'>;

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  avatarUrl: true,
  phone: true,
  dob: true,
  city: true,
  pinCode: true,
  preferredLanguages: true,
  propertyPreferences: true,
  employmentDetails: true,
  accountType: true,
  addressDetails: true,
  securitySettings: true,
  notificationPrefs: true,
  documents: true,
  referralCode: true,
  createdAt: true,
  updatedAt: true,
};

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  accountType?: string;
}): Promise<SafeUser> {
  return prisma.user.create({
    data: {
      ...data,
      role: data.role || 'user',
    },
    select: safeUserSelect,
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: safeUserSelect,
  });
}

export async function findUserWithPasswordById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateUser(id: string, data: Partial<Prisma.UserUpdateInput>): Promise<SafeUser> {
  return prisma.user.update({
    where: { id },
    data,
    select: safeUserSelect,
  });
}

export async function storeRefreshToken(
  userId: string, 
  tokenHash: string, 
  expiresAt: Date,
  options?: { rememberMe?: boolean; device?: string; browser?: string; ipAddress?: string }
): Promise<void> {
  await prisma.refreshToken.create({
    data: { 
      userId, 
      tokenHash, 
      expiresAt,
      rememberMe: options?.rememberMe || false,
      device: options?.device || 'Unknown',
      browser: options?.browser || 'Unknown',
      ipAddress: options?.ipAddress || 'Unknown',
    },
  });
}

export async function findRefreshToken(tokenHash: string) {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
}

export async function deleteRefreshToken(tokenHash: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { tokenHash } });
}

export async function deleteAllUserRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}

export async function getUserStats(userId: string) {
  const [favoritesCount, listingsCount, alertsCount] = await Promise.all([
    prisma.favorite.count({ where: { userId } }),
    prisma.listing.count({ where: { userId } }),
    prisma.savedAlert.count({ where: { userId } }),
  ]);
  return { favoritesCount, listingsCount, alertsCount };
}

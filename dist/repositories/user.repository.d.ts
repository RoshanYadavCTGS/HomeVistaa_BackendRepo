import { Prisma, User, UserRole } from '@prisma/client';
export type SafeUser = Omit<User, 'passwordHash'>;
export declare function createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    accountType?: string;
}): Promise<SafeUser>;
export declare function findUserByEmail(email: string): Promise<User | null>;
export declare function findUserById(id: string): Promise<SafeUser | null>;
export declare function findUserWithPasswordById(id: string): Promise<User | null>;
export declare function updateUser(id: string, data: Partial<Prisma.UserUpdateInput>): Promise<SafeUser>;
export declare function storeRefreshToken(userId: string, tokenHash: string, expiresAt: Date, options?: {
    rememberMe?: boolean;
    device?: string;
    browser?: string;
    ipAddress?: string;
}): Promise<void>;
export declare function findRefreshToken(tokenHash: string): Promise<({
    user: {
        role: import(".prisma/client").$Enums.UserRole;
        name: string;
        id: string;
        email: string;
        passwordHash: string;
        emailVerified: boolean;
        avatarUrl: string | null;
        phone: string | null;
        dob: Date | null;
        city: string | null;
        pinCode: string | null;
        preferredLanguages: string[];
        propertyPreferences: Prisma.JsonValue | null;
        employmentDetails: Prisma.JsonValue | null;
        accountType: string | null;
        addressDetails: Prisma.JsonValue | null;
        securitySettings: Prisma.JsonValue | null;
        notificationPrefs: Prisma.JsonValue | null;
        documents: Prisma.JsonValue | null;
        referralCode: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    createdAt: Date;
    tokenHash: string;
    expiresAt: Date;
    rememberMe: boolean;
    device: string | null;
    browser: string | null;
    ipAddress: string | null;
    userId: string;
}) | null>;
export declare function deleteRefreshToken(tokenHash: string): Promise<void>;
export declare function deleteAllUserRefreshTokens(userId: string): Promise<void>;
export declare function getUserStats(userId: string): Promise<{
    favoritesCount: number;
    listingsCount: number;
    alertsCount: number;
}>;
//# sourceMappingURL=user.repository.d.ts.map
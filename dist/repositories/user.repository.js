"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.findUserWithPasswordById = findUserWithPasswordById;
exports.updateUser = updateUser;
exports.storeRefreshToken = storeRefreshToken;
exports.findRefreshToken = findRefreshToken;
exports.deleteRefreshToken = deleteRefreshToken;
exports.deleteAllUserRefreshTokens = deleteAllUserRefreshTokens;
exports.getUserStats = getUserStats;
const database_1 = __importDefault(require("../config/database"));
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
async function createUser(data) {
    return database_1.default.user.create({
        data: {
            ...data,
            role: data.role || 'user',
        },
        select: safeUserSelect,
    });
}
async function findUserByEmail(email) {
    return database_1.default.user.findUnique({ where: { email } });
}
async function findUserById(id) {
    return database_1.default.user.findUnique({
        where: { id },
        select: safeUserSelect,
    });
}
async function findUserWithPasswordById(id) {
    return database_1.default.user.findUnique({ where: { id } });
}
async function updateUser(id, data) {
    return database_1.default.user.update({
        where: { id },
        data,
        select: safeUserSelect,
    });
}
async function storeRefreshToken(userId, tokenHash, expiresAt, options) {
    await database_1.default.refreshToken.create({
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
async function findRefreshToken(tokenHash) {
    return database_1.default.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
    });
}
async function deleteRefreshToken(tokenHash) {
    await database_1.default.refreshToken.deleteMany({ where: { tokenHash } });
}
async function deleteAllUserRefreshTokens(userId) {
    await database_1.default.refreshToken.deleteMany({ where: { userId } });
}
async function getUserStats(userId) {
    const [favoritesCount, listingsCount, alertsCount] = await Promise.all([
        database_1.default.favorite.count({ where: { userId } }),
        database_1.default.listing.count({ where: { userId } }),
        database_1.default.savedAlert.count({ where: { userId } }),
    ]);
    return { favoritesCount, listingsCount, alertsCount };
}
//# sourceMappingURL=user.repository.js.map
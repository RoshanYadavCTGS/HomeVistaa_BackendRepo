"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFavorite = addFavorite;
exports.removeFavorite = removeFavorite;
exports.getFavoriteIds = getFavoriteIds;
exports.isFavorited = isFavorited;
exports.getFavoritesCount = getFavoritesCount;
const database_1 = __importDefault(require("../config/database"));
async function addFavorite(userId, propertyId) {
    // Upsert to handle duplicate clicks gracefully
    return database_1.default.favorite.upsert({
        where: { userId_propertyId: { userId, propertyId } },
        create: { userId, propertyId },
        update: {}, // no-op if already exists
    });
}
async function removeFavorite(userId, propertyId) {
    return database_1.default.favorite.deleteMany({ where: { userId, propertyId } });
}
async function getFavoriteIds(userId) {
    const favorites = await database_1.default.favorite.findMany({
        where: { userId },
        select: { propertyId: true },
        orderBy: { createdAt: 'desc' },
    });
    return favorites.map((f) => f.propertyId);
}
async function isFavorited(userId, propertyId) {
    const count = await database_1.default.favorite.count({ where: { userId, propertyId } });
    return count > 0;
}
async function getFavoritesCount(userId) {
    return database_1.default.favorite.count({ where: { userId } });
}
//# sourceMappingURL=favorite.repository.js.map
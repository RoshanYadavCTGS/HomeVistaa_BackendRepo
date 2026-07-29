"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = getFavorites;
exports.addFavorite = addFavorite;
exports.removeFavorite = removeFavorite;
exports.checkFavorite = checkFavorite;
const favoriteRepo = __importStar(require("../repositories/favorite.repository"));
const response_1 = require("../utils/response");
async function getFavorites(req, res, next) {
    try {
        const { userId } = req.user;
        const propertyIds = await favoriteRepo.getFavoriteIds(userId);
        (0, response_1.sendSuccess)(res, { propertyIds }, 'Favorites retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function addFavorite(req, res, next) {
    try {
        const { userId } = req.user;
        const { propertyId } = req.params;
        await favoriteRepo.addFavorite(userId, propertyId);
        (0, response_1.sendSuccess)(res, { propertyId }, 'Added to favorites');
    }
    catch (err) {
        next(err);
    }
}
async function removeFavorite(req, res, next) {
    try {
        const { userId } = req.user;
        const { propertyId } = req.params;
        const result = await favoriteRepo.removeFavorite(userId, propertyId);
        if (result.count === 0) {
            (0, response_1.sendNotFound)(res, 'Favorite not found');
            return;
        }
        (0, response_1.sendSuccess)(res, { propertyId }, 'Removed from favorites');
    }
    catch (err) {
        next(err);
    }
}
async function checkFavorite(req, res, next) {
    try {
        const { userId } = req.user;
        const { propertyId } = req.params;
        const isFavorited = await favoriteRepo.isFavorited(userId, propertyId);
        (0, response_1.sendSuccess)(res, { isFavorited }, 'Favorite status checked');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=favorites.controller.js.map
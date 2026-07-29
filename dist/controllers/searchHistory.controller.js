"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSearch = saveSearch;
exports.getMySearchHistory = getMySearchHistory;
exports.deleteSearch = deleteSearch;
exports.clearAllSearches = clearAllSearches;
exports.createSavedSearchController = createSavedSearchController;
exports.getSavedSearchesController = getSavedSearchesController;
exports.updateSavedSearchController = updateSavedSearchController;
exports.deleteSavedSearchController = deleteSavedSearchController;
exports.getRecentlyViewedController = getRecentlyViewedController;
exports.getRecommendationsController = getRecommendationsController;
exports.getDashboardSummaryController = getDashboardSummaryController;
const searchHistory_repository_1 = require("../repositories/searchHistory.repository");
const response_1 = require("../utils/response");
/** POST /api/v1/search-history — save or update a search */
async function saveSearch(req, res, next) {
    try {
        const { userId } = req.user;
        const { keyword, city, locality, latitude, longitude, propertyType, listingPurpose, bhk, minPrice, maxPrice, builder, possessionStatus, sortBy, resultsCount, filtersJson, device, browser, ipAddress } = req.body;
        const record = await (0, searchHistory_repository_1.upsertSearchHistory)(userId, {
            keyword,
            city,
            locality,
            latitude: latitude != null ? Number(latitude) : undefined,
            longitude: longitude != null ? Number(longitude) : undefined,
            propertyType,
            listingPurpose,
            bhk: bhk != null ? Number(bhk) : undefined,
            minPrice: minPrice != null ? Number(minPrice) : undefined,
            maxPrice: maxPrice != null ? Number(maxPrice) : undefined,
            builder,
            possessionStatus,
            sortBy,
            resultsCount: resultsCount != null ? Number(resultsCount) : 0,
            filtersJson,
            device,
            browser,
            ipAddress: ipAddress || req.ip
        });
        (0, response_1.sendCreated)(res, { search: record }, 'Search history saved');
    }
    catch (err) {
        next(err);
    }
}
/** GET /api/v1/search-history — get logged-in user's search history */
async function getMySearchHistory(req, res, next) {
    try {
        const { userId } = req.user;
        const page = parseInt(String(req.query.page ?? '1'), 10);
        const limit = parseInt(String(req.query.limit ?? '20'), 10);
        if (limit > 50) {
            (0, response_1.sendBadRequest)(res, 'Limit cannot exceed 50');
            return;
        }
        const result = await (0, searchHistory_repository_1.getSearchHistory)(userId, page, limit);
        (0, response_1.sendSuccess)(res, result, 'Search history retrieved');
    }
    catch (err) {
        next(err);
    }
}
/** DELETE /api/v1/search-history/:id — delete a specific search */
async function deleteSearch(req, res, next) {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const record = await (0, searchHistory_repository_1.findSearchById)(id);
        if (!record) {
            (0, response_1.sendNotFound)(res, 'Search record not found');
            return;
        }
        if (record.userId !== userId) {
            (0, response_1.sendForbidden)(res, 'Access denied');
            return;
        }
        await (0, searchHistory_repository_1.deleteSearchHistory)(id);
        (0, response_1.sendSuccess)(res, null, 'Search deleted');
    }
    catch (err) {
        next(err);
    }
}
/** DELETE /api/v1/search-history — clear all searches for logged-in user */
async function clearAllSearches(req, res, next) {
    try {
        const { userId } = req.user;
        await (0, searchHistory_repository_1.clearAllSearchHistory)(userId);
        (0, response_1.sendSuccess)(res, null, 'All search history cleared');
    }
    catch (err) {
        next(err);
    }
}
// --- Advanced Search Features ---
async function createSavedSearchController(req, res, next) {
    try {
        const { userId } = req.user;
        const { searchName, filtersJson, alertEnabled, notificationFrequency } = req.body;
        if (!searchName || !filtersJson) {
            (0, response_1.sendBadRequest)(res, 'searchName and filtersJson are required');
            return;
        }
        const record = await (0, searchHistory_repository_1.createSavedSearch)(userId, searchName, filtersJson, alertEnabled, notificationFrequency);
        (0, response_1.sendCreated)(res, { savedSearch: record }, 'Saved search created');
    }
    catch (err) {
        next(err);
    }
}
async function getSavedSearchesController(req, res, next) {
    try {
        const { userId } = req.user;
        const records = await (0, searchHistory_repository_1.getSavedSearches)(userId);
        (0, response_1.sendSuccess)(res, { savedSearches: records }, 'Saved searches retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function updateSavedSearchController(req, res, next) {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const { searchName, alertEnabled, notificationFrequency } = req.body;
        const record = await (0, searchHistory_repository_1.findSavedSearchById)(id);
        if (!record) {
            (0, response_1.sendNotFound)(res, 'Saved search not found');
            return;
        }
        if (record.userId !== userId) {
            (0, response_1.sendForbidden)(res, 'Access denied');
            return;
        }
        const updated = await (0, searchHistory_repository_1.updateSavedSearch)(id, { searchName, alertEnabled, notificationFrequency });
        (0, response_1.sendSuccess)(res, { savedSearch: updated }, 'Saved search updated');
    }
    catch (err) {
        next(err);
    }
}
async function deleteSavedSearchController(req, res, next) {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const record = await (0, searchHistory_repository_1.findSavedSearchById)(id);
        if (!record) {
            (0, response_1.sendNotFound)(res, 'Saved search not found');
            return;
        }
        if (record.userId !== userId) {
            (0, response_1.sendForbidden)(res, 'Access denied');
            return;
        }
        await (0, searchHistory_repository_1.deleteSavedSearch)(id);
        (0, response_1.sendSuccess)(res, null, 'Saved search deleted');
    }
    catch (err) {
        next(err);
    }
}
async function getRecentlyViewedController(req, res, next) {
    try {
        const { userId } = req.user;
        const records = await (0, searchHistory_repository_1.getRecentlyViewed)(userId);
        (0, response_1.sendSuccess)(res, { properties: records }, 'Recently viewed properties retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function getRecommendationsController(req, res, next) {
    try {
        const { userId } = req.user;
        const records = await (0, searchHistory_repository_1.getRecommendations)(userId);
        (0, response_1.sendSuccess)(res, { properties: records }, 'Recommendations retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function getDashboardSummaryController(req, res, next) {
    try {
        const { userId } = req.user;
        const summary = await (0, searchHistory_repository_1.getDashboardSummary)(userId);
        (0, response_1.sendSuccess)(res, { summary }, 'Dashboard summary retrieved');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=searchHistory.controller.js.map
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import {
  upsertSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
  clearAllSearchHistory,
  findSearchById,
  createSavedSearch,
  getSavedSearches,
  updateSavedSearch,
  deleteSavedSearch,
  findSavedSearchById,
  getRecentlyViewed,
  getRecommendations,
  getDashboardSummary
} from '../repositories/searchHistory.repository';
import { sendSuccess, sendCreated, sendNotFound, sendForbidden, sendBadRequest } from '../utils/response';

/** POST /api/v1/search-history — save or update a search */
export async function saveSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const {
      keyword,
      city,
      locality,
      latitude,
      longitude,
      propertyType,
      listingPurpose,
      bhk,
      minPrice,
      maxPrice,
      builder,
      possessionStatus,
      sortBy,
      resultsCount,
      filtersJson,
      device,
      browser,
      ipAddress
    } = req.body;

    const record = await upsertSearchHistory(userId, {
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

    sendCreated(res, { search: record }, 'Search history saved');
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/search-history — get logged-in user's search history */
export async function getMySearchHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '20'), 10);

    if (limit > 50) {
      sendBadRequest(res, 'Limit cannot exceed 50');
      return;
    }

    const result = await getSearchHistory(userId, page, limit);
    sendSuccess(res, result, 'Search history retrieved');
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/v1/search-history/:id — delete a specific search */
export async function deleteSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { id } = req.params;

    const record = await findSearchById(id!);
    if (!record) {
      sendNotFound(res, 'Search record not found');
      return;
    }
    if (record.userId !== userId) {
      sendForbidden(res, 'Access denied');
      return;
    }

    await deleteSearchHistory(id!);
    sendSuccess(res, null, 'Search deleted');
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/v1/search-history — clear all searches for logged-in user */
export async function clearAllSearches(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    await clearAllSearchHistory(userId);
    sendSuccess(res, null, 'All search history cleared');
  } catch (err) {
    next(err);
  }
}


// --- Advanced Search Features ---

export async function createSavedSearchController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { searchName, filtersJson, alertEnabled, notificationFrequency } = req.body;

    if (!searchName || !filtersJson) {
      sendBadRequest(res, 'searchName and filtersJson are required');
      return;
    }

    const record = await createSavedSearch(userId, searchName, filtersJson, alertEnabled, notificationFrequency);
    sendCreated(res, { savedSearch: record }, 'Saved search created');
  } catch (err) {
    next(err);
  }
}

export async function getSavedSearchesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const records = await getSavedSearches(userId);
    sendSuccess(res, { savedSearches: records }, 'Saved searches retrieved');
  } catch (err) {
    next(err);
  }
}

export async function updateSavedSearchController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    const { searchName, alertEnabled, notificationFrequency } = req.body;

    const record = await findSavedSearchById(id!);
    if (!record) {
      sendNotFound(res, 'Saved search not found');
      return;
    }
    if (record.userId !== userId) {
      sendForbidden(res, 'Access denied');
      return;
    }

    const updated = await updateSavedSearch(id!, { searchName, alertEnabled, notificationFrequency });
    sendSuccess(res, { savedSearch: updated }, 'Saved search updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteSavedSearchController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { id } = req.params;

    const record = await findSavedSearchById(id!);
    if (!record) {
      sendNotFound(res, 'Saved search not found');
      return;
    }
    if (record.userId !== userId) {
      sendForbidden(res, 'Access denied');
      return;
    }

    await deleteSavedSearch(id!);
    sendSuccess(res, null, 'Saved search deleted');
  } catch (err) {
    next(err);
  }
}

export async function getRecentlyViewedController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const records = await getRecentlyViewed(userId);
    sendSuccess(res, { properties: records }, 'Recently viewed properties retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getRecommendationsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const records = await getRecommendations(userId);
    sendSuccess(res, { properties: records }, 'Recommendations retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getDashboardSummaryController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const summary = await getDashboardSummary(userId);
    sendSuccess(res, { summary }, 'Dashboard summary retrieved');
  } catch (err) {
    next(err);
  }
}

import { Request, Response, NextFunction } from 'express';
/** POST /api/v1/search-history — save or update a search */
export declare function saveSearch(req: Request, res: Response, next: NextFunction): Promise<void>;
/** GET /api/v1/search-history — get logged-in user's search history */
export declare function getMySearchHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
/** DELETE /api/v1/search-history/:id — delete a specific search */
export declare function deleteSearch(req: Request, res: Response, next: NextFunction): Promise<void>;
/** DELETE /api/v1/search-history — clear all searches for logged-in user */
export declare function clearAllSearches(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function createSavedSearchController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getSavedSearchesController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateSavedSearchController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function deleteSavedSearchController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getRecentlyViewedController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getRecommendationsController(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getDashboardSummaryController(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=searchHistory.controller.d.ts.map
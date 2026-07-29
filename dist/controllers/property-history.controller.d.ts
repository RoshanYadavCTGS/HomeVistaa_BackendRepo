import { Request, Response } from 'express';
/**
 * POST /api/v1/property-history
 * Track whenever a user views a property's detail page.
 * Prevents duplicates by updating last viewed timestamp, moves entry to top,
 * and maintains a maximum limit of the latest 20 properties per user.
 */
export declare const trackPropertyView: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * GET /api/v1/property-history
 * Fetch the logged-in user's recently viewed properties in reverse chronological order.
 * Deduplicates properties and excludes deleted/unavailable properties.
 */
export declare const getRecentViews: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=property-history.controller.d.ts.map
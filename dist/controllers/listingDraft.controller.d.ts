import { Request, Response, NextFunction } from 'express';
/** GET /api/v1/listings/draft — fetch active user draft */
export declare function getActiveDraft(req: Request, res: Response, next: NextFunction): Promise<void>;
/** POST /api/v1/listings/draft — save step progress in draft */
export declare function saveDraftStep(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function publishDraft(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=listingDraft.controller.d.ts.map
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as draftRepo from '../repositories/listingDraft.repository';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response';

/** GET /api/v1/listings/draft — fetch active user draft */
export async function getActiveDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const draft = await draftRepo.findDraftByUser(userId);
    if (!draft) {
      sendSuccess(res, null, 'No active listing draft found');
      return;
    }
    sendSuccess(res, { draft }, 'Active listing draft retrieved');
  } catch (err) {
    next(err);
  }
}

/** POST /api/v1/listings/draft — save step progress in draft */
export async function saveDraftStep(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const draft = await draftRepo.upsertDraft(userId, req.body);
    sendCreated(res, { draft }, 'Listing draft progress saved');
  } catch (err) {
    next(err);
  }
}
export async function publishDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const listing = await draftRepo.publishDraft(userId);
    sendCreated(res, { listing }, 'Listing published successfully');
  } catch (err) {
    next(err);
  }
}

import { Request, Response, NextFunction } from 'express';
import * as favoriteRepo from '../repositories/favorite.repository';
import { sendSuccess, sendNotFound } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export async function getFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const propertyIds = await favoriteRepo.getFavoriteIds(userId);
    sendSuccess(res, { propertyIds }, 'Favorites retrieved');
  } catch (err) {
    next(err);
  }
}

export async function addFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { propertyId } = req.params;
    await favoriteRepo.addFavorite(userId, propertyId!);
    sendSuccess(res, { propertyId }, 'Added to favorites');
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { propertyId } = req.params;
    const result = await favoriteRepo.removeFavorite(userId, propertyId!);

    if (result.count === 0) {
      sendNotFound(res, 'Favorite not found');
      return;
    }

    sendSuccess(res, { propertyId }, 'Removed from favorites');
  } catch (err) {
    next(err);
  }
}

export async function checkFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { propertyId } = req.params;
    const isFavorited = await favoriteRepo.isFavorited(userId, propertyId!);
    sendSuccess(res, { isFavorited }, 'Favorite status checked');
  } catch (err) {
    next(err);
  }
}

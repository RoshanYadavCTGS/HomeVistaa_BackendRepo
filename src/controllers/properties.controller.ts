import { Request, Response, NextFunction } from 'express';
import * as propertyRepo from '../repositories/property.repository';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response';
import { PropertyFiltersInput } from '../validators/property.validator';

export async function getProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters = req.query as unknown as PropertyFiltersInput;
    const { properties, meta } = await propertyRepo.findProperties(filters);
    sendSuccess(res, { properties }, 'Properties retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
}

export async function getPropertyById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const property = await propertyRepo.findPropertyById(req.params.id!);
    if (!property) {
      sendNotFound(res, 'Property not found');
      return;
    }
    sendSuccess(res, { property }, 'Property retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(String(req.query.limit ?? '6'), 10);
    const properties = await propertyRepo.getFeaturedProperties(limit);
    sendSuccess(res, { properties }, 'Featured properties retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const property = await propertyRepo.createProperty(req.body);
    sendCreated(res, { property }, 'Property created');
  } catch (err) {
    next(err);
  }
}

export async function deleteProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await propertyRepo.deleteProperty(req.params.id!);
    sendSuccess(res, null, 'Property deleted');
  } catch (err) {
    next(err);
  }
}

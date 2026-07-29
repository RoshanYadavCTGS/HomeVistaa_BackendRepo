import { Request, Response, NextFunction } from 'express';
import * as blogRepo from '../repositories/blog.repository';
import { sendSuccess, sendNotFound } from '../utils/response';

export async function getInteriors(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const roomType = req.query.roomType as string | undefined;
    const designs = await blogRepo.findInteriors(roomType);
    sendSuccess(res, { designs }, 'Interior designs retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getInteriorById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const design = await blogRepo.findInteriorById(req.params.id!);
    if (!design) {
      sendNotFound(res, 'Interior design not found');
      return;
    }
    sendSuccess(res, { design }, 'Interior design retrieved');
  } catch (err) {
    next(err);
  }
}

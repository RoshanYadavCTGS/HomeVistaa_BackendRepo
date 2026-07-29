import { Request, Response, NextFunction } from 'express';
import * as alertRepo from '../repositories/alert.repository';
import { sendSuccess, sendCreated, sendNotFound, sendForbidden } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export async function getAlerts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const alerts = await alertRepo.getAlertsByUser(userId);
    sendSuccess(res, { alerts }, 'Alerts retrieved');
  } catch (err) {
    next(err);
  }
}

export async function createAlert(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const alert = await alertRepo.createAlert(userId, req.body);
    sendCreated(res, { alert }, 'Alert created');
  } catch (err) {
    next(err);
  }
}

export async function deleteAlert(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const alert = await alertRepo.getAlertById(req.params.id!);

    if (!alert) {
      sendNotFound(res, 'Alert not found');
      return;
    }

    if (alert.userId !== userId && role !== 'admin') {
      sendForbidden(res, 'You can only delete your own alerts');
      return;
    }

    await alertRepo.deleteAlert(req.params.id!, userId);
    sendSuccess(res, null, 'Alert deleted');
  } catch (err) {
    next(err);
  }
}

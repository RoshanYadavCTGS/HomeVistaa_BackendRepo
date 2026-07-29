import { Request, Response, NextFunction } from 'express';
import * as couponRepo from '../repositories/coupon.repository';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export async function getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const dashboard = await couponRepo.getCouponDashboard(userId);
    sendSuccess(res, dashboard, 'Coupon dashboard retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function getMyCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const coupons = await couponRepo.getCouponsByUserId(userId);
    sendSuccess(res, { coupons }, 'Coupons retrieved successfully');
  } catch (err) {
    next(err);
  }
}

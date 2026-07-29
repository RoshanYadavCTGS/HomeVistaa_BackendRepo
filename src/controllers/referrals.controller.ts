import { Request, Response, NextFunction } from 'express';
import * as referralRepo from '../repositories/referral.repository';
import { sendSuccess, sendBadRequest } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export async function getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const dashboard = await referralRepo.getReferralDashboard(userId);
    sendSuccess(res, dashboard, 'Referral dashboard retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const history = await referralRepo.getReferralHistory(userId);
    sendSuccess(res, { history }, 'Referral history retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function getRewards(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const rewards = await referralRepo.getRewardHistory(userId);
    sendSuccess(res, { rewards }, 'Reward history retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function getWalletTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const transactions = await referralRepo.getWalletTransactions(userId);
    sendSuccess(res, { transactions }, 'Wallet transactions retrieved successfully');
  } catch (err) {
    next(err);
  }
}

export async function redeemRewards(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      sendBadRequest(res, 'Valid amount is required for redemption');
      return;
    }

    const result = await referralRepo.redeemRewards(userId, amount);
    sendSuccess(res, {
      wallet: {
        totalEarnings: Number(result.wallet.totalEarnings),
        availableBalance: Number(result.wallet.availableBalance),
        pendingBalance: Number(result.wallet.pendingBalance),
        redeemedBalance: Number(result.wallet.redeemedBalance)
      },
      transaction: { ...result.transaction, amount: Number(result.transaction.amount) }
    }, 'Rewards redeemed successfully');
  } catch (err: any) {
    sendBadRequest(res, err.message || 'Failed to redeem rewards');
  }
}

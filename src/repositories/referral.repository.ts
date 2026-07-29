import prisma from '../config/database';
import { Referral, Reward, Wallet, WalletTransaction, ReferralAnalytics } from '@prisma/client';

export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.referralCode) {
    return user.referralCode;
  }
  // Generate a random 6-character code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  await prisma.user.update({
    where: { id: userId },
    data: { referralCode: code }
  });
  return code;
}

export async function getReferralDashboard(userId: string) {
  const referralCode = await getOrCreateReferralCode(userId);
  
  // Create wallet if it doesn't exist
  let wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId }
    });
  }

  // Get Analytics
  let analytics = await prisma.referralAnalytics.findUnique({ where: { userId } });
  if (!analytics) {
    analytics = await prisma.referralAnalytics.create({
      data: { userId }
    });
  }

  const referrals = await prisma.referral.findMany({ where: { referrerId: userId } });
  const successfulReferrals = referrals.filter(r => r.rewardStatus === 'credited').length;
  const pendingReferrals = referrals.filter(r => r.rewardStatus === 'pending').length;

  return {
    referralCode,
    referralLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register?ref=${referralCode}`,
    wallet: {
      totalEarnings: Number(wallet.totalEarnings),
      availableBalance: Number(wallet.availableBalance),
      pendingBalance: Number(wallet.pendingBalance),
      redeemedBalance: Number(wallet.redeemedBalance)
    },
    analytics: {
      totalReferrals: referrals.length,
      successfulReferrals,
      pendingReferrals,
      linkClicks: analytics.linkClicks,
      propertyViews: analytics.propertyViews
    }
  };
}

export async function getReferralHistory(userId: string) {
  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
    orderBy: { createdAt: 'desc' }
  });
  
  return referrals.map(r => ({
    ...r,
    rewardAmount: r.rewardAmount ? Number(r.rewardAmount) : null
  }));
}

export async function getRewardHistory(userId: string) {
  const rewards = await prisma.reward.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return rewards.map(r => ({
    ...r,
    rewardAmount: Number(r.rewardAmount)
  }));
}

export async function getWalletTransactions(userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) return [];

  const transactions = await prisma.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: 'desc' }
  });

  return transactions.map(t => ({
    ...t,
    amount: Number(t.amount)
  }));
}

export async function redeemRewards(userId: string, amount: number) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error('Wallet not found');

  if (Number(wallet.availableBalance) < amount) {
    throw new Error('Insufficient available balance');
  }

  // Deduct from available, add to redeemed
  const updatedWallet = await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      availableBalance: { decrement: amount },
      redeemedBalance: { increment: amount }
    }
  });

  const transaction = await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      amount: amount,
      transactionType: 'debit',
      description: 'Reward Redemption'
    }
  });

  return { wallet: updatedWallet, transaction };
}

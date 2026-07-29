"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateReferralCode = getOrCreateReferralCode;
exports.getReferralDashboard = getReferralDashboard;
exports.getReferralHistory = getReferralHistory;
exports.getRewardHistory = getRewardHistory;
exports.getWalletTransactions = getWalletTransactions;
exports.redeemRewards = redeemRewards;
const database_1 = __importDefault(require("../config/database"));
async function getOrCreateReferralCode(userId) {
    const user = await database_1.default.user.findUnique({ where: { id: userId } });
    if (user?.referralCode) {
        return user.referralCode;
    }
    // Generate a random 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await database_1.default.user.update({
        where: { id: userId },
        data: { referralCode: code }
    });
    return code;
}
async function getReferralDashboard(userId) {
    const referralCode = await getOrCreateReferralCode(userId);
    // Create wallet if it doesn't exist
    let wallet = await database_1.default.wallet.findUnique({ where: { userId } });
    if (!wallet) {
        wallet = await database_1.default.wallet.create({
            data: { userId }
        });
    }
    // Get Analytics
    let analytics = await database_1.default.referralAnalytics.findUnique({ where: { userId } });
    if (!analytics) {
        analytics = await database_1.default.referralAnalytics.create({
            data: { userId }
        });
    }
    const referrals = await database_1.default.referral.findMany({ where: { referrerId: userId } });
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
async function getReferralHistory(userId) {
    const referrals = await database_1.default.referral.findMany({
        where: { referrerId: userId },
        orderBy: { createdAt: 'desc' }
    });
    return referrals.map(r => ({
        ...r,
        rewardAmount: r.rewardAmount ? Number(r.rewardAmount) : null
    }));
}
async function getRewardHistory(userId) {
    const rewards = await database_1.default.reward.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
    return rewards.map(r => ({
        ...r,
        rewardAmount: Number(r.rewardAmount)
    }));
}
async function getWalletTransactions(userId) {
    const wallet = await database_1.default.wallet.findUnique({ where: { userId } });
    if (!wallet)
        return [];
    const transactions = await database_1.default.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' }
    });
    return transactions.map(t => ({
        ...t,
        amount: Number(t.amount)
    }));
}
async function redeemRewards(userId, amount) {
    const wallet = await database_1.default.wallet.findUnique({ where: { userId } });
    if (!wallet)
        throw new Error('Wallet not found');
    if (Number(wallet.availableBalance) < amount) {
        throw new Error('Insufficient available balance');
    }
    // Deduct from available, add to redeemed
    const updatedWallet = await database_1.default.wallet.update({
        where: { id: wallet.id },
        data: {
            availableBalance: { decrement: amount },
            redeemedBalance: { increment: amount }
        }
    });
    const transaction = await database_1.default.walletTransaction.create({
        data: {
            walletId: wallet.id,
            amount: amount,
            transactionType: 'debit',
            description: 'Reward Redemption'
        }
    });
    return { wallet: updatedWallet, transaction };
}
//# sourceMappingURL=referral.repository.js.map
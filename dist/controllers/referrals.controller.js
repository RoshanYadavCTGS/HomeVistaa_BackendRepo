"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = getDashboard;
exports.getHistory = getHistory;
exports.getRewards = getRewards;
exports.getWalletTransactions = getWalletTransactions;
exports.redeemRewards = redeemRewards;
const referralRepo = __importStar(require("../repositories/referral.repository"));
const response_1 = require("../utils/response");
async function getDashboard(req, res, next) {
    try {
        const { userId } = req.user;
        const dashboard = await referralRepo.getReferralDashboard(userId);
        (0, response_1.sendSuccess)(res, dashboard, 'Referral dashboard retrieved successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getHistory(req, res, next) {
    try {
        const { userId } = req.user;
        const history = await referralRepo.getReferralHistory(userId);
        (0, response_1.sendSuccess)(res, { history }, 'Referral history retrieved successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getRewards(req, res, next) {
    try {
        const { userId } = req.user;
        const rewards = await referralRepo.getRewardHistory(userId);
        (0, response_1.sendSuccess)(res, { rewards }, 'Reward history retrieved successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getWalletTransactions(req, res, next) {
    try {
        const { userId } = req.user;
        const transactions = await referralRepo.getWalletTransactions(userId);
        (0, response_1.sendSuccess)(res, { transactions }, 'Wallet transactions retrieved successfully');
    }
    catch (err) {
        next(err);
    }
}
async function redeemRewards(req, res, next) {
    try {
        const { userId } = req.user;
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            (0, response_1.sendBadRequest)(res, 'Valid amount is required for redemption');
            return;
        }
        const result = await referralRepo.redeemRewards(userId, amount);
        (0, response_1.sendSuccess)(res, {
            wallet: {
                totalEarnings: Number(result.wallet.totalEarnings),
                availableBalance: Number(result.wallet.availableBalance),
                pendingBalance: Number(result.wallet.pendingBalance),
                redeemedBalance: Number(result.wallet.redeemedBalance)
            },
            transaction: { ...result.transaction, amount: Number(result.transaction.amount) }
        }, 'Rewards redeemed successfully');
    }
    catch (err) {
        (0, response_1.sendBadRequest)(res, err.message || 'Failed to redeem rewards');
    }
}
//# sourceMappingURL=referrals.controller.js.map
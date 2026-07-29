export declare function getOrCreateReferralCode(userId: string): Promise<string>;
export declare function getReferralDashboard(userId: string): Promise<{
    referralCode: string;
    referralLink: string;
    wallet: {
        totalEarnings: number;
        availableBalance: number;
        pendingBalance: number;
        redeemedBalance: number;
    };
    analytics: {
        totalReferrals: number;
        successfulReferrals: number;
        pendingReferrals: number;
        linkClicks: number;
        propertyViews: number;
    };
}>;
export declare function getReferralHistory(userId: string): Promise<{
    rewardAmount: number | null;
    id: string;
    referralCode: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    registrationDate: Date | null;
    bookingStatus: string | null;
    referredEmail: string;
    referredPhone: string | null;
    referralLink: string | null;
    rewardStatus: string;
    referredUserId: string | null;
    referrerId: string;
}[]>;
export declare function getRewardHistory(userId: string): Promise<{
    rewardAmount: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: string;
    expiryDate: Date | null;
    rewardType: string;
    transactionId: string | null;
    creditedDate: Date | null;
    redeemedDate: Date | null;
}[]>;
export declare function getWalletTransactions(userId: string): Promise<{
    amount: number;
    id: string;
    createdAt: Date;
    description: string;
    transactionType: string;
    referenceId: string | null;
    walletId: string;
}[]>;
export declare function redeemRewards(userId: string, amount: number): Promise<{
    wallet: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalEarnings: bigint;
        availableBalance: bigint;
        pendingBalance: bigint;
        redeemedBalance: bigint;
    };
    transaction: {
        id: string;
        createdAt: Date;
        description: string;
        transactionType: string;
        referenceId: string | null;
        amount: bigint;
        walletId: string;
    };
}>;
//# sourceMappingURL=referral.repository.d.ts.map
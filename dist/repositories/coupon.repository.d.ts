import { Coupon } from '@prisma/client';
export declare function getCouponDashboard(userId: string): Promise<{
    stats: {
        active: number;
        used: number;
        expired: number;
    };
    coupons: {
        discountAmount: number;
        id: string;
        createdAt: Date;
        userId: string;
        status: string;
        code: string;
        discountType: string;
        validUntil: Date;
    }[];
}>;
export declare function getCouponsByUserId(userId: string): Promise<Coupon[]>;
//# sourceMappingURL=coupon.repository.d.ts.map
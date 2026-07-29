"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCouponDashboard = getCouponDashboard;
exports.getCouponsByUserId = getCouponsByUserId;
const database_1 = __importDefault(require("../config/database"));
async function getCouponDashboard(userId) {
    const coupons = await database_1.default.coupon.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
    const stats = {
        active: coupons.filter(c => c.status === 'active').length,
        used: coupons.filter(c => c.status === 'used').length,
        expired: coupons.filter(c => c.status === 'expired').length,
    };
    const formattedCoupons = coupons.map(c => ({
        ...c,
        discountAmount: Number(c.discountAmount)
    }));
    return { stats, coupons: formattedCoupons };
}
async function getCouponsByUserId(userId) {
    return database_1.default.coupon.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
//# sourceMappingURL=coupon.repository.js.map
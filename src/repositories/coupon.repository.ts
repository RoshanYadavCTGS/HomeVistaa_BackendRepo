import prisma from '../config/database';
import { Coupon } from '@prisma/client';

export async function getCouponDashboard(userId: string) {
  const coupons = await prisma.coupon.findMany({
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

export async function getCouponsByUserId(userId: string): Promise<Coupon[]> {
  return prisma.coupon.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

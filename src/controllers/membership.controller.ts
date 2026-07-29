import { Request, Response } from 'express';
import prisma from '../config/database';

export const getCurrentMembership = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const membership = await prisma.membership.findUnique({
      where: { userId },
    });

    res.json({ success: true, membership });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const purchaseMembership = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { planName, planPrice, planType } = req.body;

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry

    // Upsert membership (update if exists, create if not)
    const membership = await prisma.membership.upsert({
      where: { userId },
      update: {
        planName,
        planPrice,
        planType,
        purchaseDate: new Date(),
        expiryDate,
        status: 'active',
      },
      create: {
        userId,
        planName,
        planPrice,
        planType,
        expiryDate,
        status: 'active',
      },
    });

    // Log Activity
    await prisma.userActivity.create({
      data: {
        userId,
        activityType: 'MEMBERSHIP_PURCHASED',
        referenceId: membership.id,
        description: `Purchased ${planName} membership.`,
      },
    });

    res.json({ success: true, membership, message: 'Membership purchased successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

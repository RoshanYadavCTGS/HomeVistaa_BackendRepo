import { Request, Response } from 'express';
import prisma from '../config/database';

export const getUserActivity = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const activity = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to recent 100 activities
    });

    res.json({ success: true, activity });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import prisma from '../config/database';
import { logger } from '../utils/logger';

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: string; // e.g., 'property_approved', 'property_rejected', 'new_lead', 'site_visit_scheduled', 'loan_status', 'service_request_updated', 'coupon_available', 'referral_reward', 'password_changed'
  metadata?: Record<string, any>;
}

export async function createNotification(input: CreateNotificationInput): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type,
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : null,
        isRead: false,
      },
    });
    logger.info(`[Notification] Sent '${input.type}' to user ${input.userId}: ${input.title}`);
  } catch (error) {
    logger.error('Failed to create system notification:', error);
  }
}

export async function getUnreadNotifications(userId: string, limit = 50) {
  return prisma.notification.findMany({
    where: { userId, isRead: false },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getAllNotifications(userId: string, limit = 50) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function markAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}

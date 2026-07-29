import { Request } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export interface RecordActivityInput {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
  req?: Request;
  ipAddress?: string;
  browser?: string;
  device?: string;
}

/**
 * Parses User-Agent string for Browser and Device identification
 */
export function parseUserAgent(ua?: string): { browser: string; device: string } {
  if (!ua) return { browser: 'Unknown Browser', device: 'Unknown Device' };
  
  let browser = 'Chrome / Safari';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  let device = 'Desktop';
  if (ua.includes('Mobi') || ua.includes('Android') || ua.includes('iPhone')) {
    device = 'Mobile';
  } else if (ua.includes('Tablet') || ua.includes('iPad')) {
    device = 'Tablet';
  }

  return { browser, device };
}

/**
 * Centralized activity log creation tracking user, action, IP, browser, and device
 */
export async function logActivity(input: RecordActivityInput): Promise<void> {
  try {
    let ipAddress = input.ipAddress;
    let browser = input.browser;
    let device = input.device;

    if (input.req && (!ipAddress || !browser || !device)) {
      const forwarded = input.req.headers['x-forwarded-for'];
      ipAddress = ipAddress || (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]) || input.req.ip || input.req.socket.remoteAddress || '127.0.0.1';
      const ua = input.req.headers['user-agent'];
      const parsed = parseUserAgent(ua);
      browser = browser || parsed.browser;
      device = device || parsed.device;
    }

    await prisma.activityLog.create({
      data: {
        userId: input.userId || null,
        action: input.action,
        entityType: input.entityType || null,
        entityId: input.entityId || null,
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : null,
        ipAddress: ipAddress || '127.0.0.1',
        browser: browser || 'Unknown Browser',
        device: device || 'Unknown Device',
      },
    });
  } catch (error) {
    logger.error('Failed to write activity log:', error);
  }
}

export async function getActivityLogs(limit = 100, userId?: string, action?: string) {
  const where: Record<string, any> = {};
  if (userId) where.userId = userId;
  if (action) where.action = action;

  return prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: { name: true, email: true, role: true, avatarUrl: true },
      },
    },
  });
}

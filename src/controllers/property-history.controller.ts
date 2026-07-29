import { Request, Response } from 'express';
import prisma from '../config/database';

/**
 * POST /api/v1/property-history
 * Track whenever a user views a property's detail page.
 * Prevents duplicates by updating last viewed timestamp, moves entry to top,
 * and maintains a maximum limit of the latest 20 properties per user.
 */
export const trackPropertyView = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { propertyId, visitedAt } = req.body;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'propertyId is required' });
    }

    // Verify property exists and is available in database to prevent foreign key exception
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true }
    });

    if (!property) {
      // Handle unavailable or missing property gracefully without breaking UI
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found or unavailable in DB' 
      });
    }

    // Extract device/browser details
    const ipAddress = req.ip || req.socket.remoteAddress || undefined;
    const userAgent = req.headers['user-agent'] || undefined;
    const viewTimestamp = visitedAt ? new Date(visitedAt) : new Date();

    // Prevent Duplicates: check if user already viewed this property
    const existingEntry = await prisma.propertyBrowsingHistory.findFirst({
      where: { userId, propertyId },
      select: { id: true }
    });

    if (existingEntry) {
      // Update existing record's timestamp to move it to top of recent views
      await prisma.propertyBrowsingHistory.update({
        where: { id: existingEntry.id },
        data: {
          visitedAt: viewTimestamp,
          ipAddress,
          browser: userAgent,
        },
      });
    } else {
      // Create new browsing history entry
      await prisma.propertyBrowsingHistory.create({
        data: {
          userId,
          propertyId,
          visitedAt: viewTimestamp,
          ipAddress,
          browser: userAgent,
        },
      });
    }

    // Enforce maximum limit: keep only latest 20 recently viewed properties per user
    const allViews = await prisma.propertyBrowsingHistory.findMany({
      where: { userId },
      orderBy: { visitedAt: 'desc' },
      select: { id: true }
    });

    if (allViews.length > 20) {
      const oldestIds = allViews.slice(20).map((v) => v.id);
      await prisma.propertyBrowsingHistory.deleteMany({
        where: { id: { in: oldestIds } },
      });
    }

    // Log user activity asynchronously without causing failures
    try {
      await prisma.userActivity.create({
        data: {
          userId,
          activityType: 'PROPERTY_VIEWED',
          referenceId: propertyId,
          description: 'Viewed property details.',
        },
      });
    } catch (actError) {
      // Non-critical: ignore activity log failure
    }

    return res.json({ success: true, message: 'Property view tracked successfully' });
  } catch (error: any) {
    // Return gracefully so saving failures never interrupt property details page
    return res.status(500).json({ success: false, message: error?.message || 'Error tracking property view' });
  }
};

/**
 * GET /api/v1/property-history
 * Fetch the logged-in user's recently viewed properties in reverse chronological order.
 * Deduplicates properties and excludes deleted/unavailable properties.
 */
export const getRecentViews = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Fetch recent history items with property details
    const history = await prisma.propertyBrowsingHistory.findMany({
      where: { userId },
      orderBy: { visitedAt: 'desc' },
      take: 50,
      include: {
        property: {
          include: {
            builder: true,
            images: { where: { isPrimary: true }, take: 1 },
          }
        }
      },
    });

    const seenPropertyIds = new Set<string>();
    const recentViews: any[] = [];

    for (const item of history) {
      // Skip missing, deleted, or unavailable properties
      if (!item.property) continue;

      // Ensure no duplicates in the final output
      if (seenPropertyIds.has(item.property.id)) continue;
      seenPropertyIds.add(item.property.id);

      recentViews.push({
        id: item.id,
        visitedAt: item.visitedAt,
        property: {
          id: item.property.id,
          title: item.property.title,
          type: item.property.type,
          city: item.property.city,
          locality: item.property.locality,
          location: item.property.location,
          price: Number(item.property.price),
          priceFormatted: item.property.priceFormatted,
          bhk: item.property.beds,
          builderName: item.property.builder?.name || 'HomeVistaa Partner',
          image: item.property.images[0]?.url || ''
        }
      });

      if (recentViews.length >= 20) break;
    }

    return res.json({ success: true, recentViews, properties: recentViews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Failed to fetch recent views' });
  }
};

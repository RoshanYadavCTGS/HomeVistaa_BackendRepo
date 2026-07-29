"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentViews = exports.trackPropertyView = void 0;
const database_1 = __importDefault(require("../config/database"));
/**
 * POST /api/v1/property-history
 * Track whenever a user views a property's detail page.
 * Prevents duplicates by updating last viewed timestamp, moves entry to top,
 * and maintains a maximum limit of the latest 20 properties per user.
 */
const trackPropertyView = async (req, res) => {
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
        const property = await database_1.default.property.findUnique({
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
        const existingEntry = await database_1.default.propertyBrowsingHistory.findFirst({
            where: { userId, propertyId },
            select: { id: true }
        });
        if (existingEntry) {
            // Update existing record's timestamp to move it to top of recent views
            await database_1.default.propertyBrowsingHistory.update({
                where: { id: existingEntry.id },
                data: {
                    visitedAt: viewTimestamp,
                    ipAddress,
                    browser: userAgent,
                },
            });
        }
        else {
            // Create new browsing history entry
            await database_1.default.propertyBrowsingHistory.create({
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
        const allViews = await database_1.default.propertyBrowsingHistory.findMany({
            where: { userId },
            orderBy: { visitedAt: 'desc' },
            select: { id: true }
        });
        if (allViews.length > 20) {
            const oldestIds = allViews.slice(20).map((v) => v.id);
            await database_1.default.propertyBrowsingHistory.deleteMany({
                where: { id: { in: oldestIds } },
            });
        }
        // Log user activity asynchronously without causing failures
        try {
            await database_1.default.userActivity.create({
                data: {
                    userId,
                    activityType: 'PROPERTY_VIEWED',
                    referenceId: propertyId,
                    description: 'Viewed property details.',
                },
            });
        }
        catch (actError) {
            // Non-critical: ignore activity log failure
        }
        return res.json({ success: true, message: 'Property view tracked successfully' });
    }
    catch (error) {
        // Return gracefully so saving failures never interrupt property details page
        return res.status(500).json({ success: false, message: error?.message || 'Error tracking property view' });
    }
};
exports.trackPropertyView = trackPropertyView;
/**
 * GET /api/v1/property-history
 * Fetch the logged-in user's recently viewed properties in reverse chronological order.
 * Deduplicates properties and excludes deleted/unavailable properties.
 */
const getRecentViews = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        // Fetch recent history items with property details
        const history = await database_1.default.propertyBrowsingHistory.findMany({
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
        const seenPropertyIds = new Set();
        const recentViews = [];
        for (const item of history) {
            // Skip missing, deleted, or unavailable properties
            if (!item.property)
                continue;
            // Ensure no duplicates in the final output
            if (seenPropertyIds.has(item.property.id))
                continue;
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
            if (recentViews.length >= 20)
                break;
        }
        return res.json({ success: true, recentViews, properties: recentViews });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error?.message || 'Failed to fetch recent views' });
    }
};
exports.getRecentViews = getRecentViews;
//# sourceMappingURL=property-history.controller.js.map
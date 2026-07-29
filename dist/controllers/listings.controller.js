"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListing = createListing;
exports.getMyListings = getMyListings;
exports.getListingById = getListingById;
exports.updateListing = updateListing;
exports.deleteListing = deleteListing;
exports.updateMyListingStatus = updateMyListingStatus;
exports.getAllListings = getAllListings;
exports.updateListingStatus = updateListingStatus;
const listingRepo = __importStar(require("../repositories/listing.repository"));
const activityLogService = __importStar(require("../services/activityLog.service"));
const notificationService = __importStar(require("../services/notification.service"));
const response_1 = require("../utils/response");
const email_service_1 = require("../services/email.service");
const userRepo = __importStar(require("../repositories/user.repository"));
async function createListing(req, res, next) {
    try {
        const { userId, email } = req.user;
        const listing = await listingRepo.createListing(userId, req.body);
        const user = await userRepo.findUserById(userId);
        if (user) {
            (0, email_service_1.sendListingSubmissionEmail)(user.name, email, listing.title).catch(() => { });
        }
        await activityLogService.logActivity({
            userId,
            action: 'PROPERTY_CREATED',
            entityType: 'listing',
            entityId: listing.id,
            metadata: { title: listing.title, type: listing.type },
            req,
        });
        await notificationService.createNotification({
            userId,
            title: 'Property Listing Submitted',
            message: `Your property "${listing.title}" has been submitted for admin review before publishing.`,
            type: 'property_submitted',
            metadata: { listingId: listing.id },
        });
        (0, response_1.sendCreated)(res, { listing }, 'Property listing submitted for review');
    }
    catch (err) {
        next(err);
    }
}
async function getMyListings(req, res, next) {
    try {
        const { userId } = req.user;
        const page = parseInt(String(req.query.page ?? '1'), 10);
        const limit = parseInt(String(req.query.limit ?? '20'), 10);
        const filters = {
            search: req.query.search,
            status: req.query.status,
            type: req.query.type,
            listingType: req.query.listingType,
            city: req.query.city,
            sort: req.query.sort,
        };
        const { listings, meta } = await listingRepo.findListingsByUser(userId, page, limit, filters);
        (0, response_1.sendSuccess)(res, { listings }, 'Listings retrieved', 200, meta);
    }
    catch (err) {
        next(err);
    }
}
async function getListingById(req, res, next) {
    try {
        const listing = await listingRepo.findListingById(req.params.id);
        if (!listing) {
            (0, response_1.sendNotFound)(res, 'Listing not found');
            return;
        }
        (0, response_1.sendSuccess)(res, { listing }, 'Listing retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function updateListing(req, res, next) {
    try {
        const { userId, role } = req.user;
        const listing = await listingRepo.findListingById(req.params.id);
        if (!listing) {
            (0, response_1.sendNotFound)(res, 'Listing not found');
            return;
        }
        const isAuthorizedAdmin = ['admin', 'super_admin', 'ADMIN', 'SUPER_ADMIN'].includes(String(role));
        if (listing.userId !== userId && !isAuthorizedAdmin) {
            (0, response_1.sendForbidden)(res, 'You can only update your own listings');
            return;
        }
        const updated = await listingRepo.updateListing(req.params.id, req.body);
        await activityLogService.logActivity({
            userId,
            action: 'PROPERTY_UPDATED',
            entityType: 'listing',
            entityId: listing.id,
            metadata: { fields: Object.keys(req.body) },
            req,
        });
        (0, response_1.sendSuccess)(res, { listing: updated }, 'Listing updated');
    }
    catch (err) {
        next(err);
    }
}
async function deleteListing(req, res, next) {
    try {
        const { userId, role } = req.user;
        const listing = await listingRepo.findListingById(req.params.id);
        if (!listing) {
            (0, response_1.sendNotFound)(res, 'Listing not found');
            return;
        }
        const isAuthorizedAdmin = ['admin', 'super_admin', 'ADMIN', 'SUPER_ADMIN'].includes(String(role));
        if (listing.userId !== userId && !isAuthorizedAdmin) {
            (0, response_1.sendForbidden)(res, 'You can only delete your own listings');
            return;
        }
        await listingRepo.deleteListing(req.params.id);
        await activityLogService.logActivity({
            userId,
            action: 'PROPERTY_DELETED',
            entityType: 'listing',
            entityId: listing.id,
            req,
        });
        (0, response_1.sendSuccess)(res, null, 'Listing deleted');
    }
    catch (err) {
        next(err);
    }
}
async function updateMyListingStatus(req, res, next) {
    try {
        const { userId } = req.user;
        const { status } = req.body;
        const listing = await listingRepo.findListingById(req.params.id);
        if (!listing) {
            (0, response_1.sendNotFound)(res, 'Listing not found');
            return;
        }
        if (listing.userId !== userId) {
            (0, response_1.sendForbidden)(res, 'You can only update your own listings');
            return;
        }
        const allowedStatuses = ['paused', 'sold', 'rented', 'expired', 'approved', 'submit_for_approval', 'draft'];
        if (!allowedStatuses.includes(status)) {
            (0, response_1.sendForbidden)(res, 'Invalid status update requested');
            return;
        }
        await listingRepo.updateListingStatus(req.params.id, status);
        await activityLogService.logActivity({
            userId,
            action: 'PROPERTY_STATUS_UPDATE',
            entityType: 'listing',
            entityId: listing.id,
            metadata: { status },
            req,
        });
        (0, response_1.sendSuccess)(res, null, `Listing status updated to ${status}`);
    }
    catch (err) {
        next(err);
    }
}
// Admin controllers
async function getAllListings(req, res, next) {
    try {
        const page = parseInt(String(req.query.page ?? '1'), 10);
        const limit = parseInt(String(req.query.limit ?? '20'), 10);
        const status = req.query.status;
        const { listings, meta } = await listingRepo.findAllListings(page, limit, status);
        (0, response_1.sendSuccess)(res, { listings }, 'All listings retrieved', 200, meta);
    }
    catch (err) {
        next(err);
    }
}
async function updateListingStatus(req, res, next) {
    try {
        const { status, adminNote } = req.body;
        const adminId = req.user?.userId;
        await listingRepo.updateListingStatus(req.params.id, status, adminNote);
        const listing = await listingRepo.findListingById(req.params.id);
        if (listing) {
            await activityLogService.logActivity({
                userId: adminId,
                action: status === 'approved' ? 'PROPERTY_APPROVED' : status === 'rejected' ? 'PROPERTY_REJECTED' : 'PROPERTY_STATUS_UPDATE',
                entityType: 'listing',
                entityId: listing.id,
                metadata: { status, adminNote, title: listing.title },
                req,
            });
            await notificationService.createNotification({
                userId: listing.userId,
                title: status === 'approved' ? 'Property Approved & Live!' : status === 'rejected' ? 'Property Modification Required' : `Property Status: ${status.toUpperCase()}`,
                message: status === 'approved'
                    ? `Congratulations! Your listing "${listing.title}" has passed review and is now live.`
                    : status === 'rejected'
                        ? `Your listing "${listing.title}" requires modifications. Admin remarks: ${adminNote || 'Please check community guidelines.'}`
                        : `Your property listing "${listing.title}" status changed to ${status}.`,
                type: status === 'approved' ? 'property_approved' : 'property_rejected',
                metadata: { listingId: listing.id, status, adminNote },
            });
        }
        (0, response_1.sendSuccess)(res, null, `Listing status updated to ${status}`);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=listings.controller.js.map
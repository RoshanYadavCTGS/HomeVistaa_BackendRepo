import { Request, Response, NextFunction } from 'express';
import * as listingRepo from '../repositories/listing.repository';
import * as activityLogService from '../services/activityLog.service';
import * as notificationService from '../services/notification.service';
import { sendSuccess, sendCreated, sendNotFound, sendForbidden } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { sendListingSubmissionEmail } from '../services/email.service';
import * as userRepo from '../repositories/user.repository';

export async function createListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, email } = (req as AuthenticatedRequest).user;
    const listing = await listingRepo.createListing(userId, req.body);

    const user = await userRepo.findUserById(userId);
    if (user) {
      sendListingSubmissionEmail(user.name, email, listing.title).catch(() => {});
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

    sendCreated(res, { listing }, 'Property listing submitted for review');
  } catch (err) {
    next(err);
  }
}

export async function getMyListings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '20'), 10);
    
    const filters = {
      search: req.query.search as string,
      status: req.query.status as string,
      type: req.query.type as string,
      listingType: req.query.listingType as string,
      city: req.query.city as string,
      sort: req.query.sort as string,
    };

    const { listings, meta } = await listingRepo.findListingsByUser(userId, page, limit, filters);
    sendSuccess(res, { listings }, 'Listings retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
}

export async function getListingById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const listing = await listingRepo.findListingById(req.params.id!);
    if (!listing) {
      sendNotFound(res, 'Listing not found');
      return;
    }
    sendSuccess(res, { listing }, 'Listing retrieved');
  } catch (err) {
    next(err);
  }
}

export async function updateListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const listing = await listingRepo.findListingById(req.params.id!);

    if (!listing) {
      sendNotFound(res, 'Listing not found');
      return;
    }

    const isAuthorizedAdmin = ['admin', 'super_admin', 'ADMIN', 'SUPER_ADMIN'].includes(String(role));
    if (listing.userId !== userId && !isAuthorizedAdmin) {
      sendForbidden(res, 'You can only update your own listings');
      return;
    }

    const updated = await listingRepo.updateListing(req.params.id!, req.body);

    await activityLogService.logActivity({
      userId,
      action: 'PROPERTY_UPDATED',
      entityType: 'listing',
      entityId: listing.id,
      metadata: { fields: Object.keys(req.body) },
      req,
    });

    sendSuccess(res, { listing: updated }, 'Listing updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const listing = await listingRepo.findListingById(req.params.id!);

    if (!listing) {
      sendNotFound(res, 'Listing not found');
      return;
    }

    const isAuthorizedAdmin = ['admin', 'super_admin', 'ADMIN', 'SUPER_ADMIN'].includes(String(role));
    if (listing.userId !== userId && !isAuthorizedAdmin) {
      sendForbidden(res, 'You can only delete your own listings');
      return;
    }

    await listingRepo.deleteListing(req.params.id!);

    await activityLogService.logActivity({
      userId,
      action: 'PROPERTY_DELETED',
      entityType: 'listing',
      entityId: listing.id,
      req,
    });

    sendSuccess(res, null, 'Listing deleted');
  } catch (err) {
    next(err);
  }
}

export async function updateMyListingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { status } = req.body;
    
    const listing = await listingRepo.findListingById(req.params.id!);
    if (!listing) {
      sendNotFound(res, 'Listing not found');
      return;
    }

    if (listing.userId !== userId) {
      sendForbidden(res, 'You can only update your own listings');
      return;
    }

    const allowedStatuses = ['paused', 'sold', 'rented', 'expired', 'approved', 'submit_for_approval', 'draft'];
    if (!allowedStatuses.includes(status)) {
      sendForbidden(res, 'Invalid status update requested');
      return;
    }

    await listingRepo.updateListingStatus(req.params.id!, status);
    
    await activityLogService.logActivity({
      userId,
      action: 'PROPERTY_STATUS_UPDATE',
      entityType: 'listing',
      entityId: listing.id,
      metadata: { status },
      req,
    });

    sendSuccess(res, null, `Listing status updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

// Admin controllers
export async function getAllListings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '20'), 10);
    const status = req.query.status as string | undefined;
    const { listings, meta } = await listingRepo.findAllListings(page, limit, status);
    sendSuccess(res, { listings }, 'All listings retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
}

export async function updateListingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, adminNote } = req.body;
    const adminId = (req as AuthenticatedRequest).user?.userId;
    await listingRepo.updateListingStatus(req.params.id!, status, adminNote);
    
    const listing = await listingRepo.findListingById(req.params.id!);
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

    sendSuccess(res, null, `Listing status updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import prisma from '../config/database';
import { sendSuccess, sendNotFound, sendForbidden, sendCreated } from '../utils/response';
import * as activityLogService from '../services/activityLog.service';
import * as notificationService from '../services/notification.service';

function isPrivilegedRole(role?: string): boolean {
  if (!role) return false;
  const r = role.toUpperCase();
  return ['ADMIN', 'SUPER_ADMIN', 'SALES_MANAGER', 'SALES'].includes(r);
}

export async function getLeadsForListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const listingId = req.params.id;

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      sendNotFound(res, 'Listing not found');
      return;
    }

    if (listing.userId !== userId && !isPrivilegedRole(role)) {
      sendForbidden(res, 'You can only view leads for your own listings');
      return;
    }

    const leads = await prisma.lead.findMany({
      where: { listingId },
      include: {
        assignedTo: { select: { id: true, name: true, email: true, phone: true } },
        histories: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { enquiryDate: 'desc' },
    });

    sendSuccess(res, { leads }, 'Leads retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getAllLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const normRole = (role || '').toUpperCase();

    let where: Record<string, any> = {};
    if (normRole === 'SALES_MANAGER' || normRole === 'SALES') {
      // Sales Managers see leads assigned to them or unassigned leads in their territory
      where = { OR: [{ assignedToId: userId }, { assignedToId: null }] };
    } else if (normRole !== 'ADMIN' && normRole !== 'SUPER_ADMIN') {
      // Regular builders/owners see leads for their listings only
      const userListings = await prisma.listing.findMany({ where: { userId }, select: { id: true } });
      where = { listingId: { in: userListings.map(l => l.id) } };
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        listing: { select: { title: true, city: true, price: true, userId: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatarUrl: true } },
        histories: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { enquiryDate: 'desc' },
      take: 200,
    });

    sendSuccess(res, { leads }, 'Platform leads retrieved');
  } catch (err) {
    next(err);
  }
}

export async function updateLeadStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const leadId = req.params.leadId || req.params.id;
    const { status, remarks } = req.body;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { listing: true },
    });

    if (!lead) {
      sendNotFound(res, 'Lead not found');
      return;
    }

    if (lead.listing.userId !== userId && lead.assignedToId !== userId && !isPrivilegedRole(role)) {
      sendForbidden(res, 'You are not authorized to update this lead status');
      return;
    }

    const oldStatus = lead.status;
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { status, notes: remarks || lead.notes },
      include: { assignedTo: { select: { name: true, email: true } } },
    });

    // Create audit timeline in LeadHistory
    await prisma.leadHistory.create({
      data: {
        leadId: lead.id,
        oldStatus,
        newStatus: status,
        remarks: remarks || `Status updated from ${oldStatus} to ${status}`,
        updatedBy: userId,
      },
    });

    await activityLogService.logActivity({
      userId,
      action: 'LEAD_STATUS_UPDATE',
      entityType: 'lead',
      entityId: lead.id,
      metadata: { oldStatus, newStatus: status, remarks },
      req,
    });

    // Send notification to property owner if updated by sales or admin
    if (lead.listing.userId !== userId) {
      await notificationService.createNotification({
        userId: lead.listing.userId,
        title: `Lead Status Update: ${status}`,
        message: `Inquiry from ${lead.customerName} for "${lead.listing.title}" progressed to stage: ${status}.`,
        type: 'lead_update',
        metadata: { leadId: lead.id, status },
      });
    }

    sendSuccess(res, { lead: updatedLead }, 'Lead status updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function assignLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const leadId = req.params.id || req.params.leadId;
    const { assignedToId } = req.body;

    const lead = await prisma.lead.findUnique({ where: { id: leadId }, include: { listing: true } });
    if (!lead) {
      sendNotFound(res, 'Lead not found');
      return;
    }

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data: { assignedToId },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });

    await prisma.leadHistory.create({
      data: {
        leadId: lead.id,
        oldStatus: lead.status,
        newStatus: lead.status,
        remarks: `Lead assigned to Relationship Manager: ${updated.assignedTo?.name || assignedToId}`,
        updatedBy: userId,
      },
    });

    await activityLogService.logActivity({
      userId,
      action: 'LEAD_ASSIGNED',
      entityType: 'lead',
      entityId: lead.id,
      metadata: { assignedToId },
      req,
    });

    if (assignedToId) {
      await notificationService.createNotification({
        userId: assignedToId,
        title: 'New Lead Assigned to You',
        message: `You have been assigned a new customer lead (${lead.customerName}) for property "${lead.listing.title}".`,
        type: 'lead_assigned',
        metadata: { leadId: lead.id, listingId: lead.listingId },
      });
    }

    sendSuccess(res, { lead: updated }, 'Lead assigned successfully');
  } catch (err) {
    next(err);
  }
}

export async function createMockLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const listingId = req.params.id;
    const { customerName, contactNumber, email } = req.body;
    
    const lead = await prisma.lead.create({
      data: {
        listingId,
        customerName: customerName || 'Rahul Sharma',
        contactNumber: contactNumber || '+91 9876543210',
        email: email || 'rahul.sharma@example.com',
      }
    });

    await prisma.leadHistory.create({
      data: {
        leadId: lead.id,
        oldStatus: null,
        newStatus: 'New',
        remarks: 'Lead captured from platform inquiry',
      },
    });

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (listing) {
      await notificationService.createNotification({
        userId: listing.userId,
        title: 'New Property Inquiry received!',
        message: `${lead.customerName} expressed interest in your property "${listing.title}".`,
        type: 'new_lead',
        metadata: { leadId: lead.id, listingId },
      });
    }
    
    sendCreated(res, { lead }, 'Lead created successfully');
  } catch(err) {
    next(err);
  }
}

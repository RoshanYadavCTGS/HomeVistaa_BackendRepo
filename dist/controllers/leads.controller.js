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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadsForListing = getLeadsForListing;
exports.getAllLeads = getAllLeads;
exports.updateLeadStatus = updateLeadStatus;
exports.assignLead = assignLead;
exports.createMockLead = createMockLead;
const database_1 = __importDefault(require("../config/database"));
const response_1 = require("../utils/response");
const activityLogService = __importStar(require("../services/activityLog.service"));
const notificationService = __importStar(require("../services/notification.service"));
function isPrivilegedRole(role) {
    if (!role)
        return false;
    const r = role.toUpperCase();
    return ['ADMIN', 'SUPER_ADMIN', 'SALES_MANAGER', 'SALES'].includes(r);
}
async function getLeadsForListing(req, res, next) {
    try {
        const { userId, role } = req.user;
        const listingId = req.params.id;
        const listing = await database_1.default.listing.findUnique({ where: { id: listingId } });
        if (!listing) {
            (0, response_1.sendNotFound)(res, 'Listing not found');
            return;
        }
        if (listing.userId !== userId && !isPrivilegedRole(role)) {
            (0, response_1.sendForbidden)(res, 'You can only view leads for your own listings');
            return;
        }
        const leads = await database_1.default.lead.findMany({
            where: { listingId },
            include: {
                assignedTo: { select: { id: true, name: true, email: true, phone: true } },
                histories: { orderBy: { createdAt: 'desc' }, take: 5 },
            },
            orderBy: { enquiryDate: 'desc' },
        });
        (0, response_1.sendSuccess)(res, { leads }, 'Leads retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function getAllLeads(req, res, next) {
    try {
        const { userId, role } = req.user;
        const normRole = (role || '').toUpperCase();
        let where = {};
        if (normRole === 'SALES_MANAGER' || normRole === 'SALES') {
            // Sales Managers see leads assigned to them or unassigned leads in their territory
            where = { OR: [{ assignedToId: userId }, { assignedToId: null }] };
        }
        else if (normRole !== 'ADMIN' && normRole !== 'SUPER_ADMIN') {
            // Regular builders/owners see leads for their listings only
            const userListings = await database_1.default.listing.findMany({ where: { userId }, select: { id: true } });
            where = { listingId: { in: userListings.map(l => l.id) } };
        }
        const leads = await database_1.default.lead.findMany({
            where,
            include: {
                listing: { select: { title: true, city: true, price: true, userId: true } },
                assignedTo: { select: { id: true, name: true, email: true, avatarUrl: true } },
                histories: { orderBy: { createdAt: 'desc' } },
            },
            orderBy: { enquiryDate: 'desc' },
            take: 200,
        });
        (0, response_1.sendSuccess)(res, { leads }, 'Platform leads retrieved');
    }
    catch (err) {
        next(err);
    }
}
async function updateLeadStatus(req, res, next) {
    try {
        const { userId, role } = req.user;
        const leadId = req.params.leadId || req.params.id;
        const { status, remarks } = req.body;
        const lead = await database_1.default.lead.findUnique({
            where: { id: leadId },
            include: { listing: true },
        });
        if (!lead) {
            (0, response_1.sendNotFound)(res, 'Lead not found');
            return;
        }
        if (lead.listing.userId !== userId && lead.assignedToId !== userId && !isPrivilegedRole(role)) {
            (0, response_1.sendForbidden)(res, 'You are not authorized to update this lead status');
            return;
        }
        const oldStatus = lead.status;
        const updatedLead = await database_1.default.lead.update({
            where: { id: leadId },
            data: { status, notes: remarks || lead.notes },
            include: { assignedTo: { select: { name: true, email: true } } },
        });
        // Create audit timeline in LeadHistory
        await database_1.default.leadHistory.create({
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
        (0, response_1.sendSuccess)(res, { lead: updatedLead }, 'Lead status updated successfully');
    }
    catch (err) {
        next(err);
    }
}
async function assignLead(req, res, next) {
    try {
        const { userId } = req.user;
        const leadId = req.params.id || req.params.leadId;
        const { assignedToId } = req.body;
        const lead = await database_1.default.lead.findUnique({ where: { id: leadId }, include: { listing: true } });
        if (!lead) {
            (0, response_1.sendNotFound)(res, 'Lead not found');
            return;
        }
        const updated = await database_1.default.lead.update({
            where: { id: leadId },
            data: { assignedToId },
            include: { assignedTo: { select: { id: true, name: true, email: true } } },
        });
        await database_1.default.leadHistory.create({
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
        (0, response_1.sendSuccess)(res, { lead: updated }, 'Lead assigned successfully');
    }
    catch (err) {
        next(err);
    }
}
async function createMockLead(req, res, next) {
    try {
        const listingId = req.params.id;
        const { customerName, contactNumber, email } = req.body;
        const lead = await database_1.default.lead.create({
            data: {
                listingId,
                customerName: customerName || 'Rahul Sharma',
                contactNumber: contactNumber || '+91 9876543210',
                email: email || 'rahul.sharma@example.com',
            }
        });
        await database_1.default.leadHistory.create({
            data: {
                leadId: lead.id,
                oldStatus: null,
                newStatus: 'New',
                remarks: 'Lead captured from platform inquiry',
            },
        });
        const listing = await database_1.default.listing.findUnique({ where: { id: listingId } });
        if (listing) {
            await notificationService.createNotification({
                userId: listing.userId,
                title: 'New Property Inquiry received!',
                message: `${lead.customerName} expressed interest in your property "${listing.title}".`,
                type: 'new_lead',
                metadata: { leadId: lead.id, listingId },
            });
        }
        (0, response_1.sendCreated)(res, { lead }, 'Lead created successfully');
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=leads.controller.js.map
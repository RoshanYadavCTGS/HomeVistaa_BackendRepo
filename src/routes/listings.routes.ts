import { Router } from 'express';
import * as listingsController from '../controllers/listings.controller';
import * as draftController from '../controllers/listingDraft.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/rbac.middleware';
import { createListingSchema, updateListingSchema } from '../validators/listing.validator';

const router = Router();

// ─── Listing Draft (Wizard) Routes ────────────────────────────────────────────
router.get('/draft', authenticate, draftController.getActiveDraft);
router.post('/draft', authenticate, draftController.saveDraftStep);
router.post('/draft/publish', authenticate, draftController.publishDraft);

// User listing routes (require auth)
router.post('/', authenticate, validate(createListingSchema), listingsController.createListing);
router.get('/my', authenticate, listingsController.getMyListings);
router.get('/:id', authenticate, listingsController.getListingById);
router.patch('/:id', authenticate, validate(updateListingSchema), listingsController.updateListing);
router.patch('/:id/my-status', authenticate, listingsController.updateMyListingStatus);
router.delete('/:id', authenticate, listingsController.deleteListing);

// Listing Leads routes
import * as leadsController from '../controllers/leads.controller';
router.get('/:id/leads', authenticate, leadsController.getLeadsForListing);
router.patch('/:id/leads/:leadId/status', authenticate, leadsController.updateLeadStatus);
router.post('/:id/leads/mock', authenticate, leadsController.createMockLead);

// Admin listing routes
router.get('/', authenticate, requireAdmin, listingsController.getAllListings);
router.patch('/:id/status', authenticate, requireAdmin, listingsController.updateListingStatus);

export default router;

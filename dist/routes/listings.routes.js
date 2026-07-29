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
const express_1 = require("express");
const listingsController = __importStar(require("../controllers/listings.controller"));
const draftController = __importStar(require("../controllers/listingDraft.controller"));
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const listing_validator_1 = require("../validators/listing.validator");
const router = (0, express_1.Router)();
// ─── Listing Draft (Wizard) Routes ────────────────────────────────────────────
router.get('/draft', auth_middleware_1.authenticate, draftController.getActiveDraft);
router.post('/draft', auth_middleware_1.authenticate, draftController.saveDraftStep);
router.post('/draft/publish', auth_middleware_1.authenticate, draftController.publishDraft);
// User listing routes (require auth)
router.post('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(listing_validator_1.createListingSchema), listingsController.createListing);
router.get('/my', auth_middleware_1.authenticate, listingsController.getMyListings);
router.get('/:id', auth_middleware_1.authenticate, listingsController.getListingById);
router.patch('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(listing_validator_1.updateListingSchema), listingsController.updateListing);
router.patch('/:id/my-status', auth_middleware_1.authenticate, listingsController.updateMyListingStatus);
router.delete('/:id', auth_middleware_1.authenticate, listingsController.deleteListing);
// Listing Leads routes
const leadsController = __importStar(require("../controllers/leads.controller"));
router.get('/:id/leads', auth_middleware_1.authenticate, leadsController.getLeadsForListing);
router.patch('/:id/leads/:leadId/status', auth_middleware_1.authenticate, leadsController.updateLeadStatus);
router.post('/:id/leads/mock', auth_middleware_1.authenticate, leadsController.createMockLead);
// Admin listing routes
router.get('/', auth_middleware_1.authenticate, rbac_middleware_1.requireAdmin, listingsController.getAllListings);
router.patch('/:id/status', auth_middleware_1.authenticate, rbac_middleware_1.requireAdmin, listingsController.updateListingStatus);
exports.default = router;
//# sourceMappingURL=listings.routes.js.map
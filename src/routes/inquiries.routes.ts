import { Router } from 'express';
import * as inquiriesController from '../controllers/inquiries.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/rbac.middleware';
import { optionalAuthenticate } from '../middleware/auth.middleware';
import {
  createInquirySchema,
  createAdvisorInquirySchema,
} from '../validators/inquiry.validator';

const router = Router();

// Public inquiry submission (with optional auth to attach userId)
router.post('/', optionalAuthenticate, validate(createInquirySchema), inquiriesController.submitInquiry);
router.post('/brochure', validate(createInquirySchema), inquiriesController.submitBrochureRequest);
router.post('/advisor', validate(createAdvisorInquirySchema), inquiriesController.submitAdvisorInquiry);

// User history
router.get('/my', authenticate, inquiriesController.getMyInquiries);

// Admin
router.get('/', authenticate, requireAdmin, inquiriesController.getAllInquiries);

export default router;

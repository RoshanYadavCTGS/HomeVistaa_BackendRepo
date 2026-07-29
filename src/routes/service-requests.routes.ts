import { Router } from 'express';
import * as serviceRequestsController from '../controllers/service-requests.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/rbac.middleware';
import { createServiceRequestSchema } from '../validators/inquiry.validator';

const router = Router();

// Public service request submission
router.post('/', validate(createServiceRequestSchema), serviceRequestsController.submitServiceRequest);

// User
router.get('/my', authenticate, serviceRequestsController.getMyServiceRequests);

// Admin
router.get('/', authenticate, requireAdmin, serviceRequestsController.getAllServiceRequests);

export default router;

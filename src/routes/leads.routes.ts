import { Router } from 'express';
import * as leadsController from '../controllers/leads.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Platform wide enterprise leads management for Sales/RM & Admins
router.get('/', authenticate, leadsController.getAllLeads);
router.patch('/:id/status', authenticate, leadsController.updateLeadStatus);
router.patch('/:id/assign', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER']), leadsController.assignLead);

export default router;

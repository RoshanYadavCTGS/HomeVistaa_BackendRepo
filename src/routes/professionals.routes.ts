import { Router } from 'express';
import * as professionalsController from '../controllers/professionals.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/rbac.middleware';
import { optionalAuthenticate } from '../middleware/auth.middleware';
import { createProfessionalSchema, updateProfessionalStatusSchema } from '../validators/professional.validator';

const router = Router();

// Public registration (with optional auth to attach userId)
router.post('/', optionalAuthenticate, validate(createProfessionalSchema), professionalsController.registerProfessional);

// Admin
router.get('/', authenticate, requireAdmin, professionalsController.getAllProfessionals);
router.patch('/:id/status', authenticate, requireAdmin, validate(updateProfessionalStatusSchema), professionalsController.updateProfessionalStatus);

export default router;

import { Router } from 'express';
import * as propertiesController from '../controllers/properties.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/rbac.middleware';
import { propertyFiltersSchema, createPropertySchema } from '../validators/property.validator';

const router = Router();

// Public property routes
router.get('/', validate(propertyFiltersSchema, 'query'), propertiesController.getProperties);
router.get('/featured', propertiesController.getFeaturedProperties);
router.get('/:id', propertiesController.getPropertyById);

// Admin only property routes
router.post('/', authenticate, requireAdmin, validate(createPropertySchema), propertiesController.createProperty);
router.delete('/:id', authenticate, requireAdmin, propertiesController.deleteProperty);

export default router;

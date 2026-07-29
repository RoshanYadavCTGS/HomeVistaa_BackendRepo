import { Router } from 'express';
import * as alertsController from '../controllers/alerts.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createAlertSchema } from '../validators/inquiry.validator';

const router = Router();

router.use(authenticate); // All alert routes require auth

router.get('/', alertsController.getAlerts);
router.post('/', validate(createAlertSchema), alertsController.createAlert);
router.delete('/:id', alertsController.deleteAlert);

export default router;

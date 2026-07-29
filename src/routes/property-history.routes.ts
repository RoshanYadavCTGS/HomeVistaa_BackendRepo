import { Router } from 'express';
import * as propertyHistoryController from '../controllers/property-history.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', propertyHistoryController.trackPropertyView);
router.get('/', propertyHistoryController.getRecentViews);

export default router;

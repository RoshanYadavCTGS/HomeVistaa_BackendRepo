import { Router } from 'express';
import * as userActivityController from '../controllers/user-activity.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', userActivityController.getUserActivity);

export default router;

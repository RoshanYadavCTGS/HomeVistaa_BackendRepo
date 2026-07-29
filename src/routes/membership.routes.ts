import { Router } from 'express';
import * as membershipController from '../controllers/membership.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // All membership routes require authentication

router.get('/current', membershipController.getCurrentMembership);
router.post('/purchase', membershipController.purchaseMembership);

export default router;

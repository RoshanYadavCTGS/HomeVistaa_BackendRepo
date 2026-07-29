import { Router } from 'express';
import * as couponsController from '../controllers/coupons.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Secure all coupon routes with JWT authentication
router.use(authenticate);

router.get('/dashboard', couponsController.getDashboard);
router.get('/', couponsController.getMyCoupons);

export default router;

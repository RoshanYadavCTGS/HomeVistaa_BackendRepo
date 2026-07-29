import { Router } from 'express';
import * as referralsController from '../controllers/referrals.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/dashboard', referralsController.getDashboard);
router.get('/history', referralsController.getHistory);
router.get('/rewards', referralsController.getRewards);
router.get('/wallet-transactions', referralsController.getWalletTransactions);
router.post('/redeem', referralsController.redeemRewards);

export default router;

import { Router } from 'express';
import * as loansController from '../controllers/loans.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/my', authenticate, loansController.getMyLoanApplications);
router.post('/', authenticate, loansController.createLoanApplication);

export default router;

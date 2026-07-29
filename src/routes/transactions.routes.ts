import { Router } from 'express';
import * as transactionsController from '../controllers/transactions.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Secure all transaction routes with JWT authentication
router.use(authenticate);

router.get('/', transactionsController.getTransactions);
router.get('/:id', transactionsController.getTransactionById);
router.get('/:id/payments', transactionsController.getTransactionPayments);
router.get('/:id/documents', transactionsController.getTransactionDocuments);
router.get('/:id/timeline', transactionsController.getTransactionTimeline);
router.post('/', transactionsController.createTransaction);

export default router;

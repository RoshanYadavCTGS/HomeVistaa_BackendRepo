import { Request, Response, NextFunction } from 'express';
import * as transactionRepo from '../repositories/transaction.repository';
import { sendSuccess, sendCreated, sendNotFound, sendForbidden, sendBadRequest } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { PropertyType, TransactionType, PaymentStatus } from '@prisma/client';

export async function getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const { search, propertyType, transactionType, paymentStatus, sort, all } = req.query;

    const filters = {
      search: search as string,
      propertyType: propertyType as PropertyType,
      transactionType: transactionType as TransactionType,
      paymentStatus: paymentStatus as PaymentStatus,
      sort: sort as string,
    };

    // Admins can request all transactions via query param 'all=true'
    if (role === 'admin' && all === 'true') {
      const transactions = await transactionRepo.getAllTransactions(filters);
      sendSuccess(res, { transactions }, 'All transactions retrieved (Admin)');
      return;
    }

    const result = await transactionRepo.getTransactionsByUser(userId, filters);
    sendSuccess(res, result, 'User transactions retrieved');
  } catch (err) {
    next(err);
  }
}

export async function getTransactionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const { id } = req.params;

    if (!id) {
      sendBadRequest(res, 'Transaction ID is required');
      return;
    }

    try {
      const transaction = await transactionRepo.getTransactionById(id, userId, role === 'admin');
      if (!transaction) {
        sendNotFound(res, 'Transaction not found');
        return;
      }
      sendSuccess(res, { transaction }, 'Transaction details retrieved');
    } catch (err: any) {
      if (err.message === 'Access denied') {
        sendForbidden(res, 'You do not have permission to view this transaction');
        return;
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

export async function getTransactionPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    
    const transaction = await transactionRepo.getTransactionById(id, userId, role === 'admin');
    if (!transaction) {
      sendNotFound(res, 'Transaction not found');
      return;
    }
    sendSuccess(res, { payments: transaction.payments }, 'Transaction payments retrieved');
  } catch (err: any) {
    if (err.message === 'Access denied') {
      sendForbidden(res, 'Access denied');
      return;
    }
    next(err);
  }
}

export async function getTransactionDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    
    const transaction = await transactionRepo.getTransactionById(id, userId, role === 'admin');
    if (!transaction) {
      sendNotFound(res, 'Transaction not found');
      return;
    }
    sendSuccess(res, { documents: transaction.documents }, 'Transaction documents retrieved');
  } catch (err: any) {
    if (err.message === 'Access denied') {
      sendForbidden(res, 'Access denied');
      return;
    }
    next(err);
  }
}

export async function getTransactionTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, role } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    
    const transaction = await transactionRepo.getTransactionById(id, userId, role === 'admin');
    if (!transaction) {
      sendNotFound(res, 'Transaction not found');
      return;
    }
    sendSuccess(res, { timeline: transaction.timeline }, 'Transaction timeline retrieved');
  } catch (err: any) {
    if (err.message === 'Access denied') {
      sendForbidden(res, 'Access denied');
      return;
    }
    next(err);
  }
}

export async function createTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { propertyId, transactionType, amountPaid, paymentMethod, paymentStatus, bookingStatus } = req.body;

    if (!propertyId || !transactionType || !amountPaid || !paymentMethod) {
      sendBadRequest(res, 'Missing required fields for transaction creation');
      return;
    }

    const transaction = await transactionRepo.createTransaction(userId, {
      propertyId,
      transactionType,
      amountPaid: Number(amountPaid),
      paymentMethod,
      paymentStatus,
      bookingStatus,
    });

    sendCreated(res, { transaction: { ...transaction, amountPaid: Number(transaction.amountPaid) } }, 'Transaction recorded successfully');
  } catch (err: any) {
    if (err.message === 'Property not found') {
      sendBadRequest(res, 'Invalid propertyId provided');
      return;
    }
    next(err);
  }
}

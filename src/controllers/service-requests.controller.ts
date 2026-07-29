import { Request, Response, NextFunction } from 'express';
import * as inquiryRepo from '../repositories/inquiry.repository';
import { sendSuccess, sendCreated } from '../utils/response';

export async function submitServiceRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const request = await inquiryRepo.createServiceRequest(req.body);
    sendCreated(res, { request }, 'Service request submitted. Our team will contact you within 24 hours.');
  } catch (err) {
    next(err);
  }
}

export async function getAllServiceRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '20'), 10);
    const { requests, meta } = await inquiryRepo.findAllServiceRequests(page, limit);
    sendSuccess(res, { requests }, 'Service requests retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
}

export async function getMyServiceRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // We expect `req.user` to exist because this route will use `authenticate`
    const { email } = (req as any).user;
    if (!email) {
      sendSuccess(res, { requests: [] }, 'No email found in user token');
      return;
    }
    const requests = await inquiryRepo.findServiceRequestsByEmail(email);
    sendSuccess(res, { requests }, 'User service requests retrieved', 200);
  } catch (err) {
    next(err);
  }
}


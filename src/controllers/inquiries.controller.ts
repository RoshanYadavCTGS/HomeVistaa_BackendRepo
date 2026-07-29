import { Request, Response, NextFunction } from 'express';
import * as inquiryRepo from '../repositories/inquiry.repository';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { sendInquiryConfirmation } from '../services/email.service';

export async function submitInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Partial<AuthenticatedRequest>).user?.userId;
    const inquiry = await inquiryRepo.createInquiry({ ...req.body, userId });

    // Non-blocking confirmation email
    sendInquiryConfirmation(inquiry.name, inquiry.email, inquiry.propertyName ?? undefined).catch(() => {});

    sendCreated(res, { inquiry }, 'Inquiry submitted successfully');
  } catch (err) {
    next(err);
  }
}

export async function submitAdvisorInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const inquiry = await inquiryRepo.createInquiry({
      ...req.body,
      inquiryType: 'advisor',
      message: `Advisor contact request from ${req.body.name}`,
    });
    sendCreated(res, { inquiry }, 'Advisor contact request submitted');
  } catch (err) {
    next(err);
  }
}

export async function submitBrochureRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const inquiry = await inquiryRepo.createInquiry({
      ...req.body,
      inquiryType: 'brochure',
      message: `Brochure download request for ${req.body.propertyName ?? 'Property'}`,
    });
    sendCreated(res, { inquiry }, 'Brochure request received. We will email it to you shortly.');
  } catch (err) {
    next(err);
  }
}

export async function getMyInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as AuthenticatedRequest).user.userId;
    const inquiries = await inquiryRepo.findInquiriesByUserId(userId);
    sendSuccess(res, { inquiries }, 'Your inquiries retrieved successfully');
  } catch (err) {
    next(err);
  }
}

// Admin
export async function getAllInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '20'), 10);
    const type = req.query.type as string | undefined;
    const { inquiries, meta } = await inquiryRepo.findAllInquiries(page, limit, type);
    sendSuccess(res, { inquiries }, 'Inquiries retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
}

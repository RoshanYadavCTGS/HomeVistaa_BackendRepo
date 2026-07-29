import { Request, Response, NextFunction } from 'express';
import * as professionalRepo from '../repositories/professional.repository';
import { sendSuccess, sendCreated, sendConflict } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export async function registerProfessional(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Partial<AuthenticatedRequest>).user?.userId;

    // Check for duplicate email
    const existing = await professionalRepo.findProfessionalByEmail(req.body.email);
    if (existing) {
      sendConflict(res, 'A professional with this email is already registered.');
      return;
    }

    const professional = await professionalRepo.createProfessional({
      ...req.body,
      userId,
    });

    sendCreated(res, { professional }, 'Professional registration submitted for review');
  } catch (err) {
    next(err);
  }
}

export async function getAllProfessionals(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const limit = parseInt(String(req.query.limit ?? '20'), 10);
    const status = req.query.status as string | undefined;
    const { professionals, meta } = await professionalRepo.findAllProfessionals(page, limit, status);
    sendSuccess(res, { professionals }, 'Professionals retrieved', 200, meta);
  } catch (err) {
    next(err);
  }
}

export async function updateProfessionalStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, adminNote } = req.body;
    const professional = await professionalRepo.updateProfessionalStatus(req.params.id!, status, adminNote);
    sendSuccess(res, { professional }, `Professional status updated to ${status}`);
  } catch (err) {
    next(err);
  }
}

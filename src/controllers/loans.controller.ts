import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as loansRepo from '../repositories/loans.repository';
import { sendSuccess, sendCreated } from '../utils/response';

export async function createLoanApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const loanApp = await loansRepo.createLoanApplication({
      ...req.body,
      userId,
    });
    sendCreated(res, { loanApp }, 'Loan application submitted successfully');
  } catch (err) {
    next(err);
  }
}

export async function getMyLoanApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const loanApps = await loansRepo.getLoanApplicationsByUser(userId);
    
    // We need to convert BigInts to string/number for JSON response
    const formatted = loanApps.map((app: any) => ({
      ...app,
      loanAmount: Number(app.loanAmount),
      monthlyIncome: Number(app.monthlyIncome),
    }));

    sendSuccess(res, { loanApps: formatted }, 'Loan applications retrieved');
  } catch (err) {
    next(err);
  }
}

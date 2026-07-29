import { LoanApplication, Prisma } from '@prisma/client';
export declare function createLoanApplication(data: Prisma.LoanApplicationUncheckedCreateInput): Promise<LoanApplication>;
export declare function getLoanApplicationsByUser(userId: string): Promise<LoanApplication[]>;
export declare function getLoanApplicationById(id: string): Promise<LoanApplication | null>;
export declare function updateLoanApplication(id: string, data: Prisma.LoanApplicationUpdateInput): Promise<LoanApplication>;
//# sourceMappingURL=loans.repository.d.ts.map
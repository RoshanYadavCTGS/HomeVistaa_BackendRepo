import { PrismaClient, LoanApplication, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function createLoanApplication(data: Prisma.LoanApplicationUncheckedCreateInput): Promise<LoanApplication> {
  return prisma.loanApplication.create({
    data,
  });
}

export async function getLoanApplicationsByUser(userId: string): Promise<LoanApplication[]> {
  return prisma.loanApplication.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getLoanApplicationById(id: string): Promise<LoanApplication | null> {
  return prisma.loanApplication.findUnique({
    where: { id },
  });
}

export async function updateLoanApplication(id: string, data: Prisma.LoanApplicationUpdateInput): Promise<LoanApplication> {
  return prisma.loanApplication.update({
    where: { id },
    data,
  });
}

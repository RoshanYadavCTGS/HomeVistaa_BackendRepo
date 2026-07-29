import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';

export async function createProfessional(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  reraId?: string;
  experience: number;
  role: string;
  userId?: string;
}) {
  return prisma.professional.create({
    data: {
      ...data,
      role: data.role as any,
    },
  });
}

export async function findProfessionalByEmail(email: string) {
  return prisma.professional.findUnique({ where: { email } });
}

export async function findAllProfessionals(page = 1, limit = 20, status?: string) {
  const { skip } = parsePagination({ page, limit });
  const where = status ? { status: status as any } : {};

  const [total, rows] = await Promise.all([
    prisma.professional.count({ where }),
    prisma.professional.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return { professionals: rows, meta: buildPaginationMeta(total, page, limit) };
}

export async function updateProfessionalStatus(id: string, status: string, adminNote?: string) {
  return prisma.professional.update({
    where: { id },
    data: {
      status: status as any,
      adminNote,
    },
  });
}

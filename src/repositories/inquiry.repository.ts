import prisma from '../config/database';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';

export async function createInquiry(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  propertyId?: string;
  propertyName?: string;
  datePreference?: string;
  userId?: string;
}) {
  return prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      inquiryType: data.inquiryType as 'general',
      propertyId: data.propertyId,
      propertyName: data.propertyName,
      datePreference: data.datePreference,
      userId: data.userId,
    },
  });
}

export async function findAllInquiries(page = 1, limit = 20, type?: string) {
  const { skip } = parsePagination({ page, limit });
  const where = type ? { inquiryType: { equals: type as 'general' } } : {};

  const [total, rows] = await Promise.all([
    prisma.inquiry.count({ where }),
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return { inquiries: rows, meta: buildPaginationMeta(total, page, limit) };
}

export async function findInquiriesByUserId(userId: string) {
  return prisma.inquiry.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markInquiryRead(id: string) {
  return prisma.inquiry.update({ where: { id }, data: { isRead: true } });
}

// ─── Service Requests ─────────────────────────────────────────────────────────

export async function createServiceRequest(data: {
  name: string;
  email: string;
  phone: string;
  address?: string;
  details?: string;
  serviceType: string;
}) {
  return prisma.serviceRequest.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      details: data.details,
      serviceType: data.serviceType as 'agreement',
    },
  });
}

export async function findAllServiceRequests(page = 1, limit = 20) {
  const { skip } = parsePagination({ page, limit });
  const [total, rows] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);
  return { requests: rows, meta: buildPaginationMeta(total, page, limit) };
}

export async function findServiceRequestsByEmail(email: string) {
  return prisma.serviceRequest.findMany({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
}


import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';

export async function findBlogs(page = 1, limit = 20, category?: string) {
  const { skip } = parsePagination({ page, limit });
  const where: Prisma.BlogWhereInput = { published: true };
  if (category) where.category = category as any;

  const [total, rows] = await Promise.all([
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  return { blogs: rows, meta: buildPaginationMeta(total, page, limit) };
}

export async function findBlogById(id: string) {
  return prisma.blog.findUnique({ where: { id } });
}

export async function createBlog(data: {
  category: string;
  title: string;
  description: string;
  author: string;
  readTime: string;
  image: string;
}) {
  return prisma.blog.create({
    data: { ...data, category: data.category as any },
  });
}

export async function updateBlog(id: string, data: Partial<{
  category: string;
  title: string;
  description: string;
  author: string;
  readTime: string;
  image: string;
  published: boolean;
}>) {
  return prisma.blog.update({ where: { id }, data: data as any });
}

export async function deleteBlog(id: string) {
  return prisma.blog.delete({ where: { id } });
}

// ─── Interior Designs ─────────────────────────────────────────────────────────

export async function findInteriors(roomType?: string) {
  const where: Prisma.InteriorDesignWhereInput = { active: true };
  if (roomType) where.roomType = roomType as any;

  const rows = await prisma.interiorDesign.findMany({
    where,
    orderBy: { createdAt: 'asc' },
  });

  return rows.map((r) => ({
    ...r,
    specsJson: r.specsJson as string[],
  }));
}

export async function findInteriorById(id: string) {
  return prisma.interiorDesign.findUnique({ where: { id } });
}

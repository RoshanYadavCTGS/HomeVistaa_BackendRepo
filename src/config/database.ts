import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Prevent multiple instances in development due to hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log: env.isDev
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
    errorFormat: env.isDev ? 'pretty' : 'minimal',
  });
};

export const prisma: PrismaClient =
  global.__prisma ?? createPrismaClient();

if (env.isDev) {
  global.__prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  console.log('✅ Database connected successfully');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
}

export default prisma;

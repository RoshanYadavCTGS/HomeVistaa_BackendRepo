import prisma from '../config/database';

export async function createAlert(userId: string, data: {
  title: string;
  description: string;
  filtersJson: Record<string, any>;
}) {
  return prisma.savedAlert.create({
    data: { userId, ...data, filtersJson: data.filtersJson as any },
  });
}

export async function getAlertsByUser(userId: string) {
  return prisma.savedAlert.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteAlert(id: string, userId: string) {
  return prisma.savedAlert.deleteMany({ where: { id, userId } });
}

export async function getAlertById(id: string) {
  return prisma.savedAlert.findUnique({ where: { id } });
}

export async function getAlertsCount(userId: string): Promise<number> {
  return prisma.savedAlert.count({ where: { userId } });
}

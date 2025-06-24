import prisma from '@/lib/prisma';

export async function getSchedules(userId: string) {
  return prisma.schedule.findMany({
    where: { userId },
    orderBy: { date: 'asc' }
  });
}

import prisma from '@/lib/prisma';

export async function getRoles() {
  return prisma.role.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

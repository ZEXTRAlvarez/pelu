import prisma from '@/lib/prisma';

export async function deleteRole(email: string) {
  await prisma.role.delete({
    where: { email },
  });
}

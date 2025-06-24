import prisma from '@/lib/prisma';

export async function createRole(data: { email: string; role: string }) {
  const { email, role } = data;

  if (!email || !role) {
    throw new Error('Faltan campos requeridos');
  }

  const existingRole = await prisma.role.findUnique({
    where: { email },
  });

  if (existingRole) {
    throw new Error('El email ya tiene un rol asignado');
  }

  return prisma.role.create({
    data: {
      email,
      role: role.toUpperCase(),
    },
  });
}

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function authorizeHairdresser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    const error = new Error('No autorizado') as Error & { status?: number };
    error.status = 401;
    throw error;
  }

  const role = await prisma.role.findUnique({
    where: { email: session.user.email }
  });

  if (!role || role.role !== 'PELUQUERO') {
    const error = new Error('No autorizado') as Error & { status?: number };
    error.status = 401;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    const error = new Error('Usuario no encontrado') as Error & { status?: number };
    error.status = 404;
    throw error;
  }

  return user;
}

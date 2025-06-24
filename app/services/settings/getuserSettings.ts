import prisma from '@/lib/prisma';

export async function getUserSettings(email: string) {
  const user = await prisma.user.findFirst({
    where: { email }
  });

  if (!user) {
    const error = new Error('Usuario no encontrado') as Error & { status?: number };
    error.status = 404;
    throw error;
  }

  return {
    id: user.id,
    minAppointmentDuration: user.minAppointmentDuration || 15
  };
}

import prisma from '@/lib/prisma';

export async function updateUserSettings(email: string, minDuration: number) {
  if (
    typeof minDuration !== 'number' ||
    minDuration < 15 ||
    minDuration > 120
  ) {
    const error = new Error('Duración inválida') as Error & { status?: number };
    error.status = 400;
    throw error;
  }

  return prisma.user.upsert({
    where: { email },
    update: { minAppointmentDuration: minDuration },
    create: { email, minAppointmentDuration: minDuration },
    select: { minAppointmentDuration: true }
  });
}

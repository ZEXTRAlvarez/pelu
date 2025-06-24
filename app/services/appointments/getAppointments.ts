import prisma from '@/lib/prisma';

export async function getAppointments(email: string, date: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      userId: user.id,
      date: { equals: date }
    },
    orderBy: { startTime: 'asc' }
  });

  if (appointments.length === 0) {
    return [];
  }

  return appointments;
}

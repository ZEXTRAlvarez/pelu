import prisma from '@/lib/prisma';

export async function deleteScheduleById(userId: string, scheduleId: string) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId }
  });

  if (!schedule) {
    const error = new Error('Horario no encontrado') as Error & { status?: number };
    error.status = 404;
    throw error;
  }

  if (schedule.userId !== userId) {
    const error = new Error('No autorizado') as Error & { status?: number };
    error.status = 401;
    throw error;
  }

  await prisma.schedule.delete({
    where: { id: scheduleId }
  });
}

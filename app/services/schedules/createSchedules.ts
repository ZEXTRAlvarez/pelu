import prisma from '@/lib/prisma';

type ScheduleInput = {
  date: string;
  startTime: string;
  endTime: string;
};

export async function createSchedule(userId: string, data: ScheduleInput) {
  const { date, startTime, endTime } = data;

  if (!date || !startTime || !endTime) {
    const error = new Error('Faltan campos requeridos') as Error & { status?: number };
    error.status = 400;
    throw error;
  }

  return prisma.schedule.create({
    data: {
      date,
      startTime,
      endTime,
      userId
    }
  });
}

import prisma from '@/lib/prisma';
import { Schedule } from '@prisma/client';

export function validateAppointmentTime(schedules: Schedule[], startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const turnoStart = startHour * 60 + startMinute;
  const turnoEnd = endHour * 60 + endMinute;

  return schedules.some(schedule => {
    const [schStartHour, schStartMin] = schedule.startTime.split(':').map(Number);
    const [schEndHour, schEndMin] = schedule.endTime.split(':').map(Number);
    const schStart = schStartHour * 60 + schStartMin;
    const schEnd = schEndHour * 60 + schEndMin;

    return turnoStart >= schStart && turnoEnd <= schEnd;
  });
}

export async function checkForOverlap(userId: string, date: string, startTime: string, endTime: string) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      userId,
      date,
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ]
        },
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } },
          ]
        },
      ],
    }
  });

  return Boolean(appointment);
}

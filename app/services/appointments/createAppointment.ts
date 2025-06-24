import { checkForOverlap, validateAppointmentTime } from '@/app/utils/validateAppointment';
import prisma from '@/lib/prisma';

interface AppointmentBody {
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientPhone: string;
}

export async function createAppointment(email: string, body: AppointmentBody) {
  const { date, startTime, endTime, clientName, clientPhone } = body;

  if (!date || !startTime || !endTime || !clientName || !clientPhone) {
    throw new Error('Faltan datos requeridos');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');

  const schedules = await prisma.schedule.findMany({
    where: { userId: user.id, date },
    orderBy: { startTime: 'asc' }
  });

  if (!validateAppointmentTime(schedules, startTime, endTime)) {
    const schedulesText = schedules.map(s => `${s.startTime}-${s.endTime}`).join(', ');
    throw new Error(`El horario seleccionado está fuera del horario configurado (horarios: ${schedulesText})`);
  }

  const hasOverlap = await checkForOverlap(user.id, date, startTime, endTime);
  if (hasOverlap) {
    throw new Error('Ya existe una cita en este horario');
  }

  return prisma.appointment.create({
    data: {
      date,
      startTime,
      endTime,
      clientName,
      clientPhone,
      userId: user.id
    }
  });
}

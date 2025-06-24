import prisma from '@/lib/prisma';

export async function deleteAppointment(userEmail: string, appointmentId: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error('Turno no encontrado');
  }

  await prisma.appointment.delete({
    where: { id: appointmentId },
  });
}

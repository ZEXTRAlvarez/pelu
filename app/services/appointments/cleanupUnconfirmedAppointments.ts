import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function cleanupUnconfirmedAppointments() {
  try {
    // Obtener turnos no confirmados que tienen más de 24 horas
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const unconfirmedAppointments = await prisma.appointment.findMany({
      where: {
        confirmed: false,
        createdAt: {
          lt: twentyFourHoursAgo
        }
      }
    });

    if (unconfirmedAppointments.length === 0) {
      console.log('No hay turnos no confirmados para eliminar');
      return { deleted: 0 };
    }

    // Eliminar turnos no confirmados
    const result = await prisma.appointment.deleteMany({
      where: {
        confirmed: false,
        createdAt: {
          lt: twentyFourHoursAgo
        }
      }
    });

    console.log(`Se eliminaron ${result.count} turnos no confirmados`);
    return { deleted: result.count };
  } catch (error) {
    console.error('Error al limpiar turnos no confirmados:', error);
    throw error;
  }
} 
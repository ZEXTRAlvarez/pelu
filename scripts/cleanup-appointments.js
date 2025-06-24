const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupUnconfirmedAppointments() {
  try {
    console.log('Iniciando limpieza de turnos no confirmados...');
    
    // Obtener turnos no confirmados que tienen más de 24 horas
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const unconfirmedAppointments = await prisma.appointment.findMany({
      where: {
        confirmed: false,
        createdAt: {
          lt: twentyFourHoursAgo
        }
      },
      include: {
        user: true
      }
    });

    if (unconfirmedAppointments.length === 0) {
      console.log('No hay turnos no confirmados para eliminar');
      return;
    }

    console.log(`Encontrados ${unconfirmedAppointments.length} turnos no confirmados para eliminar`);

    // Eliminar turnos no confirmados
    const result = await prisma.appointment.deleteMany({
      where: {
        confirmed: false,
        createdAt: {
          lt: twentyFourHoursAgo
        }
      }
    });

    console.log(`✅ Se eliminaron ${result.count} turnos no confirmados exitosamente`);
    
    // Mostrar detalles de los turnos eliminados
    unconfirmedAppointments.forEach(appointment => {
      console.log(`- ${appointment.clientName} (${appointment.clientPhone}) - ${appointment.date} ${appointment.startTime}-${appointment.endTime}`);
    });

  } catch (error) {
    console.error('❌ Error al limpiar turnos no confirmados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función si el script se ejecuta directamente
if (require.main === module) {
  cleanupUnconfirmedAppointments();
}

module.exports = { cleanupUnconfirmedAppointments }; 
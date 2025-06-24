import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Actualizar o crear el rol del usuario
    const user = await prisma.user.upsert({
      where: {
        email: 'rodaaa18@gmail.com'
      },
      update: {
        role: 'PELUQUERO',
        minAppointmentDuration: 15
      },
      create: {
        email: 'rodaaa18@gmail.com',
        name: 'Rodrigo Alvarez',
        role: 'PELUQUERO',
        minAppointmentDuration: 15
      }
    });

    console.log('Usuario actualizado:', user);

    // Crear o actualizar el rol del usuario en la tabla Role
    const allUsers = await prisma.user.findMany();
    for (const u of allUsers) {
      await prisma.role.upsert({
        where: { email: u.email! },
        update: { role: 'PELUQUERO' },
        create: { email: u.email!, role: 'PELUQUERO' }
      });
    }
    console.log('Roles actualizados para todos los usuarios.');

    // Crear horarios de ejemplo
    const schedules = await Promise.all([
      prisma.schedule.upsert({
        where: { id: 'lunes' },
        update: {
          date: '2024-06-24',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        },
        create: {
          id: 'lunes',
          date: '2024-06-24',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        }
      }),
      prisma.schedule.upsert({
        where: { id: 'martes' },
        update: {
          date: '2024-06-25',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        },
        create: {
          id: 'martes',
          date: '2024-06-25',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        }
      }),
      prisma.schedule.upsert({
        where: { id: 'miercoles' },
        update: {
          date: '2024-06-26',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        },
        create: {
          id: 'miercoles',
          date: '2024-06-26',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        }
      }),
      prisma.schedule.upsert({
        where: { id: 'jueves' },
        update: {
          date: '2024-06-27',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        },
        create: {
          id: 'jueves',
          date: '2024-06-27',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        }
      }),
      prisma.schedule.upsert({
        where: { id: 'viernes' },
        update: {
          date: '2024-06-28',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        },
        create: {
          id: 'viernes',
          date: '2024-06-28',
          startTime: '09:00',
          endTime: '18:00',
          userId: user.id
        }
      })
    ]);

    console.log('Horarios creados:', schedules);
  } catch (error) {
    console.error('Error en el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Seed completado exitosamente');
  })
  .catch((error) => {
    console.error('Error en el seed:', error);
    process.exit(1);
  }); 
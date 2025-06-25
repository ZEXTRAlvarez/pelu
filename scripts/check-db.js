const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    console.log('URL de la base de datos:', process.env.DATABASE_URL ? 'Configurada' : 'NO CONFIGURADA');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Verificar si las tablas existen
    console.log('\n📋 Verificando tablas existentes...');
    
    try {
      const users = await prisma.user.findMany({ take: 1 });
      console.log('✅ Tabla User existe');
    } catch (error) {
      console.log('❌ Tabla User NO existe:', error.message);
    }
    
    try {
      const schedules = await prisma.schedule.findMany({ take: 1 });
      console.log('✅ Tabla Schedule existe');
    } catch (error) {
      console.log('❌ Tabla Schedule NO existe:', error.message);
    }
    
    try {
      const appointments = await prisma.appointment.findMany({ take: 1 });
      console.log('✅ Tabla Appointment existe');
    } catch (error) {
      console.log('❌ Tabla Appointment NO existe:', error.message);
    }
    
    try {
      const accounts = await prisma.account.findMany({ take: 1 });
      console.log('✅ Tabla Account existe');
    } catch (error) {
      console.log('❌ Tabla Account NO existe:', error.message);
    }
    
    try {
      const sessions = await prisma.session.findMany({ take: 1 });
      console.log('✅ Tabla Session existe');
    } catch (error) {
      console.log('❌ Tabla Session NO existe:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase(); 
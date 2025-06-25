const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

async function setupDatabase() {
  console.log('🚀 Configurando base de datos en Railway...');
  
  try {
    // Verificar que DATABASE_URL esté configurada
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL no está configurada');
      process.exit(1);
    }
    
    console.log('✅ DATABASE_URL configurada');
    console.log('URL:', process.env.DATABASE_URL.substring(0, 20) + '...');
    
    // Generar el cliente de Prisma
    console.log('\n🔧 Generando cliente de Prisma...');
    try {
      execSync('npx prisma generate --schema=./prisma/schema.production.prisma', { stdio: 'inherit' });
      console.log('✅ Cliente de Prisma generado');
    } catch (error) {
      console.error('❌ Error generando cliente de Prisma:', error.message);
      process.exit(1);
    }
    
    // Ejecutar migraciones
    console.log('\n📦 Ejecutando migraciones...');
    try {
      execSync('npx prisma migrate deploy --schema=./prisma/schema.production.prisma', { stdio: 'inherit' });
      console.log('✅ Migraciones ejecutadas correctamente');
    } catch (error) {
      console.error('❌ Error ejecutando migraciones:', error.message);
      process.exit(1);
    }
    
    // Verificar que las tablas se crearon
    console.log('\n🔍 Verificando tablas creadas...');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    
    await prisma.$connect();
    
    const tables = ['User', 'Schedule', 'Appointment', 'Account', 'Session', 'Role'];
    for (const table of tables) {
      try {
        await prisma.$queryRaw`SELECT 1 FROM "${table}" LIMIT 1`;
        console.log(`✅ Tabla ${table} existe`);
      } catch (error) {
        console.log(`❌ Tabla ${table} NO existe:`, error.message);
      }
    }
    
    await prisma.$disconnect();
    
    console.log('\n🎉 Configuración de base de datos completada');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

setupDatabase(); 
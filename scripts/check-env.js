require('dotenv').config();

console.log('=== VERIFICACIÓN DE VARIABLES DE ENTORNO ===\n');

// Verificar variables básicas
console.log('📊 Variables básicas:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurado' : '❌ NO CONFIGURADO');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Configurado' : '❌ NO CONFIGURADO');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Configurado' : '❌ NO CONFIGURADO');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL ? '✅ Configurado' : '❌ NO CONFIGURADO');

console.log('\n📱 Variables de Twilio SMS:');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Configurado' : '❌ NO CONFIGURADO');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Configurado' : '❌ NO CONFIGURADO');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER ? '✅ Configurado' : '❌ NO CONFIGURADO');

console.log('\n🔍 Detalles de configuración:');
if (process.env.NEXT_PUBLIC_APP_URL) {
  console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
}
if (process.env.TWILIO_ACCOUNT_SID) {
  console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID.substring(0, 10) + '...');
}
if (process.env.TWILIO_AUTH_TOKEN) {
  console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN.substring(0, 10) + '...');
}
if (process.env.TWILIO_PHONE_NUMBER) {
  console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);
}

console.log('\n📋 Estado del sistema:');
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
  if (process.env.TWILIO_ACCOUNT_SID === 'your-twilio-account-sid') {
    console.log('⚠️  Twilio configurado pero con valores de ejemplo. Reemplaza con valores reales.');
  } else {
    console.log('✅ SMS automático habilitado con Twilio');
  }
} else {
  console.log('⚠️  SMS automático deshabilitado. Se usará simulación.');
  console.log('💡 Para habilitar SMS real, configura las variables de Twilio.');
}

console.log('\n📖 Instrucciones:');
console.log('1. Copia el archivo env.example a .env');
console.log('2. Reemplaza los valores con tus credenciales reales de Twilio');
console.log('3. Reinicia el servidor: npm run dev');
console.log('4. Ejecuta este script para verificar: node scripts/check-env.js');

console.log('\n=== FIN VERIFICACIÓN ==='); 
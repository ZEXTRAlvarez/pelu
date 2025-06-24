import { NextRequest, NextResponse } from 'next/server';

// Función para enviar SMS usando Twilio (300 SMS gratuitos por mes)
async function sendSMSWithTwilio(phone: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER; // Número de teléfono de Twilio

  console.log('Debug - Variables de entorno Twilio:');
  console.log('TWILIO_ACCOUNT_SID:', accountSid ? 'Configurado' : 'NO CONFIGURADO');
  console.log('TWILIO_AUTH_TOKEN:', authToken ? 'Configurado' : 'NO CONFIGURADO');
  console.log('TWILIO_PHONE_NUMBER:', fromNumber ? 'Configurado' : 'NO CONFIGURADO');

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Configuración de Twilio incompleta. Verifica las variables de entorno en el archivo .env');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: fromNumber,
      To: `+${phone}`,
      Body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error de Twilio: ${error}`);
  }

  return await response.json();
}

// Función para enviar SMS usando servicios gratuitos alternativos
async function sendSMSWithFreeService(phone: string, message: string) {
  // Simulamos el envío para desarrollo
  console.log('=== SMS SIMULADO ===');
  console.log(`Para: ${phone}`);
  console.log(`Mensaje: ${message}`);
  console.log('===================');
  
  return {
    success: true,
    message: 'SMS enviado (simulado)',
    sid: 'simulated_sms_id'
  };
}

export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();

    if (!phone || !message) {
      return new NextResponse('Teléfono y mensaje son requeridos', { status: 400 });
    }

    console.log('=== INICIO ENVÍO SMS ===');
    console.log('Teléfono:', phone);
    console.log('Mensaje:', message);

    let result;
    
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'your-twilio-account-sid') {
      // Usar Twilio (300 SMS gratuitos por mes)
      console.log('Usando Twilio para envío real...');
      result = await sendSMSWithTwilio(phone, message);
    } else {
      // Usar servicio gratuito alternativo (simulación)
      console.log('Usando simulación de SMS...');
      result = await sendSMSWithFreeService(phone, message);
    }

    console.log('=== FIN ENVÍO SMS ===');

    return NextResponse.json({
      success: true,
      message: 'SMS enviado exitosamente',
      result
    });

  } catch (error) {
    console.error('Error al enviar SMS:', error);
    return new NextResponse(
      `Error al enviar SMS: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';

// Opción 1: Usando Twilio WhatsApp API
async function sendWhatsAppWithTwilio(phone: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Número de WhatsApp de Twilio

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Configuración de Twilio incompleta');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: `whatsapp:${fromNumber}`,
      To: `whatsapp:+${phone}`,
      Body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error de Twilio: ${error}`);
  }

  return await response.json();
}

// Opción 2: Usando WhatsApp Business API (Meta)
async function sendWhatsAppWithMeta(phone: string, message: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error('Configuración de WhatsApp Business API incompleta');
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'text',
      text: { body: message },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error de WhatsApp Business API: ${error}`);
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const { phone, message } = await request.json();

    if (!phone || !message) {
      return new NextResponse('Teléfono y mensaje son requeridos', { status: 400 });
    }

    // Elegir el servicio a usar basado en las variables de entorno
    let result;
    
    if (process.env.TWILIO_ACCOUNT_SID) {
      // Usar Twilio
      result = await sendWhatsAppWithTwilio(phone, message);
    } else if (process.env.WHATSAPP_ACCESS_TOKEN) {
      // Usar WhatsApp Business API
      result = await sendWhatsAppWithMeta(phone, message);
    } else {
      // Fallback: solo abrir WhatsApp Web
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      return NextResponse.json({
        success: true,
        message: 'WhatsApp Web abierto',
        url: whatsappUrl,
        note: 'Configura las variables de entorno para envío automático'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      result
    });

  } catch (error) {
    console.error('Error al enviar mensaje de WhatsApp:', error);
    return new NextResponse(
      `Error al enviar mensaje: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      { status: 500 }
    );
  }
} 
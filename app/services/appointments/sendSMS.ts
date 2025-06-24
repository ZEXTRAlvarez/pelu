// Función para enviar SMS usando Twilio (300 SMS gratuitos por mes)
export async function sendSMSMessage(phone: string, message: string) {
  try {
    // Formatear el número de teléfono para SMS (agregar código de país si es necesario)
    const formattedPhone = phone.startsWith('54') ? phone : `54${phone}`;
    
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formattedPhone,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error('Error al enviar SMS');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    throw error;
  }
}

export function generateConfirmationMessage(clientName: string, date: string, time: string, confirmationLink: string) {
  // Mensaje breve para cuenta trial de Twilio (máximo ~140 caracteres)
  return `Turno: ${date} ${time}. Confirmá: ${confirmationLink}`;
}

// Función alternativa con más información pero compacta
export function generateDetailedConfirmationMessage(clientName: string, date: string, time: string, confirmationLink: string) {
  // Versión más detallada pero aún compacta
  return `Hola ${clientName}! Turno ${date} ${time}. Confirmá: ${confirmationLink}`;
} 
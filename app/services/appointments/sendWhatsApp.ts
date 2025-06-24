// Función para enviar mensaje usando WhatsApp Business API
export async function sendWhatsAppMessageAPI(phone: string, message: string) {
  try {
    // Formatear el número de teléfono para WhatsApp (agregar código de país si es necesario)
    const formattedPhone = phone.startsWith('54') ? phone : `54${phone}`;
    
    // Aquí necesitarías configurar las credenciales de WhatsApp Business API
    const response = await fetch('/api/send-whatsapp', {
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
      throw new Error('Error al enviar mensaje de WhatsApp');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar mensaje de WhatsApp:', error);
    throw error;
  }
}

// Función temporal que abre WhatsApp Web (mientras se configura la API)
export async function sendWhatsAppMessage(phone: string, message: string) {
  try {
    // Formatear el número de teléfono para WhatsApp (agregar código de país si es necesario)
    const formattedPhone = phone.startsWith('54') ? phone : `54${phone}`;
    
    // Crear el mensaje de WhatsApp con el formato correcto
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp en una nueva ventana/pestaña
    window.open(whatsappUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error al enviar mensaje de WhatsApp:', error);
    return false;
  }
}

export function generateConfirmationMessage(clientName: string, date: string, time: string, confirmationLink: string) {
  return `Hola ${clientName}! 

Turno agendado con éxito, recordá confirmar el turno, de lo contrario el mismo sera eliminado en 24hs.

📅 Fecha: ${date}
⏰ Horario: ${time}

Link para confirmar turno: ${confirmationLink}

¡Gracias por elegirnos!`;
} 
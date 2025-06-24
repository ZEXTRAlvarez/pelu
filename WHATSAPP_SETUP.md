# Configuración de WhatsApp Automático

Para que la aplicación envíe mensajes de WhatsApp automáticamente, necesitas configurar uno de estos servicios:

## Opción 1: WhatsApp Business API (Meta) - RECOMENDADA

### Pasos:
1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Crea una aplicación
3. Configura WhatsApp Business API
4. Obtén tu `Access Token` y `Phone Number ID`

### Variables de entorno necesarias:
```env
WHATSAPP_ACCESS_TOKEN="tu-access-token"
WHATSAPP_PHONE_NUMBER_ID="tu-phone-number-id"
```

## Opción 2: Twilio WhatsApp API

### Pasos:
1. Ve a [Twilio](https://www.twilio.com/)
2. Crea una cuenta
3. Activa WhatsApp Sandbox
4. Obtén tu `Account SID`, `Auth Token` y número de WhatsApp

### Variables de entorno necesarias:
```env
TWILIO_ACCOUNT_SID="tu-account-sid"
TWILIO_AUTH_TOKEN="tu-auth-token"
TWILIO_WHATSAPP_NUMBER="tu-numero-whatsapp"
```

## Opción 3: Servicios de terceros

### Alternativas populares:
- **MessageBird**: https://messagebird.com/
- **Vonage**: https://www.vonage.com/
- **360dialog**: https://www.360dialog.com/

## Configuración actual

Si no configuras ninguna de estas opciones, el sistema:
1. Creará el turno normalmente
2. Mostrará un mensaje indicando que se abrió WhatsApp Web
3. El usuario deberá enviar el mensaje manualmente

## Prueba de funcionamiento

Una vez configurado, cuando crees un turno:
1. Se enviará automáticamente el mensaje al cliente
2. El cliente recibirá el link de confirmación
3. Podrá confirmar su turno desde el link

## Costos aproximados

- **WhatsApp Business API**: ~$0.005 por mensaje
- **Twilio**: ~$0.005 por mensaje
- **Otros servicios**: Varían entre $0.003-$0.01 por mensaje

## Notas importantes

- Los números de teléfono deben incluir código de país (ej: 54 para Argentina)
- El formato debe ser: 3547599999 (sin 0 y sin 15)
- Los mensajes tienen un límite de 4096 caracteres
- Se recomienda probar primero en modo sandbox 
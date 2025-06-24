# Configuración de SMS Automático (GRATUITO)

Para que la aplicación envíe mensajes de texto automáticamente, tienes varias opciones gratuitas:

## Opción 1: Twilio SMS (RECOMENDADA) - 300 SMS GRATUITOS por mes

### Pasos:
1. Ve a [Twilio](https://www.twilio.com/)
2. Crea una cuenta gratuita
3. Verifica tu número de teléfono
4. Obtén tu `Account SID`, `Auth Token` y número de teléfono

### Variables de entorno necesarias:
```env
TWILIO_ACCOUNT_SID="tu-account-sid"
TWILIO_AUTH_TOKEN="tu-auth-token"
TWILIO_PHONE_NUMBER="tu-numero-twilio"
```

### Ventajas:
- ✅ 300 SMS gratuitos por mes
- ✅ Fácil configuración
- ✅ Confiable y estable
- ✅ Soporte en español

## Opción 2: Servicios gratuitos por región

### Argentina:
- **Claro SMS API**: Para clientes de Claro
- **Personal SMS**: Para clientes de Personal
- **Movistar SMS**: Para clientes de Movistar

### Otros países:
- **TextLocal** (India): 100 SMS gratuitos
- **MSG91** (India): 100 SMS gratuitos
- **BulkSMS** (Sudáfrica): 100 SMS gratuitos

## Opción 3: Simulación (para desarrollo)

Si no configuras ningún servicio, el sistema:
1. Creará el turno normalmente
2. Mostrará el mensaje en la consola del servidor
3. Simulará el envío del SMS

## Configuración de Twilio (Paso a paso)

### 1. Crear cuenta en Twilio
1. Ve a https://www.twilio.com/
2. Haz clic en "Sign up for free"
3. Completa el formulario
4. Verifica tu número de teléfono

### 2. Obtener credenciales
1. Ve al Dashboard
2. Copia tu `Account SID`
3. Copia tu `Auth Token`
4. Ve a "Phone Numbers" y copia tu número

### 3. Configurar variables de entorno
Agrega esto a tu archivo `.env`:
```env
TWILIO_ACCOUNT_SID="tu-account-sid-real"
TWILIO_AUTH_TOKEN="tu-auth-token-real"
TWILIO_PHONE_NUMBER="tu-numero-real"
```

### 4. Reiniciar el servidor
```bash
npm run dev
```

## Prueba de funcionamiento

Una vez configurado, cuando crees un turno:
1. Se enviará automáticamente un SMS al cliente
2. El cliente recibirá el link de confirmación
3. Podrá confirmar su turno desde el link

## Costos

- **Twilio**: 300 SMS gratuitos por mes, luego $0.0079 por SMS
- **Otros servicios**: Varían, pero muchos ofrecen planes gratuitos

## Notas importantes

- Los números de teléfono deben incluir código de país (ej: 54 para Argentina)
- El formato debe ser: 3547599999 (sin 0 y sin 15)
- Los SMS tienen un límite de 160 caracteres
- Se recomienda probar primero con tu propio número

## Solución de problemas

### Error: "Configuración de Twilio incompleta"
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que los valores sean correctos

### Error: "Número no verificado"
- En Twilio, verifica tu número de teléfono
- Para números de prueba, solo puedes enviar a números verificados

### SMS no llegan
- Verifica que el número tenga el código de país correcto
- Asegúrate de que el número esté activo
- Revisa los logs del servidor para errores 
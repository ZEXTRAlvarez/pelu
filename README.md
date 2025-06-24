# Agenda Peluquería

Sistema de gestión de turnos para peluquerías con confirmación automática por SMS.

## Funcionalidades

### ✅ Implementadas

1. **Validación de teléfono**: 
   - Exactamente 10 dígitos numéricos
   - Formato requerido: 3547599999 (sin 0 y sin 15)
   - Validación en tiempo real con mensajes de error

2. **Envío automático de SMS**:
   - Al crear un turno, se envía automáticamente un SMS al cliente
   - El mensaje incluye:
     - Confirmación del turno agendado
     - Fecha y horario del turno
     - Link para confirmar el turno
     - Advertencia de eliminación en 24hs si no se confirma
   - **Configuración requerida**: Ver `SMS_SETUP.md`

3. **Sistema de confirmación de turnos**:
   - Página dedicada para confirmar turnos
   - Link único por turno
   - Interfaz amigable para el cliente

4. **Limpieza automática de turnos no confirmados**:
   - Script para eliminar turnos no confirmados después de 24 horas
   - Se puede ejecutar manualmente o programar

## Instalación

```bash
npm install
npm run postinstall
```

## Configuración

1. Configura las variables de entorno en `.env`
2. Ejecuta las migraciones: `npx prisma migrate dev`
3. **Configura SMS automático**: Ver `SMS_SETUP.md`
4. Inicia el servidor: `npm run dev`

## Variables de entorno necesarias

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# URL base de la aplicación (para links de confirmación)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Twilio SMS (300 SMS gratuitos por mes)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="your-twilio-phone-number"
```

## Uso

### Limpieza de turnos no confirmados

Para ejecutar manualmente la limpieza de turnos no confirmados:

```bash
npm run cleanup-appointments
```

### Programación automática

Para programar la limpieza automática, puedes usar cron (Linux/Mac) o Task Scheduler (Windows):

**Cron (cada hora):**
```bash
0 * * * * cd /path/to/agenda-peluqueria && npm run cleanup-appointments
```

**Task Scheduler (Windows):**
1. Abrir Task Scheduler
2. Crear tarea básica
3. Programar para ejecutar cada hora
4. Acción: iniciar programa
5. Programa: `npm`
6. Argumentos: `run cleanup-appointments`
7. Iniciar en: `C:\path\to\agenda-peluqueria`

## Estructura del proyecto

```
agenda-peluqueria/
├── app/
│   ├── (private)/agenda/          # Página principal de agenda
│   ├── confirm-appointment/[id]/  # Página de confirmación
│   ├── api/
│   │   ├── appointments/          # API de turnos
│   │   ├── send-sms/              # API de envío de SMS
│   │   └── cleanup-appointments/  # API de limpieza
│   └── services/
│       └── appointments/          # Servicios de turnos
├── scripts/
│   └── cleanup-appointments.js    # Script de limpieza
├── prisma/
│   └── schema.prisma              # Esquema de base de datos
├── SMS_SETUP.md                   # Configuración de SMS
└── README.md                      # Este archivo
```

## Tecnologías utilizadas

- **Frontend**: Next.js 15, React 19, Material-UI
- **Backend**: Next.js API Routes
- **Base de datos**: SQLite con Prisma
- **Autenticación**: NextAuth.js
- **SMS**: Twilio SMS API (300 SMS gratuitos por mes)

## Notas importantes

- Los turnos no confirmados se eliminan automáticamente después de 24 horas
- **SMS automático requiere configuración**: Ver `SMS_SETUP.md`
- Los clientes deben confirmar sus turnos para mantenerlos activos
- La validación de teléfono es estricta: exactamente 10 dígitos numéricos
- **Costo**: 300 SMS gratuitos por mes con Twilio, luego $0.0079 por SMS

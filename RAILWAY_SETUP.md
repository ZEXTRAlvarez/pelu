# Configuración en Railway

## Variables de Entorno Requeridas

En Railway, necesitas configurar las siguientes variables de entorno en la sección "Variables" de tu proyecto:

### 1. Base de Datos PostgreSQL
```
DATABASE_URL=tu-url-de-postgresql-de-railway
```

**IMPORTANTE:** En Railway, debes usar PostgreSQL, NO SQLite. La URL debe comenzar con `postgresql://`

### 2. NextAuth (Autenticación)
```
NEXTAUTH_URL=https://pelu-production.up.railway.app
NEXTAUTH_SECRET=tu-secret-key-muy-seguro
```

### 3. Google OAuth
```
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

### 4. URL de la Aplicación
```
NEXT_PUBLIC_APP_URL=https://pelu-production.up.railway.app
```

### 5. Twilio SMS (Opcional)
```
TWILIO_ACCOUNT_SID=tu-account-sid
TWILIO_AUTH_TOKEN=tu-auth-token
TWILIO_PHONE_NUMBER=tu-numero-twilio
```

## Pasos para Configurar

### 1. Configurar Base de Datos PostgreSQL en Railway

1. En Railway, crea un nuevo servicio de **PostgreSQL**
2. Copia la URL de conexión que te proporciona Railway
3. Usa esa URL como `DATABASE_URL` en las variables de entorno

### 2. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth 2.0"
5. Configura las URIs autorizadas:
   - URI de origen: `https://pelu-production.up.railway.app`
   - URI de redirección: `https://pelu-production.up.railway.app/api/auth/callback/google`
6. Copia el Client ID y Client Secret

### 3. Generar NEXTAUTH_SECRET

Ejecuta este comando para generar un secret seguro:
```bash
openssl rand -base64 32
```

### 4. Configurar la Base de Datos

**IMPORTANTE:** Después de configurar las variables, debes ejecutar las migraciones para crear las tablas.

#### Opción A: Usando el script automático (Recomendado)
```bash
railway run npm run setup-db
```

#### Opción B: Manualmente
```bash
# Generar cliente de Prisma
railway run npx prisma generate --schema=./prisma/schema.production.prisma

# Ejecutar migraciones
railway run npx prisma migrate deploy --schema=./prisma/schema.production.prisma
```

#### Opción C: Desde el dashboard de Railway
1. Ve a la pestaña "Deployments"
2. Haz clic en "Deploy" para que se ejecuten las migraciones automáticamente

### 5. Verificar la Configuración

Para verificar que todo está configurado correctamente:

```bash
# Verificar variables de entorno
railway run npm run check-env

# Verificar base de datos
railway run npm run check-db
```

## Verificación

Para verificar que todo está configurado correctamente:

1. Ve a tu aplicación en Railway
2. Intenta iniciar sesión con Google
3. Revisa los logs en Railway para ver si hay errores

## Solución de Problemas

### Error "The table `public.User` does not exist"

Este error indica que las migraciones no se han ejecutado. Solución:

1. **Verifica que `DATABASE_URL` sea una URL de PostgreSQL**, no SQLite
2. **Ejecuta las migraciones**:
   ```bash
   railway run npm run setup-db
   ```
3. **Verifica que las tablas se crearon**:
   ```bash
   railway run npm run check-db
   ```

### Error de Base de Datos SQLite

Si ves el error "the URL must start with the protocol `file:`":

1. **Verifica que `DATABASE_URL` sea una URL de PostgreSQL**, no SQLite
2. **Asegúrate de que la URL comience con `postgresql://`**
3. **Ejecuta las migraciones de PostgreSQL**:
   ```bash
   railway run npm run setup-db
   ```

### Error 500 en Autenticación

Si sigues teniendo error 500:

1. Verifica que todas las variables de entorno estén configuradas
2. Asegúrate de que `NEXTAUTH_URL` coincida exactamente con tu URL de Railway
3. Verifica que las credenciales de Google sean correctas
4. Revisa los logs en Railway para más detalles

### Error de Migraciones

Si hay problemas con las migraciones:

1. Verifica que `DATABASE_URL` sea correcta
2. Ejecuta `railway run npm run setup-db`
3. Verifica que la base de datos esté activa

## Comandos Útiles

Para ejecutar comandos en Railway:

```bash
# Configurar base de datos completa
railway run npm run setup-db

# Verificar base de datos
railway run npm run check-db

# Verificar variables de entorno
railway run npm run check-env

# Ejecutar migraciones de PostgreSQL
railway run npx prisma migrate deploy --schema=./prisma/schema.production.prisma

# Generar cliente de Prisma para PostgreSQL
railway run npx prisma generate --schema=./prisma/schema.production.prisma

# Ver logs
railway logs

# Conectar a la base de datos
railway connect
```

## Estructura de Archivos

La aplicación usa dos schemas de Prisma:
- `prisma/schema.prisma` - Para desarrollo local (SQLite)
- `prisma/schema.production.prisma` - Para producción (PostgreSQL)

En Railway, automáticamente se usa el schema de producción. 
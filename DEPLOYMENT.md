# Guía de Despliegue en Vercel

## 🚀 Despliegue Automático (Recomendado)

### 1. Preparar el repositorio

1. **Sube tu código a GitHub:**
```bash
git add .
git commit -m "Preparar para despliegue"
git push origin main
```

2. **Asegúrate de que tu repositorio esté público o que tengas Vercel Pro**

### 2. Desplegar en Vercel

1. **Ve a [vercel.com](https://vercel.com)**
2. **Haz clic en "New Project"**
3. **Importa tu repositorio de GitHub**
4. **Configura el proyecto:**
   - Framework Preset: Next.js
   - Root Directory: `./` (por defecto)
   - Build Command: `npm run build` (por defecto)
   - Output Directory: `.next` (por defecto)
   - Install Command: `npm install` (por defecto)

### 3. Configurar Variables de Entorno

En la configuración del proyecto en Vercel, agrega estas variables:

```env
# Base de datos (PostgreSQL)
DATABASE_URL="postgresql://usuario:password@host:puerto/database"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.vercel.app"
NEXTAUTH_SECRET="tu-secret-key-muy-seguro"

# URL base de la aplicación
NEXT_PUBLIC_APP_URL="https://tu-dominio.vercel.app"

# Twilio SMS
TWILIO_ACCOUNT_SID="tu-twilio-account-sid"
TWILIO_AUTH_TOKEN="tu-twilio-auth-token"
TWILIO_PHONE_NUMBER="tu-twilio-phone-number"
```

### 4. Configurar Base de Datos

#### Opción A: Vercel Postgres (Recomendado)
1. En tu proyecto de Vercel, ve a "Storage"
2. Crea una nueva base de datos PostgreSQL
3. Copia la URL de conexión
4. Agrégala como `DATABASE_URL`

#### Opción B: Base de datos externa
- **Neon**: https://neon.tech
- **Supabase**: https://supabase.com
- **PlanetScale**: https://planetscale.com

### 5. Configurar Dominio Personalizado (Opcional)

1. En la configuración del proyecto
2. Ve a "Domains"
3. Agrega tu dominio personalizado
4. Actualiza `NEXTAUTH_URL` y `NEXT_PUBLIC_APP_URL`

## 🔧 Configuración Manual

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Login en Vercel

```bash
vercel login
```

### 3. Desplegar

```bash
vercel
```

### 4. Configurar variables de entorno

```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXT_PUBLIC_APP_URL
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_PHONE_NUMBER
```

## 📋 Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL configurada
- [ ] Dominio configurado (si aplica)
- [ ] Twilio configurado para SMS
- [ ] Pruebas realizadas en producción

## 🛠️ Solución de Problemas

### Error de Build
- Verifica que todas las dependencias estén `package.json`
- Revisa los logs de build en Vercel

### Error de Base de Datos
- Verifica la URL de conexión
- Asegúrate de que la base de datos esté accesible desde Vercel

### Error de Variables de Entorno
- Verifica que todas las variables estén configuradas
- Usa `vercel env ls` para listar las variables

### Error de NextAuth
- Verifica que `NEXTAUTH_URL` coincida con tu dominio
- Asegúrate de que `NEXTAUTH_SECRET` sea seguro

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. **Haz cambios en tu código**
2. **Sube a GitHub:**
```bash
git add .
git commit -m "Actualización"
git push origin main
```
3. **Vercel se actualiza automáticamente**

## 📊 Monitoreo

- **Logs**: Ve a tu proyecto en Vercel → Functions → Logs
- **Analytics**: Vercel Analytics (si está habilitado)
- **Performance**: Vercel Speed Insights

## 💰 Costos

- **Vercel Hobby**: Gratis (con limitaciones)
- **Vercel Pro**: $20/mes
- **Base de datos**: Varía según el proveedor
- **Twilio**: 300 SMS gratuitos/mes, luego $0.0079 por SMS 
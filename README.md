# ReUsa.ve

Marketplace de segunda mano para Venezuela. Nació como respuesta al sismo de 2026 — un lugar donde la gente pueda donar lo que no usa, vender a precios solidarios y encontrar lo que necesita sin comisiones ni intermediarios.

Está hecho con Next.js 14, Supabase y Tailwind. Mobile-first, funciona como PWA.

---

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Configuración

### Variables de entorno

Copia el archivo de ejemplo y completa con los datos de tu proyecto Supabase:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Los valores los encuentras en tu proyecto Supabase → **Settings → API**.

### Base de datos

Ejecuta el schema en el SQL Editor de Supabase:

```
supabase_schema.sql
```

### Autenticación

En Supabase → **Authentication → Emails → SMTP Settings**, configura Resend (o cualquier proveedor SMTP) para que los códigos OTP lleguen bien y no vayan a spam.

En **Authentication → URL Configuration**:
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

### Storage

Crea dos buckets en Supabase → **Storage**:
- `listing-images` (público)
- `avatars` (público)

---

## Deploy

El proyecto está listo para Vercel. Conecta el repositorio, agrega las variables de entorno y listo. El dominio de producción va en `NEXT_PUBLIC_SITE_URL`.

---

## Lo que viene

- Chat entre usuarios
- Notificaciones push
- Búsqueda por ubicación (PostGIS)
- Valoraciones de vendedores
- App en Play Store y App Store vía PWA

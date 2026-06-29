# ReUsa.ve — MVP Setup

Marketplace de segunda mano para Venezuela. PWA mobile-first con Next.js 14 + Supabase.

---

## 1. Instalar dependencias

```bash
npm install
```

## 2. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) (gratis)
2. Ve a **SQL Editor** y ejecuta todo el contenido de `supabase_schema.sql`
3. En **Authentication > Providers**, activa:
   - **Email** (Magic Link) ✅
   - **Google** (necesitas Client ID y Secret de Google Cloud Console)

## 3. Variables de entorno

Copia `.env.local.example` a `.env.local` y completa:

```bash
cp .env.local.example .env.local
```

Obtén los valores en tu proyecto Supabase: **Settings > API**

```
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

## 4. ⚠️ IMPORTANTE: Renombrar carpeta de ruta dinámica

Next.js usa corchetes para rutas dinámicas. Después de clonar, renombra:

```bash
mv src/app/listings/id src/app/listings/[id]
```

## 5. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 6. Deploy en Vercel

```bash
npm install -g vercel
vercel
```

Agrega las variables de entorno en el dashboard de Vercel.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              # Home feed
│   ├── auth/login/           # Login (Magic Link + Google)
│   ├── listings/
│   │   ├── new/              # Crear publicación
│   │   └── [id]/             # Detalle de publicación
│   ├── profile/              # Perfil del usuario
│   └── api/auth/signout/     # Endpoint de logout
├── components/
│   ├── layout/               # Navbar, BottomNav
│   └── listings/             # ListingCard, CategoryFilter
├── lib/
│   ├── supabase.ts           # Cliente browser
│   ├── supabase-server.ts    # Cliente servidor
│   ├── utils.ts              # Helpers
│   └── image-compress.ts     # Compresión en cliente
└── types/index.ts            # TypeScript types
```

---

## Próximas funcionalidades (Fase 2)

- [ ] Búsqueda por radio de distancia (PostGIS ya está configurado)
- [ ] Chat interno (tabla `conversations` ya existe en DB)
- [ ] Sistema de valoraciones (tabla `ratings` ya existe en DB)
- [ ] Favoritos / guardados
- [ ] Moderación de contenido
- [ ] Notificaciones push (PWA)

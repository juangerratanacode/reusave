# ReUsa.ve

Marketplace de segunda mano para Venezuela. Nació como respuesta al sismo de 2026 — un lugar donde la gente pueda donar lo que no usa, vender a precios solidarios y encontrar lo que necesita sin comisiones ni intermediarios.

Hecho con Next.js 14, Supabase y Tailwind. Mobile-first, funciona como PWA.

---

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Configuración

Copia `.env.local.example` a `.env.local` y completa con los datos de tu proyecto. Nunca subas ese archivo al repositorio.

Las instrucciones completas de configuración (Supabase, SMTP, Storage, variables) están en [`docs/setup.md`](docs/setup.md).

---

## Deploy

El proyecto está listo para Vercel. Conecta el repositorio y agrega las variables de entorno desde el dashboard de Vercel — nunca en el código.

---

## Lo que viene

- Chat entre usuarios
- Notificaciones push
- Búsqueda por ubicación
- Valoraciones de vendedores
- App en Play Store y App Store vía PWA

import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'
import { ArrowLeft } from 'lucide-react'

const CORAL = '#FF5A38'
const VERDE = '#0FA46A'
const TINTA = '#15221B'
const PAPEL = '#F5F0E5'

const CAT_COLORS = [
  '#FFF0EC', '#E8F7EF', '#EFF6FF', '#FEF9EC',
  '#F5F0FF', '#FFF5EC', '#ECFDF5', '#FEF2F2',
  '#F0FAFB', '#FDF4FF',
]

const STATS = [
  { value: '+24', unit: 'estados', sub: 'Venezuela entera' },
  { value: '$0', unit: 'para publicar', sub: 'Siempre gratis' },
  { value: '0%', unit: 'comisión', sub: 'Sin intermediarios' },
]

const VALUES = [
  { emoji: '🤝', title: 'Comunidad primero', desc: 'Somos vecinos ayudando vecinos. Cada publicación conecta a dos familias venezolanas.' },
  { emoji: '🌱', title: 'Economía circular', desc: 'Lo que no usas tiene valor para alguien más. Reducimos el desperdicio juntos.' },
  { emoji: '🔒', title: 'Sin intermediarios', desc: 'Vendedor y comprador se contactan directo por WhatsApp. Sin comisiones ocultas.' },
  { emoji: '🇻🇪', title: 'Hecho para Venezuela', desc: 'Pensado para la realidad del venezolano: precios en dólares, los 24 estados.' },
]

export default async function CommunityPage() {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, icon, slug')
    .eq('is_active', true)
    .order('sort_order')

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPEL }}>

      {/* Minimal header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/8 px-4 h-14 flex items-center gap-3">
        <Link href="/feed" className="p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5" style={{ color: TINTA }} />
        </Link>
        <Link href="/feed" className="font-display font-bold text-lg tracking-tight" style={{ color: TINTA }}>
          resuel<span style={{ color: CORAL }}>✓</span>e
        </Link>
      </header>

      <main className="pt-14 pb-28">

        {/* ── HERO ── */}
        <section style={{ position: 'relative', height: '420px', overflow: 'hidden', backgroundColor: VERDE }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seccion-familia.jpg"
            alt="Comunidad Resuelve"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Overlay verde */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,164,106,0.75)' }} />

          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', maxWidth: '768px', margin: '0 auto' }}>
            <span className="inline-block text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">Sobre nosotros</span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              Somos tu comunidad,<br />
              la <span style={{ color: '#A7F3D0' }}>Comunidad Resuelve.</span>
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
              Un espacio donde venezolanos se ayudan entre sí. Compra, vende, dona e intercambia sin comisiones ni intermediarios.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/listings/new"
                className="font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
                style={{ backgroundColor: CORAL, color: 'white' }}
              >
                Publicar gratis
              </Link>
              <Link
                href="/feed"
                className="font-bold px-6 py-3 rounded-xl text-sm border border-white/30 text-white hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
              >
                Ver publicaciones
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-white border-b border-black/8">
          <div className="max-w-3xl mx-auto px-5">
            <div className="grid grid-cols-3 divide-x divide-black/6">
              {STATS.map(s => (
                <div key={s.value} className="py-8 text-center px-4">
                  <p className="font-accent text-3xl sm:text-4xl leading-none" style={{ color: VERDE }}>{s.value}</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: TINTA }}>{s.unit}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FRASE MOTIVACIONAL con imagen de fondo ── */}
        <section style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seccion-familia.jpg"
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.50)' }} />
          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
            <blockquote className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', lineHeight: 1.4, maxWidth: '560px' }}>
              "Donde una familia vende lo que no usa, otra encuentra lo que necesita."
            </blockquote>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.60)', marginTop: '16px' }}>— La filosofía detrás de Resuelve</p>
          </div>
        </section>

        {/* ── CATEGORÍAS ── */}
        <section className="py-10 px-4 sm:px-6 max-w-3xl mx-auto">
          <h2 className="font-display text-xl font-bold mb-2 text-center" style={{ color: TINTA }}>Encuentra de todo</h2>
          <p className="text-sm text-center mb-8" style={{ color: '#9CA3AF' }}>Desde electrónica hasta ropa. Todas las categorías, en un solo lugar.</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {(categories ?? []).map((cat, i) => (
              <Link
                key={cat.id}
                href={`/feed?category=${cat.slug}`}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 aspect-square border border-black/6 hover:scale-105 transition-transform cursor-pointer"
                style={{ backgroundColor: CAT_COLORS[i % CAT_COLORS.length] }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-center leading-tight" style={{ color: TINTA }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── VALORES ── */}
        <section className="py-12 bg-white border-t border-b border-black/8">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="font-display text-xl font-bold mb-8 text-center" style={{ color: TINTA }}>Nuestros valores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map(v => (
                <div key={v.title} className="flex gap-4 p-5 rounded-2xl border border-black/8" style={{ backgroundColor: PAPEL }}>
                  <span className="text-2xl shrink-0">{v.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: TINTA }}>{v.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL con imagen de fondo ── */}
        <section style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seccion-vende.jpg"
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.48)' }} />
          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center', gap: '12px' }}>
            <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.2, margin: 0 }}>¿Tienes algo que ya no usas?</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: 0 }}>Publícalo gratis. Sin comisiones. En menos de 2 minutos desde tu teléfono.</p>
            <a href="/listings/new" style={{ backgroundColor: CORAL, color: 'white', fontWeight: 700, padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '1rem' }}>
              Publicar gratis →
            </a>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-black/8 py-6 mx-4 sm:mx-6">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-display font-bold text-sm" style={{ color: TINTA }}>
              resuel<span style={{ color: CORAL }}>✓</span>e
            </span>
            <p className="text-xs" style={{ color: '#B0A89E' }}>
              entrayresuelve.com · Hecho con ❤️ para Venezuela · 2026
            </p>
          </div>
        </footer>
      </main>

      <BottomNav />
    </div>
  )
}

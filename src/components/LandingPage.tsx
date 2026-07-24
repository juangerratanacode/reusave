'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Plus, X, MapPin, ArrowRight, ShieldCheck, Zap, Users, Star } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice, timeAgo } from '@/lib/utils'
import BottomNav from '@/components/layout/BottomNav'

const CORAL = '#FF5A38'
const VERDE = '#0FA46A'
const TINTA = '#15221B'
const PAPEL = '#F5F0E5'

type Props = {
  listings: any[]
  categories: any[]
  searchParams: { q?: string; state?: string; category?: string }
}

export default function LandingPage({ listings, categories, searchParams }: Props) {
  const [q, setQ] = useState(searchParams.q ?? '')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    router.push(`/?${params.toString()}`)
  }

  const hasFilters = searchParams.q || searchParams.state || searchParams.category
  const showEmpty = hasFilters && listings.length === 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPEL }}>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <span className="font-display font-bold text-lg tracking-tight shrink-0" style={{ color: TINTA }}>
            resuel<span style={{ color: CORAL }}>✓</span>e
          </span>

          {/* Search bar desktop */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Busca artículos, categorías..."
              className="w-full bg-[#F5F2ED] border border-black/10 rounded-full pl-9 pr-8 py-2 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#FF5A38] focus:bg-white transition-colors"
              style={{ color: TINTA }}
            />
            {q && (
              <button type="button" onClick={() => { setQ(''); router.push('/') }} className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70">
                <X className="w-3.5 h-3.5" style={{ color: '#9CA3AF' }} />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/auth/login" className="hidden sm:block text-sm font-medium px-3 py-1.5 rounded-full border border-black/15 hover:border-black/30 transition-colors" style={{ color: '#6B7280' }}>
              Iniciar sesión
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center gap-1.5 text-white font-bold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
              style={{ backgroundColor: CORAL }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publicar gratis</span>
              <span className="sm:hidden">Publicar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO — imagen full width estilo Wallapop ── */}
      <div className="pt-14">
        <div className="relative w-full h-72 sm:h-96 lg:h-[480px]">
          <Image
            src="/hero.jpg"
            alt="Compra y vende lo que ya no usas"
            fill
            className="object-cover"
            style={{ objectPosition: 'center center' }}
            priority
            sizes="100vw"
          />
          {/* Gradient overlay para legibilidad del texto */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(15,27,19,0.72) 0%, rgba(15,27,19,0.3) 60%, transparent 100%)' }} />

          {/* Texto sobre la imagen */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-3 self-start" style={{ backgroundColor: 'rgba(239,77,40,0.9)', color: 'white' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Apoyo post-sismo Venezuela
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 drop-shadow-sm">
              Compra y vende<br />
              <span style={{ color: '#6EE7A0' }}>lo que ya no usas</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 mb-5 max-w-sm">
              El marketplace de segunda mano hecho para Venezuela. Sin comisiones. Sin intermediarios.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link
                href="/auth/signup"
                className="text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: CORAL }}
              >
                Publicar gratis
              </Link>
              <Link
                href="/feed"
                className="font-bold px-5 py-2.5 rounded-xl text-sm border border-white/40 text-white hover:bg-white/10 transition-colors"
              >
                Ver publicaciones
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH MOBILE ── */}
      <div className="sm:hidden px-4 py-3 bg-white border-b border-black/8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="¿Qué buscas?"
              className="w-full bg-[#F5F2ED] border border-black/10 rounded-full pl-9 pr-4 py-2 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#FF5A38] transition-colors"
              style={{ color: TINTA }}
            />
          </div>
          <button type="submit" className="text-white font-bold px-4 py-2 rounded-full text-sm shrink-0 hover:opacity-90" style={{ backgroundColor: CORAL }}>
            Buscar
          </button>
        </form>
      </div>

      {/* ── STATS BAR ── */}
      <div className="bg-white border-b border-black/8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-8 lg:gap-16">
          {[
            { n: '24', label: 'estados' },
            { n: '$0', label: 'para publicar' },
            { n: '0%', label: 'comisión' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center text-center gap-0.5">
              <span className="font-accent text-base" style={{ color: CORAL }}>{s.n}</span>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORÍAS ── */}
      <div className="bg-white border-b border-black/8">
        <div className="max-w-7xl mx-auto py-3 relative">
          {/* Degradado hint solo en mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none sm:hidden"
            style={{ background: 'linear-gradient(to right, transparent, white)' }} />

          {/* Mobile: scroll horizontal | Desktop: wrap en varias filas */}
          <div className="flex gap-2 px-4 sm:px-6 overflow-x-auto scrollbar-hide sm:overflow-x-visible sm:flex-wrap">
            <button
              onClick={() => router.push('/')}
              className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition-all"
              style={{
                backgroundColor: !searchParams.category ? CORAL : 'transparent',
                color: !searchParams.category ? 'white' : '#6B7280',
                borderColor: !searchParams.category ? CORAL : 'rgba(0,0,0,0.1)'
              }}
            >
              Todo
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => router.push(`/?category=${cat.slug}`)}
                className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition-all whitespace-nowrap"
                style={{
                  backgroundColor: searchParams.category === cat.slug ? CORAL : 'transparent',
                  color: searchParams.category === cat.slug ? 'white' : '#6B7280',
                  borderColor: searchParams.category === cat.slug ? CORAL : 'rgba(0,0,0,0.1)'
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── LISTINGS ── */}
      <section className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-base" style={{ color: TINTA }}>
            {hasFilters
              ? `${listings.length} resultado${listings.length !== 1 ? 's' : ''}${searchParams.q ? ` para "${searchParams.q}"` : ''}`
              : 'Publicaciones recientes'}
          </h2>
          {hasFilters && (
            <button onClick={() => { setQ(''); router.push('/') }} className="text-xs font-medium hover:opacity-70" style={{ color: CORAL }}>
              Limpiar filtros
            </button>
          )}
        </div>

        {showEmpty ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold" style={{ color: TINTA }}>Sin resultados</p>
            <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Intenta con otra búsqueda o categoría</p>
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {listings.map((listing) => {
                const cover = listing.listing_images?.find((i: any) => i.is_cover) ?? listing.listing_images?.[0]
                return (
                  <Link key={listing.id} href={`/listings/${listing.id}`} className="block group">
                    <article className="bg-white rounded-2xl overflow-hidden border border-black/8 hover:shadow-md transition-all group-active:scale-[0.98]">
                      <div className="relative aspect-square bg-[#F5F0E5]">
                        {cover
                          ? <Image src={cover.url} alt={listing.title} fill className="object-cover" sizes="(max-width:640px) 50vw, 200px" />
                          : <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                        }
                        {listing.is_urgent && (
                          <span className="absolute top-2 left-2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: CORAL }}>
                            URGENTE
                          </span>
                        )}
                      </div>
                      <div className="p-2.5">
                        <h3 className="text-sm font-medium line-clamp-2 leading-snug" style={{ color: TINTA }}>{listing.title}</h3>
                        <p className="text-sm font-black mt-0.5" style={{ color: VERDE }}>{formatPrice(listing.price)}</p>
                        {listing.city && (
                          <p className="text-[10px] mt-1 flex items-center gap-0.5" style={{ color: '#B0A89E' }}>
                            <MapPin className="w-2.5 h-2.5 shrink-0" />{listing.city}
                          </p>
                        )}
                        <p className="text-[10px] mt-0.5" style={{ color: '#C5BDB4' }}>{timeAgo(listing.created_at)}</p>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
            <div className="text-center mt-7">
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl border border-black/15 hover:border-black/30 transition-colors text-sm"
                style={{ color: TINTA }}
              >
                Ver todas las publicaciones <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="font-bold text-lg mb-1" style={{ color: TINTA }}>Sé el primero en publicar</p>
            <p className="text-sm mb-5" style={{ color: '#9CA3AF' }}>La comunidad está esperando artículos como el tuyo.</p>
            <Link href="/auth/signup" className="text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: CORAL }}>
              Publicar ahora — gratis
            </Link>
          </div>
        )}
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="py-12 bg-white border-t border-b border-black/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-xl font-bold mb-7 text-center" style={{ color: TINTA }}>¿Cómo funciona?</h2>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { n: '1', emoji: '📸', color: VERDE, title: 'Publica', desc: 'Sube fotos y precio en 2 minutos. Sin costo.' },
              { n: '2', emoji: '🔍', color: '#2563EB', title: 'Te descubren', desc: 'Compradores buscan por categoría o estado.' },
              { n: '3', emoji: '💬', color: '#25D366', title: 'Por WhatsApp', desc: 'Contacto directo. Sin intermediarios.' },
            ].map(s => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-sm" style={{ backgroundColor: `${s.color}18` }}>
                  {s.emoji}
                </div>
                <p className="font-black text-sm mb-1" style={{ color: TINTA }}>{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ RESUELVE ── */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 className="font-display text-xl font-bold mb-6 text-center" style={{ color: TINTA }}>Por qué elegirnos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <Zap className="w-5 h-5" style={{ color: CORAL }} />, bg: '#FDEEE9', title: 'Rápido y simple', desc: 'Publica en menos de 2 minutos desde tu teléfono.' },
            { icon: <ShieldCheck className="w-5 h-5" style={{ color: VERDE }} />, bg: '#E8F7EF', title: 'Confianza verificada', desc: 'Perfiles con reputación, fotos reales, contacto directo.' },
            { icon: <Users className="w-5 h-5" style={{ color: '#2563EB' }} />, bg: '#EFF6FF', title: 'Para Venezuela', desc: 'Precios en USD y Bs. Los 24 estados. Sin comisión.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-black/8 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.bg }}>
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-sm mb-0.5" style={{ color: TINTA }}>{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="py-10 bg-white border-t border-black/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-xl font-bold mb-6 text-center" style={{ color: TINTA }}>Lo que dice la comunidad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'María G.', city: 'Caracas', text: 'Vendí ropa que tenía guardada hace años. En un día tenía 3 compradores. Increíble.' },
              { name: 'Carlos M.', city: 'Maracay', text: 'Encontré una nevera en buen estado a mitad de precio. El contacto por WhatsApp fue directo y fácil.' },
              { name: 'Luisa R.', city: 'Valencia', text: 'Por fin un Wallapop venezolano. Sin comisiones raras, sin pasos complicados. Así se hace.' },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl p-5 border border-black/8" style={{ backgroundColor: PAPEL }}>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: '#FBBF24' }} />)}
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#4B5563' }}>"{t.text}"</p>
                <div>
                  <p className="text-xs font-bold" style={{ color: TINTA }}>{t.name}</p>
                  <p className="text-[10px]" style={{ color: '#9CA3AF' }}>{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL con imagen de fondo ── */}
      <section className="relative overflow-hidden border-t border-black/8">
        <img
          src="/seccion-vende.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.50)' }} />
        <div className="relative max-w-md mx-auto px-4 py-20 text-center">
          <span className="text-3xl mb-4 block">🇻🇪</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight text-white">
            ¿Tienes algo que ya no usas?
          </h2>
          <p className="text-sm mb-7 mt-2 text-white/75">Publícalo gratis. Sin comisiones. En menos de 2 minutos.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/auth/signup"
              className="text-white font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 w-full sm:w-auto justify-center"
              style={{ backgroundColor: CORAL }}
            >
              Publicar gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="font-bold px-7 py-3.5 rounded-xl border border-white/40 text-white hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ── IMAGEN COMUNIDAD ── */}
      <section className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80"
          alt="Comunidad Resuelve"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-end pb-8 text-center px-4">
          <h2 className="font-display text-white text-2xl sm:text-3xl font-bold mb-2">Hecho para Venezuela 🇻🇪</h2>
          <p className="text-white/80 text-sm sm:text-base">Conectamos a quienes tienen con quienes necesitan</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/8 py-6 mb-16 sm:mb-0" style={{ backgroundColor: '#E8E4DC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-sm" style={{ color: TINTA }}>
            resuel<span style={{ color: CORAL }}>✓</span>e
          </span>
          <nav className="flex items-center gap-5">
            <Link href="/community" className="text-xs font-medium hover:underline transition-colors" style={{ color: '#6B7280' }}>Comunidad</Link>
            <Link href="/community#como-funciona" className="text-xs font-medium hover:underline transition-colors" style={{ color: '#6B7280' }}>Cómo funciona</Link>
            <Link href="/listings/new" className="text-xs font-medium hover:underline transition-colors" style={{ color: CORAL }}>Publicar gratis</Link>
          </nav>
          <p className="text-xs text-center sm:text-right" style={{ color: '#B0A89E' }}>
            entrayresuelve.com · Hecho con ❤️ para Venezuela · 2026
          </p>
        </div>
      </footer>

      {/* Bottom nav mobile */}
      <div className="sm:hidden">
        <BottomNav />
      </div>
    </div>
  )
}

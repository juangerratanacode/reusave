'use client'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, ArrowRight, MapPin, ShieldCheck, Zap,
  Smartphone, Shirt, Sofa, Car, Wrench,
  Heart, Plus, ChevronRight, X, Package
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice, timeAgo } from '@/lib/utils'

const CORAL = '#EF4D28'
const VERDE = '#22A45D'
const TINTA = '#0F1B13'
const PAPEL = '#F0EDE6'

const ICON_MAP: Record<string, any> = {
  Smartphone, Shirt, Sofa, Car, Wrench, Heart, Package
}

function Logo({ size = 'text-xl' }: { size?: string }) {
  return (
    <span className={`font-black tracking-tight ${size}`} style={{ color: TINTA }}>
      resuel<span style={{ color: CORAL }}>✓</span>e
    </span>
  )
}

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

  const clearSearch = () => {
    setQ('')
    router.push('/')
  }

  const hasFilters = searchParams.q || searchParams.state || searchParams.category
  const showEmptyState = hasFilters && listings.length === 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPEL, color: TINTA }}>

      {/* ── NAVBAR — FIXED ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Logo />

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Busca artículos, categorías..."
              className="w-full bg-[#F5F2ED] border border-black/10 rounded-full pl-9 pr-8 py-2 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#EF4D28] focus:bg-white transition-colors"
              style={{ color: TINTA }}
            />
            {q && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70">
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
              className="flex items-center gap-1.5 text-white font-bold text-sm px-4 py-2 rounded-full transition-all hover:opacity-90"
              style={{ backgroundColor: CORAL }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Publicar gratis</span>
              <span className="sm:hidden">Entrar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-20 pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Badge emergencia */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 mt-4" style={{ backgroundColor: '#FDEEE9', color: CORAL, border: `1px solid #FBBFAA` }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: CORAL }} />
          Apoyo solidario post-sismo Venezuela
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4" style={{ color: TINTA }}>
              Lo que no usas,{' '}
              <span style={{ color: VERDE }}>alguien lo necesita</span>
            </h1>
            <p className="text-base leading-relaxed mb-6 max-w-lg" style={{ color: '#6B7280' }}>
              Marketplace de segunda mano para venezolanos. Compra, vende y dona — sin intermediarios, a precios reales.
            </p>

            {/* Search bar hero (mobile) */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4 max-w-xl lg:hidden">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9CA3AF' }} />
                <input
                  type="text"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="¿Qué estás buscando?"
                  className="w-full bg-white border border-black/10 rounded-2xl pl-10 pr-4 py-3.5 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#EF4D28] transition-colors shadow-sm"
                  style={{ color: TINTA }}
                />
              </div>
              <button type="submit" className="text-white font-bold px-5 py-3.5 rounded-2xl hover:opacity-90 shrink-0" style={{ backgroundColor: CORAL }}>
                Buscar
              </button>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap gap-5">
              {[
                { num: '24', label: 'estados' },
                { num: '$0', label: 'para publicar' },
                { num: '100%', label: 'sin comisiones' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="text-base font-black" style={{ color: CORAL }}>{s.num}</span>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories grid desktop */}
          <div className="hidden lg:grid grid-cols-3 gap-2 w-64 shrink-0">
            {categories.slice(0, 6).map((cat) => {
              const IconComp = ICON_MAP[cat.icon] ?? Package
              return (
                <button
                  key={cat.id}
                  onClick={() => router.push(`/?category=${cat.slug}`)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-white hover:shadow-sm transition-all cursor-pointer"
                  style={{ borderColor: searchParams.category === cat.slug ? CORAL : 'rgba(0,0,0,0.08)' }}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: TINTA }}>{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── LISTINGS ── */}
      <section className="px-4 sm:px-6 pb-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-lg" style={{ color: TINTA }}>
            {hasFilters
              ? `${listings.length} resultado${listings.length !== 1 ? 's' : ''}${searchParams.q ? ` para "${searchParams.q}"` : ''}`
              : 'Publicaciones recientes'
            }
          </h2>
          {hasFilters && (
            <button onClick={clearSearch} className="text-sm hover:opacity-70 transition-opacity" style={{ color: CORAL }}>
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Categories mobile */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 lg:hidden scrollbar-hide">
          <button
            onClick={() => router.push('/')}
            className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
            style={{
              backgroundColor: !searchParams.category ? CORAL : 'white',
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
              className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap"
              style={{
                backgroundColor: searchParams.category === cat.slug ? CORAL : 'white',
                color: searchParams.category === cat.slug ? 'white' : '#6B7280',
                borderColor: searchParams.category === cat.slug ? CORAL : 'rgba(0,0,0,0.1)'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {showEmptyState ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white border border-black/8 flex items-center justify-center mb-4">
              <Package className="w-8 h-8" style={{ color: '#B0A89E' }} />
            </div>
            <p className="font-semibold" style={{ color: TINTA }}>No hay resultados</p>
            <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Intenta con otra búsqueda</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {listings.map((listing) => {
              const cover = listing.listing_images?.find((i: any) => i.is_cover) ?? listing.listing_images?.[0]
              return (
                <Link key={listing.id} href={`/listings/${listing.id}`} className="block">
                  <article className="bg-white rounded-xl overflow-hidden border border-black/8 hover:shadow-md transition-all active:scale-95">
                    <div className="relative aspect-square bg-[#F5F2ED]">
                      {cover ? (
                        <Image src={cover.url} alt={listing.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, 200px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                      )}
                      {listing.is_urgent && (
                        <span className="absolute top-1.5 left-1.5 text-white text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: CORAL }}>URGENTE</span>
                      )}
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-sm font-medium line-clamp-2 leading-snug" style={{ color: TINTA }}>{listing.title}</h3>
                      <p className="text-sm font-bold mt-1" style={{ color: VERDE }}>{formatPrice(listing.price)}</p>
                      {listing.city && (
                        <p className="text-[10px] mt-1 flex items-center gap-0.5" style={{ color: '#9CA3AF' }}>
                          <MapPin className="w-3 h-3" /> {listing.city}
                        </p>
                      )}
                      <p className="text-[10px] mt-0.5" style={{ color: '#B0A89E' }}>{timeAgo(listing.created_at)}</p>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        ) : (
          /* Empty feed — prompt to be first */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="font-bold text-lg mb-1" style={{ color: TINTA }}>Sé el primero en publicar</p>
            <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>La comunidad está esperando artículos como el tuyo.</p>
            <Link
              href="/auth/signup"
              className="text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
              style={{ backgroundColor: CORAL }}
            >
              Publicar ahora — gratis
            </Link>
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 bg-white border-t border-black/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-black mb-8" style={{ color: TINTA }}>¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '01', color: VERDE, title: 'Publica en segundos', desc: 'Fotos, descripción y precio. Gratis siempre.' },
              { step: '02', color: '#2563EB', title: 'Encuentra lo que buscas', desc: 'Busca por categoría o filtra por estado.' },
              { step: '03', color: CORAL, title: 'Contacta por WhatsApp', desc: 'Sin chat interno. Directo, rápido, seguro.' },
            ].map(s => (
              <div key={s.step} className="flex gap-4 bg-[#F5F2ED] rounded-2xl p-5 border border-black/5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-black" style={{ backgroundColor: s.color }}>
                  {s.step}
                </div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: TINTA }}>{s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-14 border-t border-black/8" style={{ backgroundColor: PAPEL }}>
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-2" style={{ color: TINTA }}>
            Empieza ahora. <span style={{ color: VERDE }}>Es gratis.</span>
          </h2>
          <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>Sin tarjeta. Sin pagos. Sin trampa.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/auth/signup"
              className="text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: CORAL }}
            >
              Crear cuenta <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="font-bold px-6 py-3 rounded-xl border border-black/15 hover:border-black/30 transition-colors"
              style={{ color: TINTA }}
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/8 py-5" style={{ backgroundColor: PAPEL }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <Logo size="text-sm" />
          <p className="text-xs" style={{ color: '#B0A89E' }}>entrayresuelve.com · Hecho para Venezuela · 2026</p>
        </div>
      </footer>
    </div>
  )
}

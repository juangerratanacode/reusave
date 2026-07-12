'use client'
import Link from 'next/link'
import {
  Search, ArrowRight, MapPin, ShieldCheck, Zap,
  Package, Smartphone, Shirt, Sofa, Car, Wrench,
  Heart, Plus, ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CORAL = '#EF4D28'
const VERDE = '#22A45D'
const TINTA = '#0F1B13'
const PAPEL = '#F0EDE6'

const MOCK_PRODUCTS = [
  { id: 1, title: 'iPhone 13 Pro', price: '$280', state: 'Caracas', gradient: 'from-slate-200 to-slate-100', icon: Smartphone, badge: null },
  { id: 2, title: 'Sofá 3 puestos', price: '$95', state: 'Valencia', gradient: 'from-amber-100 to-amber-50', icon: Sofa, badge: 'DONACIÓN' },
  { id: 3, title: 'Moto Yamaha 150', price: '$800', state: 'Maracaibo', gradient: 'from-blue-100 to-blue-50', icon: Car, badge: null },
  { id: 4, title: 'Ropa niño 2-4 años', price: 'GRATIS', state: 'Barquisimeto', gradient: 'from-green-100 to-green-50', icon: Shirt, badge: 'GRATIS' },
  { id: 5, title: 'Samsung 55" 4K', price: '$150', state: 'Maracay', gradient: 'from-sky-100 to-sky-50', icon: Package, badge: null },
  { id: 6, title: 'Kit herramientas', price: '$40', state: 'Mérida', gradient: 'from-orange-100 to-orange-50', icon: Wrench, badge: '🆘 URGENTE' },
]

const CATEGORIES = [
  { name: 'Donaciones', icon: Heart, iconColor: VERDE, bg: '#DCFAEB', border: '#A7F3C1' },
  { name: 'Electrónica', icon: Smartphone, iconColor: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE' },
  { name: 'Hogar', icon: Sofa, iconColor: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  { name: 'Ropa', icon: Shirt, iconColor: '#DB2777', bg: '#FCE7F3', border: '#FBCFE8' },
  { name: 'Vehículos', icon: Car, iconColor: '#0369A1', bg: '#E0F2FE', border: '#BAE6FD' },
  { name: 'Servicios', icon: Wrench, iconColor: CORAL, bg: '#FDEEE9', border: '#FBBFAA' },
]

function Logo({ size = 'text-xl' }: { size?: string }) {
  return (
    <span className={`font-black tracking-tight ${size}`} style={{ color: TINTA }}>
      resuel<span style={{ color: CORAL }}>✓</span>e
    </span>
  )
}

export default function LandingPage() {
  const [q, setQ] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/auth/login`)
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: PAPEL, color: TINTA }}>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Logo />

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Busca artículos, categorías..."
              className="w-full bg-[#F5F2ED] border border-black/10 rounded-full pl-9 pr-4 py-2 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#EF4D28] transition-colors"
              style={{ color: TINTA }}
            />
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/auth/login" className="text-sm font-medium px-3 py-1.5 rounded-full border border-black/15 hover:border-black/30 transition-colors" style={{ color: '#6B7280' }}>
              Iniciar sesión
            </Link>
            <Link
              href="/auth/login"
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: CORAL }} />
          <div className="absolute top-10 right-0 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: VERDE }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-10">
          {/* Badge emergencia */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6" style={{ backgroundColor: '#FDEEE9', color: CORAL, border: `1px solid #FBBFAA` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: CORAL }} />
            Apoyo solidario post-sismo Venezuela
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-5" style={{ color: TINTA }}>
                Lo que no usas,{' '}
                <span style={{ color: VERDE }}>alguien</span>
                <br />
                <span style={{ color: VERDE }}>lo necesita</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: '#6B7280' }}>
                Marketplace de segunda mano para venezolanos. Compra, vende y dona — sin intermediarios, a precios reales.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
                  <input
                    type="text"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="¿Qué estás buscando?"
                    className="w-full bg-white border border-black/10 rounded-2xl pl-11 pr-4 py-4 text-base placeholder-[#B0A89E] focus:outline-none focus:border-[#EF4D28] transition-colors shadow-sm"
                    style={{ color: TINTA }}
                  />
                </div>
                <button
                  type="submit"
                  className="text-white font-bold px-6 py-4 rounded-2xl transition-all shrink-0 cursor-pointer hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: CORAL }}
                >
                  Buscar
                </button>
              </form>

              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs" style={{ color: '#B0A89E' }}>Popular:</span>
                {['iPhone', 'Nevera', 'Ropa', 'Moto', 'Donación'].map(tag => (
                  <Link
                    key={tag}
                    href="/auth/login"
                    className="text-xs font-medium px-3 py-1 rounded-full border border-black/10 bg-white hover:border-[#EF4D28] hover:text-[#EF4D28] transition-colors cursor-pointer"
                    style={{ color: '#6B7280' }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: product grid preview */}
            <div className="lg:w-[420px] shrink-0">
              <div className="grid grid-cols-3 gap-2">
                {MOCK_PRODUCTS.map((p) => {
                  const Icon = p.icon
                  return (
                    <div
                      key={p.id}
                      className="relative bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 border border-black/8 group"
                    >
                      <div className={`bg-gradient-to-br ${p.gradient} h-20 flex items-center justify-center`}>
                        <Icon className="w-7 h-7 opacity-50 group-hover:opacity-70 transition-opacity" style={{ color: TINTA }} />
                      </div>
                      {p.badge && (
                        <span
                          className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white"
                          style={{ backgroundColor: p.badge === '🆘 URGENTE' ? '#DC2626' : VERDE }}
                        >
                          {p.badge}
                        </span>
                      )}
                      <div className="p-2">
                        <p className="text-[11px] font-semibold truncate leading-tight" style={{ color: TINTA }}>{p.title}</p>
                        <p className="text-[11px] font-bold mt-0.5" style={{ color: VERDE }}>{p.price}</p>
                        <p className="text-[10px] mt-0.5 truncate" style={{ color: '#9CA3AF' }}>{p.state}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-center mt-3" style={{ color: '#B0A89E' }}>Artículos reales de usuarios venezolanos</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-b border-black/8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-6 sm:gap-10">
            {[
              { num: '24', label: 'estados de Venezuela' },
              { num: '$0', label: 'costo para publicar' },
              { num: 'WhatsApp', label: 'contacto directo' },
              { num: '100%', label: 'sin comisiones' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2.5">
                <span className="text-lg font-black" style={{ color: CORAL }}>{s.num}</span>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-12 bg-white border-b border-black/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black" style={{ color: TINTA }}>Explorar por categoría</h2>
            <Link href="/auth/login" className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: CORAL }}>
              Ver todo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORIES.map(({ name, icon: Icon, iconColor, bg, border }) => (
              <Link
                key={name}
                href="/auth/login"
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border hover:scale-[1.04] transition-all duration-200 cursor-pointer"
                style={{ backgroundColor: bg, borderColor: border }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center">
                  <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>
                <span className="text-xs font-semibold text-center leading-tight" style={{ color: TINTA }}>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      <section className="py-12" style={{ backgroundColor: PAPEL }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black" style={{ color: TINTA }}>Publicaciones recientes</h2>
            <Link href="/auth/login" className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: VERDE }}>
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOCK_PRODUCTS.map((p) => {
              const Icon = p.icon
              return (
                <Link
                  key={p.id}
                  href="/auth/login"
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-black/8 group"
                >
                  <div className={`bg-gradient-to-br ${p.gradient} h-28 flex items-center justify-center relative`}>
                    <Icon className="w-10 h-10 opacity-40 group-hover:opacity-60 transition-opacity" style={{ color: TINTA }} />
                    {p.badge && (
                      <span
                        className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: p.badge === '🆘 URGENTE' ? '#DC2626' : VERDE }}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold truncate" style={{ color: TINTA }}>{p.title}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: VERDE }}>{p.price}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3 h-3 shrink-0" style={{ color: '#B0A89E' }} />
                      <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{p.state}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY BANNER ── */}
      <section className="border-t border-b py-8" style={{ backgroundColor: '#FFF5F2', borderColor: '#FBBFAA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-black text-lg mb-1" style={{ color: TINTA }}>🆘 Categorías de emergencia post-sismo</p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Publicaciones especiales para ayudar a quien más lo necesita</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {[
              { label: 'Donaciones', bg: VERDE },
              { label: 'Venta solidaria', bg: CORAL },
              { label: 'Objetos perdidos', bg: '#6B7280' },
            ].map(b => (
              <Link
                key={b.label}
                href="/auth/login"
                className="text-xs font-bold px-4 py-2 rounded-full text-white hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: b.bg }}
              >
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black mb-2" style={{ color: TINTA }}>¿Cómo funciona?</h2>
          <p className="mb-10" style={{ color: '#9CA3AF' }}>En 3 pasos, sin complicaciones.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: Plus, color: VERDE, title: 'Publica en segundos', desc: 'Sube fotos, describe el artículo y pon tu precio. Completamente gratis.' },
              { step: '02', icon: Search, color: '#2563EB', title: 'Encuentra lo que buscas', desc: 'Busca por categoría o filtra por tu estado. Más de 24 estados disponibles.' },
              { step: '03', icon: Zap, color: CORAL, title: 'Conecta por WhatsApp', desc: 'Habla directo con el vendedor. Sin chat interno, sin comisiones, tú controlas.' },
            ].map(s => {
              const Icon = s.icon
              return (
                <div key={s.step} className="relative bg-white rounded-3xl p-6 border border-black/8 hover:shadow-md transition-shadow">
                  <span className="absolute top-4 right-4 text-4xl font-black" style={{ color: 'rgba(15,27,19,0.05)' }}>{s.step}</span>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: s.color }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: TINTA }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="py-12 border-t border-black/8" style={{ backgroundColor: PAPEL }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, iconColor: '#2563EB', bg: '#DBEAFE', title: 'Sin pagos en línea', desc: 'El pago es siempre en mano. Tú decides. Sin riesgo de estafas por transferencia.' },
              { icon: Zap, iconColor: VERDE, bg: '#DCFAEB', title: 'Funciona con internet lento', desc: 'Diseñado para Venezuela. Imágenes optimizadas, carga rápida con datos móviles.' },
              { icon: MapPin, iconColor: CORAL, bg: '#FDEEE9', title: 'Hecho para venezolanos', desc: 'Precios en dólares, filtros por estado, contacto vía WhatsApp. Sin burocracia.' },
            ].map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex gap-4 bg-white rounded-2xl p-5 border border-black/8 hover:shadow-sm transition-shadow">
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: f.bg }}>
                    <Icon className="w-5 h-5" style={{ color: f.iconColor }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ color: TINTA }}>{f.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden py-16 bg-white border-t border-black/8">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(239,77,40,0.05) 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: TINTA }}>
            Empieza ahora.<br />
            <span style={{ color: VERDE }}>Es gratis.</span>
          </h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: '#6B7280' }}>
            Únete a la comunidad de venezolanos que ya están comprando, vendiendo y donando.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 text-white font-black py-4 px-10 rounded-2xl transition-all text-base cursor-pointer hover:opacity-90"
            style={{ backgroundColor: CORAL, boxShadow: '0 8px 24px rgba(239,77,40,0.25)' }}
          >
            Crear cuenta gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-xs" style={{ color: '#B0A89E' }}>Sin tarjeta. Sin pagos. Sin trampa.</p>
        </div>
      </section>

      <footer className="border-t border-black/8 py-6" style={{ backgroundColor: PAPEL }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="text-base" />
          <p className="text-xs" style={{ color: '#B0A89E' }}>Hecho con ❤️ para Venezuela · 2026</p>
        </div>
      </footer>
    </div>
  )
}

'use client'
import Link from 'next/link'
import {
  Search, ArrowRight, MapPin, ShieldCheck, Zap,
  Package, Smartphone, Shirt, Sofa, Car, Wrench,
  Heart, Plus, ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MOCK_PRODUCTS = [
  { id: 1, title: 'iPhone 13 Pro', price: '$280', state: 'Caracas', gradient: 'from-slate-700 to-slate-900', icon: Smartphone, badge: null },
  { id: 2, title: 'Sofá 3 puestos', price: '$95', state: 'Valencia', gradient: 'from-amber-800 to-amber-950', icon: Sofa, badge: 'DONACIÓN' },
  { id: 3, title: 'Moto Yamaha 150', price: '$800', state: 'Maracaibo', gradient: 'from-blue-800 to-blue-950', icon: Car, badge: null },
  { id: 4, title: 'Ropa niño 2-4 años', price: 'GRATIS', state: 'Barquisimeto', gradient: 'from-green-800 to-green-950', icon: Shirt, badge: 'GRATIS' },
  { id: 5, title: 'Samsung 55" 4K', price: '$150', state: 'Maracay', gradient: 'from-violet-800 to-violet-950', icon: Package, badge: null },
  { id: 6, title: 'Kit herramientas', price: '$40', state: 'Mérida', gradient: 'from-orange-800 to-orange-950', icon: Wrench, badge: '🆘 URGENTE' },
]

const CATEGORIES = [
  { name: 'Donaciones', icon: Heart, color: 'bg-green-500', bg: 'bg-green-950/60 border-green-700/40' },
  { name: 'Electrónica', icon: Smartphone, color: 'bg-blue-500', bg: 'bg-blue-950/60 border-blue-700/40' },
  { name: 'Hogar', icon: Sofa, color: 'bg-amber-500', bg: 'bg-amber-950/60 border-amber-700/40' },
  { name: 'Ropa', icon: Shirt, color: 'bg-pink-500', bg: 'bg-pink-950/60 border-pink-700/40' },
  { name: 'Vehículos', icon: Car, color: 'bg-violet-500', bg: 'bg-violet-950/60 border-violet-700/40' },
  { name: 'Servicios', icon: Wrench, color: 'bg-orange-500', bg: 'bg-orange-950/60 border-orange-700/40' },
]

export default function LandingPage() {
  const [q, setQ] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/auth/login`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <span className="font-black text-xl text-green-400 shrink-0 tracking-tight">
            ReUsa<span className="text-gray-600">.ve</span>
          </span>

          {/* Search en navbar (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Busca artículos, categorías..."
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500 focus:bg-[#1f1f1f] transition-colors"
            />
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25">
              Iniciar sesión
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-400 active:bg-green-600 text-black font-bold text-sm px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Publicar gratis</span>
              <span className="sm:hidden">Registrarse</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#0a0a0a]">
        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-0 w-80 h-80 bg-green-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-700/40 rounded-full px-4 py-1.5 text-xs text-red-300 font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Apoyo solidario post-sismo Venezuela
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
            {/* Left: copy + search */}
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-5">
                Lo que no usas,{' '}
                <span className="text-green-400">alguien</span>
                <br />
                <span className="text-green-400">lo necesita</span>
              </h1>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                Marketplace de segunda mano para venezolanos. Compra, vende y dona — sin intermediarios, a precios reales.
              </p>

              {/* Search bar hero */}
              <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="¿Qué estás buscando?"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-base text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500 focus:bg-[#1f1f1f] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-4 rounded-2xl transition-colors shrink-0 cursor-pointer"
                >
                  Buscar
                </button>
              </form>

              {/* Popular searches */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-600">Popular:</span>
                {['iPhone', 'Nevera', 'Ropa', 'Moto', 'Donación'].map(tag => (
                  <Link
                    key={tag}
                    href="/auth/login"
                    className="text-xs text-gray-400 hover:text-green-400 bg-white/5 hover:bg-green-500/10 border border-white/5 hover:border-green-500/30 px-3 py-1 rounded-full transition-colors cursor-pointer"
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
                      className="relative bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-green-500/30 hover:scale-[1.02] transition-all duration-200 group"
                    >
                      {/* Image area */}
                      <div className={`bg-gradient-to-br ${p.gradient} h-20 flex items-center justify-center`}>
                        <Icon className="w-7 h-7 text-white/60 group-hover:text-white/80 transition-colors" />
                      </div>
                      {p.badge && (
                        <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          p.badge === 'DONACIÓN' || p.badge === 'GRATIS'
                            ? 'bg-green-500 text-black'
                            : 'bg-red-500 text-white'
                        }`}>
                          {p.badge}
                        </span>
                      )}
                      <div className="p-2">
                        <p className="text-[11px] font-semibold text-gray-200 truncate leading-tight">{p.title}</p>
                        <p className={`text-[11px] font-bold mt-0.5 ${p.price === 'GRATIS' ? 'text-green-400' : 'text-green-400'}`}>{p.price}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5 truncate">{p.state}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-600 text-center mt-3">Artículos reales de usuarios venezolanos</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/5 bg-[#111]/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-6 sm:gap-10">
            {[
              { num: '24', label: 'estados de Venezuela' },
              { num: '$0', label: 'costo para publicar' },
              { num: 'WhatsApp', label: 'contacto directo' },
              { num: '100%', label: 'sin comisiones' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2.5">
                <span className="text-lg font-black text-green-400">{s.num}</span>
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-[#0f0f0f] border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white">Explorar por categoría</h2>
            <Link href="/auth/login" className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors cursor-pointer">
              Ver todo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORIES.map(({ name, icon: Icon, color, bg }) => (
              <Link
                key={name}
                href="/auth/login"
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border ${bg} hover:scale-[1.04] transition-all duration-200 cursor-pointer group`}
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-300 text-center leading-tight">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS PREVIEW ── */}
      <section className="py-10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white">Publicaciones recientes</h2>
            <Link href="/auth/login" className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors cursor-pointer">
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
                  className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/30 hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                >
                  <div className={`bg-gradient-to-br ${p.gradient} h-28 flex items-center justify-center relative`}>
                    <Icon className="w-10 h-10 text-white/50 group-hover:text-white/70 transition-colors" />
                    {p.badge && (
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.badge === 'DONACIÓN' || p.badge === 'GRATIS'
                          ? 'bg-green-500 text-black'
                          : 'bg-red-500 text-white'
                      }`}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-200 truncate">{p.title}</p>
                    <p className="text-sm font-bold text-green-400 mt-0.5">{p.price}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin className="w-3 h-3 text-gray-600 shrink-0" />
                      <p className="text-xs text-gray-500 truncate">{p.state}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY BANNER ── */}
      <section className="bg-gradient-to-r from-red-950 via-red-900/80 to-orange-950 border-t border-b border-red-800/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-black text-lg text-white mb-1">🆘 Categorías de emergencia post-sismo</p>
            <p className="text-sm text-red-200/80">Publicaciones especiales para ayudar a quien más lo necesita</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {[
              { label: 'Donaciones', color: 'bg-green-500 text-black' },
              { label: 'Venta solidaria', color: 'bg-orange-500 text-black' },
              { label: 'Objetos perdidos', color: 'bg-violet-500 text-white' },
            ].map(b => (
              <Link
                key={b.label}
                href="/auth/login"
                className={`${b.color} text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer`}
              >
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-14 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-white mb-2">¿Cómo funciona?</h2>
          <p className="text-gray-500 mb-10">En 3 pasos, sin complicaciones.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '01', icon: Plus, color: 'bg-green-500', title: 'Publica en segundos',
                desc: 'Sube fotos, describe el artículo y pon tu precio. Completamente gratis.',
              },
              {
                step: '02', icon: Search, color: 'bg-blue-500', title: 'Encuentra lo que buscas',
                desc: 'Busca por categoría o filtra por tu estado. Más de 24 estados disponibles.',
              },
              {
                step: '03', icon: Zap, color: 'bg-orange-500', title: 'Conecta por WhatsApp',
                desc: 'Habla directo con el vendedor. Sin chat interno, sin comisiones, tú controlas.',
              },
            ].map(s => {
              const Icon = s.icon
              return (
                <div key={s.step} className="relative bg-[#1a1a1a] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors">
                  <span className="absolute top-4 right-4 text-4xl font-black text-white/5">{s.step}</span>
                  <div className={`w-11 h-11 ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="py-12 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, color: 'text-blue-400 bg-blue-950/40', title: 'Sin pagos en línea', desc: 'El pago es siempre en mano. Tú decides. Sin riesgo de estafas por transferencia.' },
              { icon: Zap, color: 'text-green-400 bg-green-950/40', title: 'Funciona con internet lento', desc: 'Diseñado para Venezuela. Imágenes optimizadas, carga rápida con datos móviles.' },
              { icon: MapPin, color: 'text-orange-400 bg-orange-950/40', title: 'Hecho para venezolanos', desc: 'Precios en dólares, filtros por estado, contacto vía WhatsApp. Sin burocracia.' },
            ].map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex gap-4 bg-[#1a1a1a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                  <div className={`shrink-0 w-10 h-10 rounded-xl ${f.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-100 text-sm mb-1">{f.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden py-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Empieza ahora.<br />
            <span className="text-green-400">Es gratis.</span>
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-md mx-auto">
            Únete a la comunidad de venezolanos que ya están comprando, vendiendo y donando.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <Link
              href="/auth/login"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-black py-4 px-8 rounded-2xl transition-colors text-base shadow-xl shadow-green-500/20 cursor-pointer"
            >
              Crear cuenta gratis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-700">Sin tarjeta. Sin pagos. Sin trampa.</p>
        </div>
      </section>

      <footer className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-black text-green-400">ReUsa<span className="text-gray-700">.ve</span></span>
          <p className="text-xs text-gray-700">Hecho con ❤️ para Venezuela · 2025</p>
        </div>
      </footer>

    </div>
  )
}

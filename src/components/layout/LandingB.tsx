'use client'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, Heart, MapPin } from 'lucide-react'

export default function LandingB() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex flex-col">

      {/* Navbar */}
      <header className="px-5 h-14 flex items-center justify-between border-b border-[#1a1a1a]">
        <span className="font-black text-xl text-white">
          resuel<span style={{ color: '#EF4D28' }}>✓</span>e
        </span>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Entrar
          </Link>
          <Link
            href="/auth/login"
            className="text-sm hover:opacity-90 text-white font-bold px-4 py-2 rounded-full transition-colors"
            style={{ backgroundColor: '#EF4D28' }}
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-5 pt-12 pb-10">
        {/* Badge emergencia */}
        <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/40 rounded-full px-4 py-1.5 text-sm text-red-300 mb-7">
          🆘 Apoyo post-sismo Venezuela
        </div>

        <h1 className="text-4xl font-extrabold leading-tight max-w-sm">
          Lo que no usas,{' '}
          <span style={{ color: '#22A45D' }}>alguien lo necesita</span>
        </h1>

        <p className="mt-4 text-gray-400 text-base max-w-xs leading-relaxed">
          Marketplace de segunda mano para venezolanos. Vende, dona o encuentra lo que perdiste — a precios reales, sin intermediarios.
        </p>

        <div className="flex flex-col gap-3 mt-8 w-full max-w-xs">
          <Link
            href="/auth/login"
            className="w-full hover:opacity-90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-base"
            style={{ backgroundColor: '#EF4D28' }}
          >
            Publicar gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/feed"
            className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-gray-300 font-medium py-4 rounded-2xl text-center transition-colors text-base"
          >
            Explorar artículos
          </Link>
        </div>

        <p className="mt-5 text-xs text-gray-600">
          Sin costo · Contacto por WhatsApp · Pago en mano
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-10 w-full max-w-xs">
          {[
            { value: '24', label: 'estados de Venezuela', color: 'text-green-400' },
            { value: '$0', label: 'costo para publicar', color: 'text-orange-400' },
            { value: 'WA', label: 'contacto directo', color: 'text-[#25D366]' },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-3 text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-5 py-8 max-w-sm mx-auto w-full">
        <h2 className="text-base font-bold text-gray-300 mb-4">¿Cómo funciona?</h2>
        <div className="space-y-3">
          {[
            { icon: '📸', title: 'Publica en segundos', desc: 'Sube fotos, describe el artículo y pon tu precio. Gratis, siempre.' },
            { icon: '🔍', title: 'Encuentra lo que buscas', desc: 'Filtra por estado, categoría o precio. Todo Venezuela en un lugar.' },
            { icon: '💬', title: 'Conecta por WhatsApp', desc: 'Sin chat interno. Contacto directo, rápido y seguro.' },
          ].map((s) => (
            <div key={s.title} className="flex gap-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <span className="text-2xl shrink-0">{s.icon}</span>
              <div>
                <p className="font-semibold text-gray-200 text-sm">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías emergencia */}
      <section className="px-5 py-8 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="max-w-sm mx-auto">
          <h2 className="text-base font-bold text-gray-300 mb-1">Para la emergencia</h2>
          <p className="text-xs text-gray-600 mb-4">Categorías creadas para el momento que vivimos</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🎁', title: 'Donación', desc: 'Regala lo que no usas', color: 'border-green-800/50 bg-green-900/10' },
              { icon: '🤝', title: 'Venta Solidaria', desc: 'A precios reales', color: 'border-orange-800/50 bg-orange-900/10' },
              { icon: '🆘', title: 'Necesidad Urgente', desc: 'Publica lo que buscas', color: 'border-red-800/50 bg-red-900/10' },
              { icon: '🔍', title: 'Objetos Perdidos', desc: 'Encontrados o extraviados', color: 'border-purple-800/50 bg-purple-900/10' },
            ].map((c) => (
              <div key={c.title} className={`rounded-xl p-4 border ${c.color}`}>
                <span className="text-2xl">{c.icon}</span>
                <p className="font-semibold text-gray-200 text-sm mt-2">{c.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-8 max-w-sm mx-auto w-full">
        <div className="space-y-3">
          {[
            { icon: <Zap className="w-4 h-4 text-green-400" />, title: 'Rápido con internet lento', desc: 'Imágenes comprimidas automáticamente. Diseñado para Venezuela.' },
            { icon: <MapPin className="w-4 h-4 text-orange-400" />, title: 'Los 24 estados', desc: 'Filtra por estado y ciudad. Encuentra lo que hay cerca.' },
            { icon: <ShieldCheck className="w-4 h-4 text-blue-400" />, title: 'Sin pagos en línea', desc: 'Pago en mano al recoger. Sin riesgo de estafa por transferencia.' },
            { icon: <Heart className="w-4 h-4 text-red-400" />, title: 'Hecho para venezolanos', desc: 'Precios en dólares. WhatsApp como contacto. Sin burocracia.' },
          ].map((f) => (
            <div key={f.title} className="flex gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <div className="shrink-0 mt-0.5">{f.icon}</div>
              <div>
                <p className="font-semibold text-gray-200 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="px-5 py-10 text-center border-t border-[#1a1a1a]">
        <h2 className="text-xl font-bold text-gray-100 mb-1">Empieza ahora</h2>
        <p className="text-gray-500 text-sm mb-6">Es gratis. Siempre lo será para publicaciones básicas.</p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 hover:opacity-90 text-white font-bold px-8 py-4 rounded-2xl transition-colors"
          style={{ backgroundColor: '#EF4D28' }}
        >
          Crear cuenta gratis <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="text-center py-6 text-xs text-gray-700 border-t border-[#1a1a1a]">
        <span className="font-black text-white">resuel<span style={{ color: '#EF4D28' }}>✓</span>e</span>
        {' '}— Hecho con ❤️ para Venezuela
      </footer>
    </div>
  )
}

'use client'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, Heart, MapPin } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex flex-col">

      {/* Navbar mínimo */}
      <header className="px-6 h-14 flex items-center justify-between border-b border-[#1a1a1a]">
        <span className="font-bold text-xl text-green-400">
          ReUsa<span className="text-gray-500">.ve</span>
        </span>
        <Link
          href="/auth/login"
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Iniciar sesión
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">

        {/* Badge emergencia */}
        <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-full px-4 py-1.5 text-sm text-red-300 mb-6">
          🆘 Apoyo solidario post-sismo Venezuela
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-lg">
          Lo que no usas,{' '}
          <span className="text-green-400">alguien lo necesita</span>
        </h1>

        <p className="mt-5 text-gray-400 text-lg max-w-md leading-relaxed">
          Marketplace de segunda mano para venezolanos. Vende, dona o encuentra
          lo que perdiste — a precios reales, sin intermediarios.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-sm">
          <Link
            href="/auth/login"
            className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-base"
          >
            Registrarse gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/"
            className="flex-1 bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-gray-300 font-medium py-4 rounded-2xl text-center transition-colors text-base"
          >
            Ver publicaciones
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-6 text-xs text-gray-600">
          Sin costo · Sin envíos · Solo recogida en persona · Contacto por WhatsApp
        </p>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-12 max-w-2xl mx-auto w-full">
        <h2 className="text-center text-xl font-bold text-gray-200 mb-8">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '📸', title: 'Publica', desc: 'Sube fotos y descripción de lo que tienes. Gratis.' },
            { icon: '🔍', title: 'Encuentra', desc: 'Busca por categoría o estado. Filtra por precio.' },
            { icon: '💬', title: 'Conecta', desc: 'Contacta al vendedor directo por WhatsApp. Sin chat interno.' },
          ].map((s) => (
            <div key={s.title} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 text-center">
              <span className="text-3xl">{s.icon}</span>
              <h3 className="font-bold text-gray-100 mt-3 mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías emergencia */}
      <section className="px-6 py-10 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center text-xl font-bold text-gray-200 mb-2">Para la emergencia</h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Categorías especiales creadas para el momento que vivimos
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🎁', title: 'Donación', desc: 'Regala lo que no usas', color: 'border-green-800/50 bg-green-900/10' },
              { icon: '🤝', title: 'Venta Solidaria', desc: 'A precios de verdad', color: 'border-orange-800/50 bg-orange-900/10' },
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
      <section className="px-6 py-12 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          {[
            { icon: <Zap className="w-5 h-5 text-green-400" />, title: 'Rápido y liviano', desc: 'Funciona bien con internet lento. Imágenes comprimidas automáticamente.' },
            { icon: <MapPin className="w-5 h-5 text-orange-400" />, title: 'Por estado y ciudad', desc: 'Encuentra artículos cerca de ti en cualquier estado de Venezuela.' },
            { icon: <ShieldCheck className="w-5 h-5 text-blue-400" />, title: 'Sin pagos en línea', desc: 'El pago es en mano, tú decides. Sin riesgo de estafa por transferencia.' },
            { icon: <Heart className="w-5 h-5 text-red-400" />, title: 'Hecho para venezolanos', desc: 'Precios en dólares, WhatsApp como método de contacto, sin burocracia.' },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
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
      <section className="px-6 py-12 text-center border-t border-[#1a1a1a]">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Empieza ahora</h2>
        <p className="text-gray-500 text-sm mb-6">Es gratis. Siempre lo será para publicaciones básicas.</p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-2xl transition-colors"
        >
          Crear cuenta gratis <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="text-center py-6 text-xs text-gray-700 border-t border-[#1a1a1a]">
        ReUsa.ve — Hecho con ❤️ para Venezuela
      </footer>
    </div>
  )
}

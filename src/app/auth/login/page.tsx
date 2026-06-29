'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
    if (err) { setError(err.message); setLoading(false) }
    else setSent(true)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      <header className="px-4 h-14 flex items-center">
        <Link href="/" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-100 mb-1">
            Bienvenido a <span className="text-green-400">ReUsa.ve</span>
          </h1>
          <p className="text-gray-500 text-sm mb-8">Inicia sesión para publicar y contactar vendedores</p>

          {sent ? (
            <div className="bg-green-900/20 border border-green-700/50 rounded-2xl p-6 text-center">
              <Mail className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h2 className="font-semibold text-gray-100 mb-2">¡Revisa tu correo!</h2>
              <p className="text-sm text-gray-400">
                Te enviamos un enlace mágico a <strong className="text-gray-200">{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl transition-colors"
              >
                {loading ? 'Enviando...' : '✉️ Enviar enlace mágico'}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2a2a2a]" />
                </div>
                <div className="relative flex justify-center text-xs text-gray-600 bg-[#0f0f0f] px-2 w-fit mx-auto">
                  o continúa con
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-gray-300 font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
                Continuar con Google
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

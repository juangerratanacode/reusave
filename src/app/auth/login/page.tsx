'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const CORAL = '#EF4D28'
const TINTA = '#0F1B13'
const PAPEL = '#F0EDE6'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)
    if (err) {
      setError('Correo o contraseña incorrectos.')
    } else {
      router.push('/feed')
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError('No se pudo conectar con Google. Intenta de nuevo.')
      setGoogleLoading(false)
    }
  }

  const inputClass = "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#EF4D28] transition-colors"

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPEL }}>
      <header className="px-4 h-14 flex items-center">
        <Link href="/" className="p-2 -ml-2 transition-opacity hover:opacity-70" style={{ color: '#6B7280' }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h1 className="text-3xl font-black mb-1" style={{ color: TINTA }}>
              resuel<span style={{ color: CORAL }}>✓</span>e
            </h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className={inputClass}
                style={{ color: TINTA }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className={`${inputClass} pr-10`}
                  style={{ color: TINTA }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  style={{ color: '#9CA3AF' }}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:opacity-90 mt-1"
              style={{ backgroundColor: CORAL }}
            >
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="relative py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/8" />
            </div>
            <div className="relative flex justify-center">
              <span className="text-xs px-3" style={{ backgroundColor: PAPEL, color: '#B0A89E' }}>o continúa con</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-[#F5F2ED] border border-black/10 font-medium py-3.5 rounded-xl transition-colors disabled:opacity-50"
            style={{ color: TINTA }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
              <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
              <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
              <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
              <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            {googleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
          </button>

          <p className="text-center text-sm mt-6" style={{ color: '#9CA3AF' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/auth/signup" className="font-semibold hover:opacity-80" style={{ color: CORAL }}>
              Regístrate gratis
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

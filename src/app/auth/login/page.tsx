'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const CORAL = '#FF5A38'
const TINTA = '#15221B'
const PAPEL = '#F5F0E5'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
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

  const inputClass = "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#FF5A38] transition-colors"

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

          <p className="text-center text-sm mt-5" style={{ color: '#9CA3AF' }}>
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

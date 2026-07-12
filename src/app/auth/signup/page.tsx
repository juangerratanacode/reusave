'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const CORAL = '#EF4D28'
const TINTA = '#0F1B13'
const PAPEL = '#F0EDE6'

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const inputClass = "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#EF4D28] transition-colors"

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)

    if (err) {
      const msg = err.message ?? ''
      if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('Ya existe una cuenta con ese correo. ¿Quieres iniciar sesión?')
      } else if (msg.includes('invalid') || msg.includes('email')) {
        setError('Correo electrónico no válido.')
      } else if (msg.includes('password')) {
        setError('La contraseña no cumple los requisitos mínimos.')
      } else {
        setError('No se pudo crear la cuenta. Intenta de nuevo.')
      }
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: PAPEL }}>
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: TINTA }}>¡Revisa tu correo!</h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B7280' }}>
            Enviamos un enlace de confirmación a <strong style={{ color: TINTA }}>{email}</strong>. Haz clic en él para activar tu cuenta.
          </p>
          <Link href="/auth/login" className="block text-center font-bold py-3 rounded-xl border border-black/15 hover:border-black/30 transition-colors" style={{ color: TINTA }}>
            Ya lo confirmé → Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

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
            <p className="text-sm" style={{ color: '#6B7280' }}>Crea tu cuenta — es gratis, siempre.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>Correo electrónico</label>
              <input
                type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className={inputClass} style={{ color: TINTA }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="new-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={`${inputClass} pr-10`} style={{ color: TINTA }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  style={{ color: '#9CA3AF' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>Confirmar contraseña</label>
              <input
                type={showPw ? 'text' : 'password'} required autoComplete="new-password"
                value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repite tu contraseña"
                className={inputClass} style={{ color: TINTA }}
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{error}</p>
            )}

            <button type="submit"
              disabled={loading || !email.trim() || !password || !confirm}
              className="w-full text-white font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-1"
              style={{ backgroundColor: CORAL }}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#9CA3AF' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="font-semibold hover:opacity-80" style={{ color: CORAL }}>
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

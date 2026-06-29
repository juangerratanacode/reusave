'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Send, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // Auto-verify when all 6 digits are filled
  useEffect(() => {
    const code = otp.join('')
    if (code.length === 6) verifyOtp(code)
  }, [otp])

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    })

    setLoading(false)
    if (err) {
      setError(err.message || 'Error al enviar el código. Intenta de nuevo.')
    } else {
      setStep('otp')
      setResendCooldown(60)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }

  const verifyOtp = async (code: string) => {
    setVerifying(true)
    setError('')

    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code,
      type: 'email',
    })

    if (err) {
      setError('Código incorrecto o expirado. Intenta de nuevo.')
      setOtp(['', '', '', '', '', ''])
      setVerifying(false)
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } else {
      router.push('/feed')
    }
  }

  const handleOtpInput = (idx: number, val: string) => {
    // Handle paste of full code
    if (val.length > 1) {
      const digits = val.replace(/\D/g, '').slice(0, 6).split('')
      const next = [...otp]
      digits.forEach((d, i) => { if (i < 6) next[i] = d })
      setOtp(next)
      inputRefs.current[Math.min(digits.length, 5)]?.focus()
      return
    }

    const digit = val.replace(/\D/g, '')
    const next = [...otp]
    next[idx] = digit
    setOtp(next)
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handleGoogle = async () => {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError('Google no está disponible aún.')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header className="px-4 h-14 flex items-center">
        {step === 'otp' ? (
          <button
            onClick={() => { setStep('email'); setOtp(['','','','','','']); setError('') }}
            className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <Link href="/" className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <h1 className="text-3xl font-black text-green-400 mb-1">
              ReUsa<span className="text-gray-600">.ve</span>
            </h1>
            {step === 'email' ? (
              <p className="text-gray-500 text-sm">
                Ingresa tu correo — si no tienes cuenta, la creamos automáticamente.
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                Enviamos un código de 6 dígitos a <strong className="text-gray-300">{email}</strong>
              </p>
            )}
          </div>

          {/* ── STEP 1: Email ── */}
          {step === 'email' && (
            <form onSubmit={sendOtp} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center">
                  <span className="text-xs text-gray-600 bg-[#0a0a0a] px-3">o continúa con</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-2.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-gray-300 font-medium py-3.5 rounded-xl transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                  <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
                  <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
                  <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
                  <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
                Continuar con Google
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 'otp' && (
            <div className="space-y-6">
              {/* 6-digit inputs */}
              <div className="flex gap-2 justify-center">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { inputRefs.current[idx] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={e => handleOtpInput(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    disabled={verifying}
                    className="w-12 h-14 text-center text-xl font-bold bg-[#1a1a1a] border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:border-green-500 focus:bg-[#1f1f1f] transition-colors disabled:opacity-50"
                  />
                ))}
              </div>

              {verifying && (
                <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                  Verificando...
                </div>
              )}

              {error && (
                <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-xl text-center">{error}</p>
              )}

              {/* Resend */}
              <div className="text-center">
                {resendCooldown > 0 ? (
                  <p className="text-sm text-gray-600">
                    Reenviar código en <span className="text-gray-400 font-semibold tabular-nums">{resendCooldown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={() => sendOtp()}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 transition-colors cursor-pointer mx-auto disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reenviar código
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

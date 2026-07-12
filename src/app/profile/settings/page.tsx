'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save, Camera, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { VENEZUELA_STATES } from '@/lib/venezuela'

const PAPEL = '#F5F0E5'
const TINTA = '#15221B'
const CORAL = '#FF5A38'

export default function ProfileSettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    whatsapp: '',
    city: '',
    state: '',
    bio: '',
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setAvatarUrl(profile.avatar_url ?? null)
        setForm({
          full_name: profile.full_name ?? '',
          username: profile.username ?? '',
          whatsapp: profile.whatsapp ?? '',
          city: profile.city ?? '',
          state: profile.state ?? '',
          bio: profile.bio ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    setUploadingAvatar(true)
    setError('')

    try {
      const { compressImage } = await import('@/lib/image-compress')
      const compressed = await compressImage(file, 150)

      const path = `${userId}/avatar.jpg`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, compressed, { contentType: 'image/jpeg', upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      const urlWithBust = `${publicUrl}?t=${Date.now()}`

      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)
      setAvatarUrl(urlWithBust)
    } catch (err: any) {
      setError('Error al subir la foto: ' + (err.message ?? 'Intenta de nuevo'))
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: err } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name || null,
        username: form.username || null,
        whatsapp: form.whatsapp || null,
        city: form.city || null,
        state: form.state || null,
        bio: form.bio || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    setSaving(false)
    if (err) setError(err.message)
    else setSuccess(true)
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const inputClass = "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
  const inputStyle = { color: TINTA }
  const focusBorderStyle = { '--tw-ring-color': CORAL } as React.CSSProperties

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPEL }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: CORAL, borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPEL }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-black/5 px-4 h-14 flex items-center gap-3" style={{ backgroundColor: PAPEL + 'F5' }}>
        <Link href="/profile" className="p-2 -ml-2 hover:opacity-60 transition-opacity" style={{ color: '#9CA3AF' }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold" style={{ color: TINTA }}>Editar perfil</h1>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8 pb-24">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-black/8 overflow-hidden">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold select-none" style={{ color: '#9CA3AF' }}>
                  {form.full_name?.[0]?.toUpperCase() ?? form.username?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: CORAL }}
            >
              {uploadingAvatar
                ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                : <Camera className="w-3.5 h-3.5 text-white" />
              }
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div>
            <p className="font-semibold" style={{ color: TINTA }}>{form.full_name || form.username || 'Tu perfil'}</p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>@{form.username || 'usuario'}</p>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="text-xs mt-1 transition-colors cursor-pointer disabled:opacity-60 font-medium"
              style={{ color: CORAL }}
            >
              {uploadingAvatar ? 'Subiendo...' : 'Cambiar foto'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>Nombre completo</label>
            <input type="text" value={form.full_name} onChange={set('full_name')} placeholder="Tu nombre" className={inputClass} style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>Nombre de usuario</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9CA3AF' }}>@</span>
              <input type="text" value={form.username} onChange={set('username')} placeholder="usuario" className={`${inputClass} pl-8`} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>WhatsApp</label>
            <input type="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="+58 412 000 0000" className={inputClass} style={inputStyle} />
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Los compradores te contactarán por aquí</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>Estado</label>
            <select value={form.state} onChange={set('state')} className={inputClass} style={inputStyle}>
              <option value="">Selecciona tu estado</option>
              {VENEZUELA_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>Ciudad</label>
            <input type="text" value={form.city} onChange={set('city')} placeholder="Ej: Caracas, Maracaibo..." className={inputClass} style={inputStyle} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#6B7280' }}>Bio</label>
            <textarea value={form.bio} onChange={set('bio')} rows={3} placeholder="Cuéntanos algo sobre ti..." className={`${inputClass} resize-none`} style={inputStyle} />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{error}</p>}
          {success && <p className="text-sm px-3 py-2 rounded-xl" style={{ color: CORAL, backgroundColor: '#FFF0EC', border: `1px solid ${CORAL}30` }}>✓ Perfil actualizado correctamente</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: CORAL }}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

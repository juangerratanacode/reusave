'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save, Camera, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { VENEZUELA_STATES } from '@/lib/venezuela'

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
      // Compress to max 200KB
      const { compressImage } = await import('@/lib/image-compress')
      const compressed = await compressImage(file, 150)

      const path = `${userId}/avatar.jpg`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, compressed, { contentType: 'image/jpeg', upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      // Add cache-bust so the new image shows immediately
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

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 h-14 flex items-center gap-3">
        <Link href="/profile" className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-gray-100">Editar perfil</h1>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Avatar upload */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-white/10 overflow-hidden">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-600 font-bold select-none">
                  {form.full_name?.[0]?.toUpperCase() ?? form.username?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </div>

            {/* Camera button overlay */}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-lg transition-colors cursor-pointer disabled:opacity-60"
            >
              {uploadingAvatar
                ? <Loader2 className="w-3.5 h-3.5 text-black animate-spin" />
                : <Camera className="w-3.5 h-3.5 text-black" />
              }
            </button>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <p className="font-semibold text-gray-200">{form.full_name || form.username || 'Tu perfil'}</p>
            <p className="text-sm text-gray-500">@{form.username || 'usuario'}</p>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="text-xs text-green-400 hover:text-green-300 mt-1 transition-colors cursor-pointer disabled:opacity-60"
            >
              {uploadingAvatar ? 'Subiendo...' : 'Cambiar foto'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre completo</label>
            <input
              type="text"
              value={form.full_name}
              onChange={set('full_name')}
              placeholder="Tu nombre"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre de usuario</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={form.username}
                onChange={set('username')}
                placeholder="usuario"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">WhatsApp</label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={set('whatsapp')}
              placeholder="+58 412 000 0000"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
            />
            <p className="text-xs text-gray-600 mt-1">Los compradores te contactarán por aquí</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Estado</label>
            <select
              value={form.state}
              onChange={set('state')}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="">Selecciona tu estado</option>
              {VENEZUELA_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Ciudad</label>
            <input
              type="text"
              value={form.city}
              onChange={set('city')}
              placeholder="Ej: Caracas, Maracaibo..."
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={set('bio')}
              rows={3}
              placeholder="Cuéntanos algo sobre ti..."
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-xl">{error}</p>}
          {success && <p className="text-green-400 text-sm bg-green-900/20 px-3 py-2 rounded-xl">Perfil actualizado correctamente</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

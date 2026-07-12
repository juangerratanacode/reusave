'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { compressImage } from '@/lib/image-compress'
import { CONDITIONS } from '@/types'
import { Camera, X, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { VENEZUELA_STATES, CITIES_BY_STATE } from '@/lib/venezuela'

const CORAL = '#EF4D28'
const VERDE = '#22A45D'
const TINTA = '#0F1B13'
const PAPEL = '#F0EDE6'

const inputClass = "w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#EF4D28] transition-colors"
const labelClass = "block text-sm font-medium mb-1.5"

export default function NewListingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    condition: '',
    city: '',
    state: '',
    address_hint: '',
    is_urgent: false,
    pickup_only: true,
    whatsapp: '',
  })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      // Si no está autenticado → redirigir a signup
      if (!user) {
        router.replace('/auth/signup?redirect=/listings/new')
        return
      }

      setCheckingAuth(false)

      const [{ data: cats }, { data: profile }] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('profiles').select('whatsapp').eq('id', user.id).single(),
      ])

      setCategories(cats ?? [])
      if (profile?.whatsapp) setForm(f => ({ ...f, whatsapp: profile.whatsapp }))
    }
    init()
  }, [])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - images.length)
    const compressed = await Promise.all(files.map(f => compressImage(f, 300)))
    setImages(prev => [...prev, ...compressed].slice(0, 3))
    setPreviews(prev => [...prev, ...compressed.map(f => URL.createObjectURL(f))].slice(0, 3))
  }

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    try {
      const { data: listing, error: lErr } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          title: form.title,
          description: form.description || null,
          price: parseFloat(form.price) || 0,
          category_id: parseInt(form.category_id),
          condition: form.condition || null,
          city: form.city || null,
          state: form.state || null,
          address_hint: form.address_hint || null,
          is_urgent: form.is_urgent,
          pickup_only: form.pickup_only,
        })
        .select().single()

      if (lErr) throw lErr

      if (form.whatsapp) {
        await supabase.from('profiles').update({ whatsapp: form.whatsapp }).eq('id', user.id)
      }

      for (let i = 0; i < images.length; i++) {
        const path = `${user.id}/${listing.id}/${Date.now()}-${i}.jpg`
        const { data: uploaded } = await supabase.storage
          .from('listing-images')
          .upload(path, images[i], { contentType: 'image/jpeg', upsert: true })
        if (uploaded) {
          const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(path)
          await supabase.from('listing_images').insert({
            listing_id: listing.id, url: publicUrl, storage_path: path,
            is_cover: i === 0, sort_order: i,
          })
        }
      }

      router.push(`/listings/${listing.id}`)
    } catch (err: any) {
      setError(err.message ?? 'Error al publicar')
      setLoading(false)
    }
  }

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const emergencyCategories = categories.filter(c => c.type === 'emergency')
  const generalCategories = categories.filter(c => c.type !== 'emergency')

  // Cargando auth check
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPEL }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: CORAL }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPEL }}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-black/8 px-4 h-14 flex items-center gap-3">
        <Link href="/feed" className="p-2 -ml-2 hover:opacity-70 transition-opacity" style={{ color: '#6B7280' }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-base" style={{ color: TINTA }}>Nueva publicación</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 pb-16 space-y-5">

        {/* Fotos */}
        <div className="bg-white rounded-2xl p-4 border border-black/8">
          <label className={labelClass} style={{ color: '#6B7280' }}>
            Fotos <span style={{ color: '#B0A89E' }}>(máx 3)</span>
          </label>
          <div className="flex gap-3 mt-2">
            {previews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-black/10 shrink-0">
                <img src={src} alt="" className="object-cover w-full h-full" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[9px] text-white font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: VERDE }}>
                    PORTADA
                  </span>
                )}
              </div>
            ))}
            {images.length < 3 && (
              <label className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:opacity-70 transition-opacity shrink-0"
                style={{ borderColor: 'rgba(0,0,0,0.15)' }}>
                <Camera className="w-6 h-6" style={{ color: '#9CA3AF' }} />
                <span className="text-[11px] mt-1" style={{ color: '#9CA3AF' }}>Agregar</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        {/* Título */}
        <div className="bg-white rounded-2xl p-4 border border-black/8">
          <label className={labelClass} style={{ color: '#6B7280' }}>Título *</label>
          <input required value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="¿Qué estás publicando?"
            className={inputClass} style={{ color: TINTA }} />
        </div>

        {/* Categoría */}
        <div className="bg-white rounded-2xl p-4 border border-black/8">
          <label className={labelClass} style={{ color: '#6B7280' }}>Categoría *</label>

          {emergencyCategories.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: CORAL }}>
                Emergencia
              </p>
              <div className="grid grid-cols-2 gap-2">
                {emergencyCategories.map(c => (
                  <button key={c.id} type="button" onClick={() => set('category_id', String(c.id))}
                    className="px-3 py-2.5 rounded-xl text-sm text-left border transition-all"
                    style={{
                      backgroundColor: form.category_id === String(c.id) ? '#FDEEE9' : '#F9F7F4',
                      borderColor: form.category_id === String(c.id) ? CORAL : 'rgba(0,0,0,0.08)',
                      color: form.category_id === String(c.id) ? CORAL : '#6B7280',
                      fontWeight: form.category_id === String(c.id) ? 600 : 400,
                    }}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {generalCategories.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#9CA3AF' }}>General</p>
              <div className="grid grid-cols-2 gap-2">
                {generalCategories.map(c => (
                  <button key={c.id} type="button" onClick={() => set('category_id', String(c.id))}
                    className="px-3 py-2.5 rounded-xl text-sm text-left border transition-all"
                    style={{
                      backgroundColor: form.category_id === String(c.id) ? '#F0EDE6' : '#F9F7F4',
                      borderColor: form.category_id === String(c.id) ? TINTA : 'rgba(0,0,0,0.08)',
                      color: form.category_id === String(c.id) ? TINTA : '#6B7280',
                      fontWeight: form.category_id === String(c.id) ? 600 : 400,
                    }}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Precio */}
        <div className="bg-white rounded-2xl p-4 border border-black/8">
          <label className={labelClass} style={{ color: '#6B7280' }}>Precio (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: '#9CA3AF' }}>$</span>
            <input type="number" min="0" step="0.5" value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="0 = Gratis / Donación"
              className={`${inputClass} pl-8`} style={{ color: TINTA }} />
          </div>
        </div>

        {/* Condición */}
        <div className="bg-white rounded-2xl p-4 border border-black/8">
          <label className={labelClass} style={{ color: '#6B7280' }}>Condición</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CONDITIONS).map(([k, v]) => (
              <button key={k} type="button" onClick={() => set('condition', k)}
                className="px-4 py-1.5 rounded-full text-sm border transition-all"
                style={{
                  backgroundColor: form.condition === k ? TINTA : 'transparent',
                  borderColor: form.condition === k ? TINTA : 'rgba(0,0,0,0.12)',
                  color: form.condition === k ? 'white' : '#6B7280',
                }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-white rounded-2xl p-4 border border-black/8">
          <label className={labelClass} style={{ color: '#6B7280' }}>Descripción</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Describe el artículo, su estado, por qué lo vendes..."
            className={`${inputClass} resize-none`} style={{ color: TINTA }} />
        </div>

        {/* Ubicación */}
        <div className="bg-white rounded-2xl p-4 border border-black/8">
          <label className={labelClass} style={{ color: '#6B7280' }}>Ubicación *</label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Estado</p>
              <select required value={form.state} onChange={e => { set('state', e.target.value); set('city', '') }}
                className={inputClass} style={{ color: form.state ? TINTA : '#B0A89E' }}>
                <option value="">Selecciona...</option>
                {VENEZUELA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Ciudad</p>
              {form.state && CITIES_BY_STATE[form.state] ? (
                <select value={form.city} onChange={e => set('city', e.target.value)}
                  className={inputClass} style={{ color: form.city ? TINTA : '#B0A89E' }}>
                  <option value="">Selecciona...</option>
                  {CITIES_BY_STATE[form.state].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input value={form.city} onChange={e => set('city', e.target.value)}
                  placeholder="Tu ciudad" className={inputClass} style={{ color: TINTA }} />
              )}
            </div>
          </div>
          <input value={form.address_hint} onChange={e => set('address_hint', e.target.value)}
            placeholder="Punto de referencia (ej: cerca del CC Sambil, zona norte)"
            className={inputClass} style={{ color: TINTA }} />
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-2xl p-4 border border-black/8">
          <label className={labelClass} style={{ color: '#6B7280' }}>
            Tu WhatsApp <span style={{ color: '#B0A89E' }}>(con código de país)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9CA3AF' }}>+</span>
            <input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
              placeholder="58 412 123 4567"
              className={`${inputClass} pl-8`} style={{ color: TINTA }} />
          </div>
          <p className="text-xs mt-1.5" style={{ color: '#9CA3AF' }}>Los compradores te contactarán aquí directamente</p>
        </div>

        {/* Opciones */}
        <div className="bg-white rounded-2xl p-4 border border-black/8 space-y-4">
          {[
            { key: 'is_urgent', label: 'Marcar como urgente', sub: 'Aparece destacado en los resultados', activeColor: CORAL },
            { key: 'pickup_only', label: 'Solo recogida en persona', sub: 'No hay envío disponible', activeColor: VERDE },
          ].map(({ key, label, sub, activeColor }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => set(key, !(form as any)[key])}
                className="w-11 h-6 rounded-full relative shrink-0 transition-colors"
                style={{ backgroundColor: (form as any)[key] ? activeColor : '#E5E7EB' }}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${(form as any)[key] ? 'translate-x-5' : ''}`} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: TINTA }}>{label}</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>{sub}</p>
              </div>
            </label>
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</p>
        )}

        <button type="submit"
          disabled={loading || !form.title || !form.category_id || !form.state}
          className="w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: CORAL }}>
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? 'Publicando...' : 'Publicar ahora'}
        </button>

      </form>
    </div>
  )
}

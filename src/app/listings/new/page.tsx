'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { compressImage } from '@/lib/image-compress'
import { CONDITIONS } from '@/types'
import { Camera, X, Loader2 } from 'lucide-react'
import BackButton from '@/components/layout/BackButton'
import { VENEZUELA_STATES, CITIES_BY_STATE } from '@/lib/venezuela'

export default function NewListingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<any[]>([])

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

  // Load categories + pre-fill WhatsApp from profile
  useEffect(() => {
    const init = async () => {
      const [{ data: cats }, { data: { user } }] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
        supabase.auth.getUser(),
      ])
      setCategories(cats ?? [])

      if (user) {
        const { data: profile } = await supabase
          .from('profiles').select('whatsapp').eq('id', user.id).single()
        if (profile?.whatsapp) {
          setForm(f => ({ ...f, whatsapp: profile.whatsapp }))
        }
      }
    }
    init()
  }, [])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - images.length)
    const compressed = await Promise.all(files.map(f => compressImage(f, 300)))
    setImages(prev => [...prev, ...compressed].slice(0, 3))
    const newPreviews = compressed.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...newPreviews].slice(0, 3))
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
        .select()
        .single()

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
            listing_id: listing.id,
            url: publicUrl,
            storage_path: path,
            is_cover: i === 0,
            sort_order: i,
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
  const commercialCategories = categories.filter(c => c.type !== 'emergency')

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 h-14 flex items-center gap-3">
        <BackButton />
        <h1 className="font-bold text-gray-100">Nueva publicación</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 pb-10 space-y-5">

        {/* Fotos */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Fotos <span className="text-gray-600">(máx 3)</span>
          </label>
          <div className="flex gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                <img src={src} alt="" className="object-cover w-full h-full" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 cursor-pointer">
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-green-600 text-white px-1 rounded">PORTADA</span>}
              </div>
            ))}
            {images.length < 3 && (
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition-colors">
                <Camera className="w-6 h-6 text-gray-500" />
                <span className="text-[11px] text-gray-500 mt-1">Agregar</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Título *</label>
          <input required value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="¿Qué estás publicando?"
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#EF4D28] transition-colors" />
        </div>

        {/* Categoría dinámica */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Categoría *</label>
          {emergencyCategories.length > 0 && (
            <>
              <p className="text-xs text-red-400 mb-2 font-medium">— Emergencia —</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {emergencyCategories.map(c => (
                  <button key={c.id} type="button" onClick={() => set('category_id', String(c.id))}
                    className={`px-3 py-2 rounded-xl text-sm text-left border transition-all cursor-pointer ${form.category_id === String(c.id) ? 'border-[#EF4D28] bg-[#EF4D28]/10 text-[#EF4D28]' : 'border-white/10 bg-[#1a1a1a] text-gray-400 hover:border-white/20'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </>
          )}
          {commercialCategories.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mb-2 font-medium">— General —</p>
              <div className="grid grid-cols-2 gap-2">
                {commercialCategories.map(c => (
                  <button key={c.id} type="button" onClick={() => set('category_id', String(c.id))}
                    className={`px-3 py-2 rounded-xl text-sm text-left border transition-all cursor-pointer ${form.category_id === String(c.id) ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 bg-[#1a1a1a] text-gray-400 hover:border-white/20'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Precio (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" min="0" step="0.5" value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="0 = Gratis / Donación"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#EF4D28] transition-colors" />
          </div>
        </div>

        {/* Condición */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Condición</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CONDITIONS).map(([k, v]) => (
              <button key={k} type="button" onClick={() => set('condition', k)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer ${form.condition === k ? 'border-[#EF4D28] bg-[#EF4D28]/10 text-[#EF4D28]' : 'border-white/10 bg-[#1a1a1a] text-gray-400 hover:border-white/20'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Descripción</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Describe el artículo, su estado..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#EF4D28] transition-colors resize-none" />
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Estado *</label>
            <select value={form.state} onChange={e => { set('state', e.target.value); set('city', '') }}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-[#EF4D28] transition-colors">
              <option value="">Selecciona...</option>
              {VENEZUELA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Ciudad</label>
            {form.state && CITIES_BY_STATE[form.state] ? (
              <select value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-[#EF4D28] transition-colors">
                <option value="">Selecciona...</option>
                {CITIES_BY_STATE[form.state].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Tu ciudad"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#EF4D28] transition-colors" />
            )}
          </div>
        </div>

        {/* Punto de referencia */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Punto de referencia <span className="text-gray-600">(sin dirección exacta)</span>
          </label>
          <input value={form.address_hint} onChange={e => set('address_hint', e.target.value)}
            placeholder="Cerca del CC Sambil, zona norte..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#EF4D28] transition-colors" />
        </div>

        {/* WhatsApp pre-rellenado */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Tu WhatsApp <span className="text-gray-600">(con código de país)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+</span>
            <input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
              placeholder="58 412 123 4567"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-7 pr-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-[#EF4D28] transition-colors" />
          </div>
          <p className="text-xs text-gray-600 mt-1">Los compradores te contactarán aquí</p>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            { key: 'is_urgent', label: 'Marcar como urgente', color: form.is_urgent ? 'bg-red-500' : 'bg-[#2a2a2a]' },
            { key: 'pickup_only', label: 'Solo recogida en persona', color: form.pickup_only ? 'bg-green-500' : 'bg-[#2a2a2a]' },
          ].map(({ key, label, color }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => set(key, !(form as any)[key])}
                className={`w-11 h-6 rounded-full transition-colors ${color} relative shrink-0`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${(form as any)[key] ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl">{error}</p>}

        <button type="submit" disabled={loading || !form.title || !form.category_id}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors cursor-pointer">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {loading ? 'Publicando...' : 'Publicar ahora'}
        </button>
      </form>
    </div>
  )
}

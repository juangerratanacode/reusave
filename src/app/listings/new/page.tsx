'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { compressImage } from '@/lib/image-compress'
import { CONDITIONS } from '@/types'
import { ArrowLeft, Camera, X } from 'lucide-react'
import Link from 'next/link'
import { VENEZUELA_STATES, CITIES_BY_STATE } from '@/lib/venezuela'

const CATEGORIES_EMERGENCY = [
  { value: 1, label: '🎁 Donación' },
  { value: 2, label: '🤝 Venta Solidaria' },
  { value: 3, label: '🆘 Necesidad Urgente' },
  { value: 4, label: '🔍 Objetos Perdidos/Encontrados' },
]
const CATEGORIES_COMMERCIAL = [
  { value: 5, label: '🏠 Hogar' },
  { value: 6, label: '⚡ Electrodomésticos' },
  { value: 7, label: '📱 Electrónica' },
  { value: 8, label: '👕 Ropa y Calzado' },
  { value: 9, label: '🔧 Herramientas' },
  { value: 10, label: '📦 Otros' },
]

export default function NewListingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - images.length)
    const compressed = await Promise.all(files.map((f) => compressImage(f, 300)))
    setImages((prev) => [...prev, ...compressed].slice(0, 3))
    const newPreviews = compressed.map((f) => URL.createObjectURL(f))
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 3))
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    try {
      // 1. Crear listing
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

      // 2. Actualizar WhatsApp en perfil si se proporcionó
      if (form.whatsapp) {
        await supabase.from('profiles').update({ whatsapp: form.whatsapp }).eq('id', user.id)
      }

      // 3. Subir imágenes
      const imageInserts = []
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const path = `${user.id}/${listing.id}/${Date.now()}-${i}.jpg`
        const { data: uploaded } = await supabase.storage
          .from('listing-images')
          .upload(path, file, { contentType: 'image/jpeg', upsert: true })

        if (uploaded) {
          const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(path)
          imageInserts.push({
            listing_id: listing.id,
            url: publicUrl,
            storage_path: path,
            is_cover: i === 0,
            sort_order: i,
          })
        }
      }

      if (imageInserts.length > 0) {
        await supabase.from('listing_images').insert(imageInserts)
      }

      router.push(`/listings/${listing.id}`)
    } catch (err: any) {
      setError(err.message ?? 'Error al publicar')
      setLoading(false)
    }
  }

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <header className="sticky top-0 z-10 bg-[#0f0f0f]/95 backdrop-blur border-b border-[#2a2a2a] px-4 h-14 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-semibold text-gray-100">Nueva publicación</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 pb-10 space-y-5">
        {/* Fotos */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fotos <span className="text-gray-500">(máx 3)</span>
          </label>
          <div className="flex gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#2a2a2a]">
                <img src={src} alt="" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[9px] bg-green-600 text-white px-1 rounded">PORTADA</span>
                )}
              </div>
            ))}
            {images.length < 3 && (
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-[#3a3a3a] flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition-colors">
                <Camera className="w-6 h-6 text-gray-500" />
                <span className="text-[11px] text-gray-500 mt-1">Agregar</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Título *</label>
          <input
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="¿Qué estás publicando?"
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
          <p className="text-xs text-red-400 mb-2 font-medium">— Emergencia —</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {CATEGORIES_EMERGENCY.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => set('category_id', String(c.value))}
                className={`px-3 py-2 rounded-xl text-sm text-left border transition-all ${
                  form.category_id === String(c.value)
                    ? 'border-green-500 bg-green-500/10 text-green-300'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-gray-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-2 font-medium">— General —</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES_COMMERCIAL.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => set('category_id', String(c.value))}
                className={`px-3 py-2 rounded-xl text-sm text-left border transition-all ${
                  form.category_id === String(c.value)
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-gray-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Precio (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="0 = Gratis / Donación"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-8 pr-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Condición */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Condición</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CONDITIONS).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => set('condition', k)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  form.condition === k
                    ? 'border-green-500 bg-green-500/10 text-green-300'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-gray-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Describe el artículo, su estado, por qué lo vendes..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 resize-none"
          />
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Estado *</label>
            <select
              value={form.state}
              onChange={(e) => { set('state', e.target.value); set('city', '') }}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-green-500"
            >
              <option value="">Selecciona...</option>
              {VENEZUELA_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ciudad</label>
            {form.state && CITIES_BY_STATE[form.state] ? (
              <select
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-green-500"
              >
                <option value="">Selecciona...</option>
                {CITIES_BY_STATE[form.state].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <input
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="Tu ciudad"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500"
              />
            )}
          </div>
        </div>

        {/* Pista de ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Punto de referencia <span className="text-gray-500">(sin dirección exacta)</span>
          </label>
          <input
            value={form.address_hint}
            onChange={(e) => set('address_hint', e.target.value)}
            placeholder="Cerca del CC Sambil, zona norte..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tu WhatsApp <span className="text-gray-500">(con código de país)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+</span>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              placeholder="58 412 123 4567"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-7 pr-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Opciones */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set('is_urgent', !form.is_urgent)}
              className={`w-11 h-6 rounded-full transition-colors ${form.is_urgent ? 'bg-red-500' : 'bg-[#2a2a2a]'} relative`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.is_urgent ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm text-gray-300">🆘 Marcar como urgente</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set('pickup_only', !form.pickup_only)}
              className={`w-11 h-6 rounded-full transition-colors ${form.pickup_only ? 'bg-green-500' : 'bg-[#2a2a2a]'} relative`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.pickup_only ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm text-gray-300">📍 Solo recogida en persona</span>
          </label>
        </div>

        {error && <p className="text-red-400 text-sm bg-red-900/20 px-4 py-3 rounded-xl">{error}</p>}

        <button
          type="submit"
          disabled={loading || !form.title || !form.category_id}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors text-base"
        >
          {loading ? 'Publicando...' : '✅ Publicar ahora'}
        </button>
      </form>
    </div>
  )
}

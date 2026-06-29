'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CONDITIONS } from '@/types'
import { Save, Loader2 } from 'lucide-react'
import BackButton from '@/components/layout/BackButton'
import { VENEZUELA_STATES, CITIES_BY_STATE } from '@/lib/venezuela'

export default function EditListingPage() {
  const supabase = createClient()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const [{ data: listing }, { data: cats }] = await Promise.all([
        supabase.from('listings').select('*').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
      ])

      if (!listing) { router.push('/profile'); return }

      setCategories(cats ?? [])
      setForm({
        title: listing.title ?? '',
        description: listing.description ?? '',
        price: listing.price?.toString() ?? '',
        category_id: listing.category_id?.toString() ?? '',
        condition: listing.condition ?? '',
        city: listing.city ?? '',
        state: listing.state ?? '',
        address_hint: listing.address_hint ?? '',
        is_urgent: listing.is_urgent ?? false,
        pickup_only: listing.pickup_only ?? true,
      })
      setLoading(false)
    }
    load()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error: err } = await supabase
      .from('listings')
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    setSaving(false)
    if (err) setError(err.message)
    else router.push(`/listings/${id}`)
  }

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const emergencyCategories = categories.filter(c => c.type === 'emergency')
  const commercialCategories = categories.filter(c => c.type !== 'emergency')

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/5 px-4 h-14 flex items-center gap-3">
        <BackButton />
        <h1 className="font-bold text-gray-100">Editar publicación</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 pb-10 space-y-5">

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Título *</label>
          <input
            required
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Categoría *</label>
          {emergencyCategories.length > 0 && (
            <>
              <p className="text-xs text-red-400 mb-2 font-medium">— Emergencia —</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {emergencyCategories.map(c => (
                  <button key={c.id} type="button" onClick={() => set('category_id', String(c.id))}
                    className={`px-3 py-2 rounded-xl text-sm text-left border transition-all cursor-pointer ${form.category_id === String(c.id) ? 'border-green-500 bg-green-500/10 text-green-300' : 'border-white/10 bg-[#1a1a1a] text-gray-400 hover:border-white/20'}`}>
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
              placeholder="0 = Gratis"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
        </div>

        {/* Condición */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Condición</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CONDITIONS).map(([k, v]) => (
              <button key={k} type="button" onClick={() => set('condition', k)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer ${form.condition === k ? 'border-green-500 bg-green-500/10 text-green-300' : 'border-white/10 bg-[#1a1a1a] text-gray-400 hover:border-white/20'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Descripción</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors resize-none" />
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Estado</label>
            <select value={form.state} onChange={e => { set('state', e.target.value); set('city', '') }}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-green-500 transition-colors">
              <option value="">Selecciona...</option>
              {VENEZUELA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Ciudad</label>
            {form.state && CITIES_BY_STATE[form.state] ? (
              <select value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-green-500 transition-colors">
                <option value="">Selecciona...</option>
                {CITIES_BY_STATE[form.state].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Tu ciudad"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors" />
            )}
          </div>
        </div>

        {/* Punto de referencia */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Punto de referencia</label>
          <input value={form.address_hint} onChange={e => set('address_hint', e.target.value)}
            placeholder="Cerca del CC Sambil..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors" />
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

        <button type="submit" disabled={saving || !form.title || !form.category_id}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-colors cursor-pointer">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CONDITIONS } from '@/types'
import { Save, Loader2 } from 'lucide-react'
import BackButton from '@/components/layout/BackButton'
import { VENEZUELA_STATES, CITIES_BY_STATE } from '@/lib/venezuela'

const CORAL = '#FF5A38'
const VERDE = '#0FA46A'
const TINTA = '#15221B'
const PAPEL = '#F5F0E5'

const INPUT = 'w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF5A38] transition-colors'
const LABEL = 'block text-sm font-medium mb-1.5'

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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPEL }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: CORAL }} />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPEL }}>
      <header className="sticky top-0 z-10 backdrop-blur border-b border-black/8 px-4 h-14 flex items-center gap-3" style={{ backgroundColor: `${PAPEL}F2` }}>
        <BackButton />
        <h1 className="font-semibold text-sm" style={{ color: TINTA }}>Editar publicación</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-6 pb-10 space-y-5">

        {/* Título */}
        <div>
          <label className={LABEL} style={{ color: '#6B7280' }}>Título *</label>
          <input
            required
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="¿Qué estás vendiendo?"
            className={INPUT}
            style={{ color: TINTA }}
          />
        </div>

        {/* Categoría */}
        <div>
          <label className={LABEL} style={{ color: '#6B7280' }}>Categoría *</label>
          {emergencyCategories.length > 0 && (
            <>
              <p className="text-xs font-medium mb-2" style={{ color: CORAL }}>— Emergencia —</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {emergencyCategories.map(c => (
                  <button key={c.id} type="button" onClick={() => set('category_id', String(c.id))}
                    className="px-3 py-2 rounded-xl text-sm text-left border transition-all cursor-pointer"
                    style={{
                      borderColor: form.category_id === String(c.id) ? CORAL : 'rgba(0,0,0,0.10)',
                      backgroundColor: form.category_id === String(c.id) ? '#FFF0EC' : 'white',
                      color: form.category_id === String(c.id) ? CORAL : '#6B7280',
                    }}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </>
          )}
          {commercialCategories.length > 0 && (
            <>
              <p className="text-xs font-medium mb-2" style={{ color: '#9CA3AF' }}>— General —</p>
              <div className="grid grid-cols-2 gap-2">
                {commercialCategories.map(c => (
                  <button key={c.id} type="button" onClick={() => set('category_id', String(c.id))}
                    className="px-3 py-2 rounded-xl text-sm text-left border transition-all cursor-pointer"
                    style={{
                      borderColor: form.category_id === String(c.id) ? CORAL : 'rgba(0,0,0,0.10)',
                      backgroundColor: form.category_id === String(c.id) ? '#FFF0EC' : 'white',
                      color: form.category_id === String(c.id) ? CORAL : TINTA,
                    }}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Precio */}
        <div>
          <label className={LABEL} style={{ color: '#6B7280' }}>Precio (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#9CA3AF' }}>$</span>
            <input type="number" min="0" step="0.5" value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="0 = Gratis"
              className={INPUT + ' pl-8'}
              style={{ color: TINTA }} />
          </div>
        </div>

        {/* Condición */}
        <div>
          <label className={LABEL} style={{ color: '#6B7280' }}>Condición</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CONDITIONS).map(([k, v]) => (
              <button key={k} type="button" onClick={() => set('condition', k)}
                className="px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer"
                style={{
                  borderColor: form.condition === k ? CORAL : 'rgba(0,0,0,0.10)',
                  backgroundColor: form.condition === k ? '#FFF0EC' : 'white',
                  color: form.condition === k ? CORAL : TINTA,
                }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className={LABEL} style={{ color: '#6B7280' }}>Descripción</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Describe el estado, características, por qué lo vendes..."
            className={INPUT + ' resize-none'}
            style={{ color: TINTA }} />
        </div>

        {/* Ubicación */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL} style={{ color: '#6B7280' }}>Estado</label>
            <select value={form.state} onChange={e => { set('state', e.target.value); set('city', '') }}
              className={INPUT}
              style={{ color: form.state ? TINTA : '#9CA3AF' }}>
              <option value="">Selecciona...</option>
              {VENEZUELA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL} style={{ color: '#6B7280' }}>Ciudad</label>
            {form.state && CITIES_BY_STATE[form.state] ? (
              <select value={form.city} onChange={e => set('city', e.target.value)}
                className={INPUT}
                style={{ color: form.city ? TINTA : '#9CA3AF' }}>
                <option value="">Selecciona...</option>
                {CITIES_BY_STATE[form.state].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Tu ciudad"
                className={INPUT}
                style={{ color: TINTA }} />
            )}
          </div>
        </div>

        {/* Punto de referencia */}
        <div>
          <label className={LABEL} style={{ color: '#6B7280' }}>Punto de referencia</label>
          <input value={form.address_hint} onChange={e => set('address_hint', e.target.value)}
            placeholder="Cerca del CC Sambil..."
            className={INPUT}
            style={{ color: TINTA }} />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            { key: 'is_urgent', label: 'Marcar como urgente', activeColor: CORAL },
            { key: 'pickup_only', label: 'Solo recogida en persona', activeColor: VERDE },
          ].map(({ key, label, activeColor }) => {
            const isOn = (form as any)[key]
            return (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => set(key, !isOn)}
                  className="w-11 h-6 rounded-full transition-colors relative shrink-0"
                  style={{ backgroundColor: isOn ? activeColor : 'rgba(0,0,0,0.12)' }}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isOn ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm" style={{ color: TINTA }}>{label}</span>
              </label>
            )
          })}
        </div>

        {error && (
          <p className="text-sm px-4 py-3 rounded-xl" style={{ color: '#EF4444', backgroundColor: '#FEF2F2' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={saving || !form.title || !form.category_id}
          className="w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ backgroundColor: CORAL, color: 'white' }}>
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}

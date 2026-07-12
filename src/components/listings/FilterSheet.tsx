'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { Category } from '@/types'

const CORAL = '#FF5A38'
const TINTA = '#15221B'
const PAPEL = '#F5F0E5'

const LISTING_TYPES = [
  { value: 'sale', label: '💰 Venta' },
  { value: 'exchange', label: '💱 Intercambio' },
  { value: 'donation', label: '🎁 Donación' },
]

export default function FilterSheet({ categories, activeCategory }: { categories: Category[], activeCategory?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState(activeCategory ?? '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('min') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') ?? '')

  useEffect(() => {
    setSelectedCategory(activeCategory ?? '')
    setSelectedType(searchParams.get('type') ?? '')
    setMinPrice(searchParams.get('min') ?? '')
    setMaxPrice(searchParams.get('max') ?? '')
  }, [open])

  const activeCount = [
    searchParams.get('category'),
    searchParams.get('type'),
    searchParams.get('min'),
    searchParams.get('max'),
  ].filter(Boolean).length

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCategory) params.set('category', selectedCategory)
    else params.delete('category')
    if (selectedType) params.set('type', selectedType)
    else params.delete('type')
    if (minPrice) params.set('min', minPrice)
    else params.delete('min')
    if (maxPrice) params.set('max', maxPrice)
    else params.delete('max')
    router.push(`/feed?${params.toString()}`)
    setOpen(false)
  }

  const clear = () => {
    setSelectedCategory('')
    setSelectedType('')
    setMinPrice('')
    setMaxPrice('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('type')
    params.delete('min')
    params.delete('max')
    router.push(`/feed?${params.toString()}`)
    setOpen(false)
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 flex items-center gap-1.5 text-base font-bold px-4 py-2.5 rounded-full border-2 transition-all whitespace-nowrap cursor-pointer relative"
        style={{
          backgroundColor: activeCount > 0 ? CORAL : 'white',
          color: activeCount > 0 ? 'white' : TINTA,
          borderColor: activeCount > 0 ? CORAL : 'rgba(0,0,0,0.10)',
        }}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-[10px] font-black rounded-full flex items-center justify-center" style={{ color: CORAL }}>
            {activeCount}
          </span>
        )}
      </button>

      {!open ? null : (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Bottom sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            style={{ animation: 'slideUp 0.25s ease-out' }}>

            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-black/10" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
              <h2 className="text-base font-bold" style={{ color: TINTA }}>Filtros</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-black/5 cursor-pointer">
                <X className="w-5 h-5" style={{ color: '#9CA3AF' }} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6 pb-6">

              {/* Categorías */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Categoría</p>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                      className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer text-center"
                      style={{
                        backgroundColor: selectedCategory === cat.slug ? '#FFF0EC' : PAPEL,
                        borderColor: selectedCategory === cat.slug ? CORAL : 'transparent',
                        color: selectedCategory === cat.slug ? CORAL : TINTA,
                      }}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="leading-tight">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Tipo</p>
                <div className="flex gap-2 flex-wrap">
                  {LISTING_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setSelectedType(selectedType === t.value ? '' : t.value)}
                      className="flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer"
                      style={{
                        backgroundColor: selectedType === t.value ? '#FFF0EC' : PAPEL,
                        borderColor: selectedType === t.value ? CORAL : 'transparent',
                        color: selectedType === t.value ? CORAL : TINTA,
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Precio (USD)</p>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: '#9CA3AF' }}>$</span>
                    <input
                      type="number" min="0" value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      placeholder="Mín"
                      className="w-full border border-black/10 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A38] transition-colors"
                      style={{ backgroundColor: PAPEL, color: TINTA }}
                    />
                  </div>
                  <span className="text-gray-300 font-bold">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: '#9CA3AF' }}>$</span>
                    <input
                      type="number" min="0" value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      placeholder="Máx"
                      className="w-full border border-black/10 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#FF5A38] transition-colors"
                      style={{ backgroundColor: PAPEL, color: TINTA }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-black/5">
              <button
                onClick={clear}
                className="flex-1 py-3.5 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer"
                style={{ borderColor: 'rgba(0,0,0,0.12)', color: TINTA }}
              >
                Limpiar
              </button>
              <button
                onClick={apply}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-all cursor-pointer hover:opacity-90"
                style={{ backgroundColor: CORAL }}
              >
                Aplicar filtros
              </button>
            </div>
          </div>

          <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
        </>
      )}
    </>
  )
}

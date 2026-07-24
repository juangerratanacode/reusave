'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ChevronDown, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const CORAL = '#FF5A38'
const VERDE = '#0FA46A'
const TINTA = '#15221B'
const PAPEL = '#F5F0E5'

type SortKey = 'recent' | 'oldest' | 'price_asc' | 'price_desc'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Más recientes' },
  { key: 'oldest', label: 'Más antiguos' },
  { key: 'price_asc', label: 'Menor precio' },
  { key: 'price_desc', label: 'Mayor precio' },
]

const TABS = ['Productos', 'Búsquedas guardadas', 'Vendedores'] as const
type Tab = typeof TABS[number]

export default function FavoritesClient({ listings }: { listings: any[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('Productos')
  const [sort, setSort] = useState<SortKey>('recent')
  const [sortOpen, setSortOpen] = useState(false)

  const sorted = useMemo(() => {
    const copy = [...listings]
    if (sort === 'recent') return copy.sort((a, b) => new Date(b.favorited_at).getTime() - new Date(a.favorited_at).getTime())
    if (sort === 'oldest') return copy.sort((a, b) => new Date(a.favorited_at).getTime() - new Date(b.favorited_at).getTime())
    if (sort === 'price_asc') return copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    if (sort === 'price_desc') return copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    return copy
  }, [listings, sort])

  const sortLabel = SORT_OPTIONS.find(o => o.key === sort)?.label ?? 'Recientes'

  return (
    <main className="max-w-2xl mx-auto px-4 pt-16 pb-28">
      <h1 className="font-display text-lg font-bold mt-5 mb-4" style={{ color: TINTA }}>Guardados</h1>

      {/* Tabs */}
      <div className="flex border-b border-black/8 mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="shrink-0 pb-2.5 mr-6 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap"
            style={{
              borderColor: activeTab === tab ? CORAL : 'transparent',
              color: activeTab === tab ? CORAL : '#9CA3AF',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== 'Productos' ? (
        /* Estado vacío para tabs no implementados */
        <div className="text-center py-24">
          <div className="w-14 h-14 rounded-2xl bg-white border border-black/8 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{activeTab === 'Búsquedas guardadas' ? '🔍' : '👤'}</span>
          </div>
          <p className="font-semibold mb-1" style={{ color: TINTA }}>Próximamente</p>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>Esta función estará disponible pronto.</p>
        </div>
      ) : listings.length === 0 ? (
        /* Estado vacío de productos */
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-white border border-black/8 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🤍</span>
          </div>
          <p className="font-semibold mb-1" style={{ color: TINTA }}>Aún no tienes nada guardado</p>
          <p className="text-sm mb-5" style={{ color: '#9CA3AF' }}>Guarda artículos que te interesen para verlos luego</p>
          <Link
            href="/feed"
            className="inline-block font-bold text-sm px-6 py-3 rounded-xl text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: CORAL }}
          >
            Explorar publicaciones
          </Link>
        </div>
      ) : (
        <>
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              {listings.length} {listings.length === 1 ? 'artículo' : 'artículos'}
            </p>
            <div className="relative">
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border border-black/10 bg-white cursor-pointer hover:border-black/20 transition-colors"
                style={{ color: TINTA }}
              >
                <span>⇅</span>
                {sortLabel}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} style={{ color: '#9CA3AF' }} />
              </button>

              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 z-30 bg-white border border-black/8 rounded-2xl shadow-xl overflow-hidden min-w-[180px]">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { setSort(opt.key); setSortOpen(false) }}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm text-left cursor-pointer transition-colors hover:bg-[#FFF0EC]"
                        style={{ color: sort === opt.key ? CORAL : TINTA, fontWeight: sort === opt.key ? 600 : 400 }}
                      >
                        {opt.label}
                        {sort === opt.key && <Check className="w-3.5 h-3.5" style={{ color: CORAL }} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-3">
            {sorted.map((listing: any) => {
              const cover = listing.listing_images?.find((i: any) => i.is_cover) ?? listing.listing_images?.[0]
              return (
                <Link key={listing.id} href={`/listings/${listing.id}`}>
                  <article className="bg-white rounded-2xl overflow-hidden border border-black/8 hover:shadow-md transition-shadow">
                    {/* Imagen */}
                    <div className="relative aspect-square bg-[#E8E4DC]">
                      {cover ? (
                        <Image
                          src={cover.url}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="(max-width:640px) 50vw, 300px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                      )}
                      {/* Corazón rojo — siempre activo en favoritos */}
                      <div
                        className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: 'white' }}
                      >
                        <Heart className="w-4 h-4 fill-current" style={{ color: CORAL }} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2.5">
                      <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-1" style={{ color: TINTA }}>
                        {listing.title}
                      </h3>
                      <p className="text-sm font-bold" style={{ color: listing.price === 0 ? CORAL : VERDE }}>
                        {listing.listing_type === 'exchange'
                          ? '💱 Intercambio'
                          : formatPrice(listing.price, listing.currency)}
                      </p>
                      {listing.has_shipping && (
                        <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>📦 Envío disponible</p>
                      )}
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </main>
  )
}

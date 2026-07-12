'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/types'
import { formatPrice, timeAgo } from '@/lib/utils'
import { MoreVertical, Pencil, CheckCircle, Trash2, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const CORAL = '#FF5A38'
const VERDE = '#0FA46A'
const TINTA = '#15221B'

export default function MyListingCard({ listing }: { listing: Listing }) {
  const supabase = createClient()
  const router = useRouter()
  const cover = listing.listing_images?.find(i => i.is_cover) ?? listing.listing_images?.[0]
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isSold = listing.status === 'sold'

  const markAs = async (status: 'active' | 'sold') => {
    setLoading(true)
    setOpen(false)
    await supabase.from('listings').update({ status }).eq('id', listing.id)
    router.refresh()
    setLoading(false)
  }

  const deleteListing = async () => {
    if (!confirm('¿Eliminar esta publicación? No se puede deshacer.')) return
    setLoading(true)
    setOpen(false)
    await supabase.from('listings').update({ status: 'deleted' }).eq('id', listing.id)
    router.refresh()
    setLoading(false)
  }

  return (
    <article
      className="relative bg-white rounded-2xl overflow-hidden border transition-all"
      style={{
        borderColor: isSold ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.10)',
        opacity: isSold ? 0.65 : 1,
      }}
    >
      {/* Image */}
      <Link href={`/listings/${listing.id}`}>
        <div className="relative aspect-square bg-[#E8E4DC]">
          {cover ? (
            <Image src={cover.url} alt={listing.title} fill className="object-cover" sizes="(max-width:640px) 50vw, 300px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Eye className="w-8 h-8" style={{ color: '#C5BFB8' }} />
            </div>
          )}
          {isSold && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide" style={{ color: TINTA }}>Vendido</span>
            </div>
          )}
          {listing.is_urgent && !isSold && (
            <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: CORAL }}>URGENTE</span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-2.5 pr-8">
        <h3 className="text-sm font-semibold line-clamp-2 leading-snug" style={{ color: TINTA }}>{listing.title}</h3>
        <p className="text-base font-bold mt-1" style={{ color: VERDE }}>{formatPrice(listing.price)}</p>
        <p className="text-[10px] mt-1" style={{ color: '#9CA3AF' }}>{timeAgo(listing.created_at)}</p>
      </div>

      {/* Menu button */}
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer z-10"
        style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', border: '1px solid rgba(0,0,0,0.08)' }}
      >
        <MoreVertical className="w-4 h-4" style={{ color: TINTA }} />
      </button>

      {/* Dropdown menu */}
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-9 right-2 z-30 bg-white border border-black/8 rounded-2xl shadow-xl overflow-hidden min-w-[160px]">
            <Link
              href={`/listings/${listing.id}/edit`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm transition-colors cursor-pointer hover:bg-[#FFF0EC]"
              style={{ color: TINTA }}
            >
              <Pencil className="w-4 h-4 shrink-0" style={{ color: CORAL }} />
              Editar
            </Link>

            {isSold ? (
              <button
                onClick={() => markAs('active')}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors cursor-pointer text-left hover:bg-[#F0FBF6]"
                style={{ color: TINTA }}
              >
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: VERDE }} />
                Marcar disponible
              </button>
            ) : (
              <button
                onClick={() => markAs('sold')}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors cursor-pointer text-left hover:bg-[#F0FBF6]"
                style={{ color: TINTA }}
              >
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: VERDE }} />
                Marcar como vendido
              </button>
            )}

            <div className="border-t border-black/5" />
            <button
              onClick={deleteListing}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors cursor-pointer text-left hover:bg-red-50"
              style={{ color: '#EF4444' }}
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              Eliminar
            </button>
          </div>
        </>
      )}
    </article>
  )
}

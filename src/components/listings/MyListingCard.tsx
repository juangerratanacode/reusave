'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/types'
import { formatPrice, timeAgo } from '@/lib/utils'
import { MoreVertical, Pencil, CheckCircle, Trash2, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

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
    <article className={cn('relative bg-[#1a1a1a] rounded-xl overflow-hidden border transition-all', isSold ? 'border-white/5 opacity-60' : 'border-white/10')}>
      {/* Image */}
      <Link href={`/listings/${listing.id}`}>
        <div className="relative aspect-square bg-[#222]">
          {cover ? (
            <Image src={cover.url} alt={listing.title} fill className="object-cover" sizes="(max-width:640px) 50vw, 300px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Eye className="w-8 h-8 text-gray-700" />
            </div>
          )}
          {isSold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">Vendido</span>
            </div>
          )}
          {listing.is_urgent && !isSold && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">URGENTE</span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-2.5 pr-8">
        <h3 className="text-sm font-medium text-gray-100 line-clamp-2 leading-snug">{listing.title}</h3>
        <p className="text-base font-bold text-green-400 mt-1">{formatPrice(listing.price)}</p>
        <p className="text-[10px] text-gray-600 mt-1">{timeAgo(listing.created_at)}</p>
      </div>

      {/* Menu button */}
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer z-10"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-9 right-2 z-30 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden min-w-[160px]">
            <Link
              href={`/listings/${listing.id}/edit`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4 text-blue-400 shrink-0" />
              Editar
            </Link>

            {isSold ? (
              <button
                onClick={() => markAs('active')}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                Marcar disponible
              </button>
            ) : (
              <button
                onClick={() => markAs('sold')}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                Marcar como vendido
              </button>
            )}

            <div className="border-t border-white/5" />
            <button
              onClick={deleteListing}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
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

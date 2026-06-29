import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/types'
import { formatPrice, timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

export default function ListingCard({ listing }: { listing: Listing }) {
  const cover = listing.listing_images?.find((i) => i.is_cover) ?? listing.listing_images?.[0]
  const cat = listing.categories

  const categoryStyle = {
    donacion: 'bg-green-500/10 text-green-400 border-green-800/50',
    'venta-solidaria': 'bg-orange-500/10 text-orange-400 border-orange-800/50',
    'necesidad-urgente': 'bg-red-500/10 text-red-400 border-red-800/50',
    'objetos-perdidos': 'bg-purple-500/10 text-purple-400 border-purple-800/50',
  }[cat?.slug ?? ''] ?? 'bg-gray-800 text-gray-400 border-gray-700'

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <article
        className={cn(
          'bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all active:scale-95',
          listing.is_urgent && 'border-red-800/70 neon-pulse'
        )}
      >
        {/* Imagen */}
        <div className="relative aspect-square bg-[#222]">
          {cover ? (
            <Image
              src={cover.url}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 300px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
          )}
          {listing.is_urgent && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              URGENTE
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-2.5">
          {cat && (
            <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded border', categoryStyle)}>
              {cat.icon} {cat.name}
            </span>
          )}
          <h3 className="text-sm font-medium text-gray-100 mt-1.5 line-clamp-2 leading-snug">
            {listing.title}
          </h3>
          <p className="text-base font-bold text-green-400 mt-1">
            {formatPrice(listing.price)}
          </p>
          {listing.city && (
            <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-0.5">
              <MapPin className="w-3 h-3" /> {listing.city}
            </p>
          )}
          <p className="text-[10px] text-gray-600 mt-1">{timeAgo(listing.created_at)}</p>
        </div>
      </article>
    </Link>
  )
}

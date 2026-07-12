import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/types'
import { formatPrice, timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'
import FavoriteButton from './FavoriteButton'

const VERDE = '#22A45D'
const CORAL = '#EF4D28'
const TINTA = '#0F1B13'

export default function ListingCard({ listing }: { listing: Listing }) {
  const cover = listing.listing_images?.find((i) => i.is_cover) ?? listing.listing_images?.[0]
  const cat = listing.categories

  const categoryStyle = {
    donacion: { bg: '#DCFAEB', text: VERDE, border: '#A7F3C1' },
    'venta-solidaria': { bg: '#FDEEE9', text: CORAL, border: '#FBBFAA' },
    'necesidad-urgente': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    'objetos-perdidos': { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' },
  }[cat?.slug ?? ''] ?? { bg: '#F5F2ED', text: '#9CA3AF', border: '#E5E0D8' }

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <article
        className={cn(
          'bg-white rounded-xl overflow-hidden border hover:shadow-md transition-all active:scale-95',
          listing.is_urgent ? 'border-[#EF4D28]/40' : 'border-black/8'
        )}
      >
        <div className="relative aspect-square bg-[#F5F2ED]">
          {cover ? (
            <Image src={cover.url} alt={listing.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, 300px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
          )}
          <FavoriteButton listingId={listing.id} />
          {listing.status === 'sold' && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-[#0F1B13] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">Vendido</span>
            </div>
          )}
          {listing.is_urgent && listing.status !== 'sold' && (
            <span className="absolute top-2 left-2 bg-[#EF4D28] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">URGENTE</span>
          )}
        </div>
        <div className="p-2.5">
          {cat && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border" style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text, borderColor: categoryStyle.border }}>
              {cat.icon} {cat.name}
            </span>
          )}
          <h3 className="text-sm font-medium mt-1.5 line-clamp-2 leading-snug" style={{ color: TINTA }}>{listing.title}</h3>
          <p className="text-base font-bold mt-1" style={{ color: VERDE }}>{formatPrice(listing.price)}</p>
          {listing.city && (
            <p className="text-[11px] mt-1 flex items-center gap-0.5" style={{ color: '#9CA3AF' }}>
              <MapPin className="w-3 h-3" /> {listing.city}
            </p>
          )}
          <p className="text-[10px] mt-1" style={{ color: '#B0A89E' }}>{timeAgo(listing.created_at)}</p>
        </div>
      </article>
    </Link>
  )
}

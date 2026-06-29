import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { buildWhatsAppLink, formatPrice, timeAgo } from '@/lib/utils'
import { CONDITIONS, Listing } from '@/types'
import { MapPin, Clock, Eye, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import BackButton from '@/components/layout/BackButton'
import ReportButton from '@/components/listings/ReportButton'

// NOTA: Renombra esta carpeta de /id a /[id] después de copiarla
// Next.js usa corchetes para rutas dinámicas: src/app/listings/[id]/page.tsx

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select(`
      *,
      profiles (id, username, full_name, avatar_url, whatsapp, city, is_verified),
      categories (id, slug, name, icon, color, type),
      listing_images (id, url, is_cover, sort_order)
    `)
    .eq('id', params.id)
    .neq('status', 'deleted')
    .single()

  if (!listing) notFound()

  // Incrementar vistas (fire and forget)
  supabase.rpc('increment_views', { listing_uuid: listing.id }).then(() => {})

  const images = (listing.listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)
  const profile = listing.profiles as any
  const cat = listing.categories as any
  const whatsappLink = profile?.whatsapp
    ? buildWhatsAppLink(
        profile.whatsapp,
        listing.title,
        `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reusa.ve'}/listings/${listing.id}`
      )
    : null

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0f0f0f]/95 backdrop-blur border-b border-[#2a2a2a] px-4 h-14 flex items-center gap-3">
        <BackButton />
        <h1 className="font-semibold text-gray-100 truncate">{listing.title}</h1>
      </header>

      <main className="max-w-2xl mx-auto pb-32">
        {/* Galería de imágenes */}
        {images.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 p-3">
            {images.map((img: any) => (
              <div key={img.id} className="shrink-0 snap-center w-full aspect-square relative rounded-xl overflow-hidden bg-[#1a1a1a]">
                <Image src={img.url} alt={listing.title} fill className="object-cover" sizes="100vw" />
              </div>
            ))}
          </div>
        ) : (
          <div className="aspect-video bg-[#1a1a1a] flex items-center justify-center text-6xl">📦</div>
        )}

        <div className="px-4 py-4 space-y-4">
          {/* Categoría + urgente */}
          <div className="flex items-center gap-2 flex-wrap">
            {cat && (
              <span className="text-xs px-2 py-1 rounded-full border border-[#2a2a2a] text-gray-400">
                {cat.icon} {cat.name}
              </span>
            )}
            {listing.is_urgent && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-600 text-white font-bold animate-pulse">
                🆘 URGENTE
              </span>
            )}
            {listing.pickup_only && (
              <span className="text-xs px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400">
                📍 Solo recogida
              </span>
            )}
          </div>

          {/* Título y precio */}
          <div>
            <h2 className="text-xl font-bold text-gray-100">{listing.title}</h2>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {formatPrice(listing.price, listing.currency)}
            </p>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            {listing.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {listing.city}{listing.state ? `, ${listing.state}` : ''}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {timeAgo(listing.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {listing.views_count} vistas
            </span>
          </div>

          {/* Condición */}
          {listing.condition && (
            <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-400">Condición</span>
              <span className="text-sm font-medium text-gray-200">
                {CONDITIONS[listing.condition as keyof typeof CONDITIONS] ?? listing.condition}
              </span>
            </div>
          )}

          {/* Descripción */}
          {listing.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Descripción</h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {/* Punto de referencia */}
          {listing.address_hint && (
            <div className="bg-[#1a1a1a] rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500 mb-1">📍 Punto de referencia</p>
              <p className="text-sm text-gray-300">{listing.address_hint}</p>
            </div>
          )}

          {/* Vendedor */}
          {profile && (
            <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt="" width={40} height={40} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-200 text-sm truncate">
                  {profile.full_name ?? profile.username ?? 'Usuario'}
                  {profile.is_verified && (
                    <CheckCircle className="inline-block w-3.5 h-3.5 text-green-400 ml-1" />
                  )}
                </p>
                {profile.city && <p className="text-xs text-gray-500">{profile.city}</p>}
              </div>
            </div>
          )}

          <ReportButton listingId={listing.id} />
        </div>
      </main>

      {/* CTA flotante */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0f0f0f]/95 backdrop-blur border-t border-[#2a2a2a]">
        <div className="max-w-2xl mx-auto">
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#25D366] hover:bg-[#20BD5C] text-white font-bold py-4 rounded-xl text-center text-base transition-colors"
            >
              💬 Contactar por WhatsApp
            </a>
          ) : (
            <p className="text-center text-gray-500 text-sm">El vendedor no tiene WhatsApp configurado.</p>
          )}
        </div>
      </div>
    </div>
  )
}

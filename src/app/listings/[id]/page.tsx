import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { buildWhatsAppLink, formatPrice, timeAgo } from '@/lib/utils'
import { CONDITIONS } from '@/types'
import { MapPin, Clock, Eye, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import BackButton from '@/components/layout/BackButton'
import ReportButton from '@/components/listings/ReportButton'

const CORAL = '#EF4D28'
const VERDE = '#22A45D'
const TINTA = '#0F1B13'
const PAPEL = '#F0EDE6'

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: listing }, { data: { session } }] = await Promise.all([
    supabase
      .from('listings')
      .select(`
        *,
        profiles (id, username, full_name, avatar_url, whatsapp, city, is_verified),
        categories (id, slug, name, icon, color, type),
        listing_images (id, url, is_cover, sort_order)
      `)
      .eq('id', params.id)
      .neq('status', 'deleted')
      .single(),
    supabase.auth.getSession(),
  ])

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
        `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://entrayresuelve.com'}/listings/${listing.id}`
      )
    : null

  const isOwner = session?.user?.id === listing.user_id

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAPEL }}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-black/8 px-4 h-14 flex items-center gap-3">
        <BackButton />
        <h1 className="font-semibold truncate text-sm" style={{ color: TINTA }}>{listing.title}</h1>
      </header>

      <main className="max-w-2xl mx-auto pb-32">
        {/* Galería */}
        {images.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 p-3">
            {images.map((img: any) => (
              <div key={img.id} className="shrink-0 snap-center w-full aspect-square relative rounded-2xl overflow-hidden bg-[#E8E4DC]">
                <Image src={img.url} alt={listing.title} fill className="object-cover" sizes="100vw" />
              </div>
            ))}
          </div>
        ) : (
          <div className="aspect-video bg-[#E8E4DC] flex items-center justify-center text-6xl rounded-2xl m-3">📦</div>
        )}

        <div className="px-4 py-4 space-y-4">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {cat && (
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#F0EDE6', color: '#6B7280', border: '1px solid rgba(0,0,0,0.08)' }}>
                {cat.icon} {cat.name}
              </span>
            )}
            {listing.is_urgent && (
              <span className="text-xs px-3 py-1 rounded-full font-bold text-white" style={{ backgroundColor: CORAL }}>
                🆘 URGENTE
              </span>
            )}
            {listing.pickup_only && (
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#F0EDE6', color: '#6B7280', border: '1px solid rgba(0,0,0,0.08)' }}>
                📍 Solo recogida
              </span>
            )}
          </div>

          {/* Título y precio */}
          <div>
            <h2 className="text-xl font-bold" style={{ color: TINTA }}>{listing.title}</h2>
            <p className="text-3xl font-black mt-1" style={{ color: VERDE }}>
              {formatPrice(listing.price, listing.currency)}
            </p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-sm" style={{ color: '#9CA3AF' }}>
            {listing.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {listing.city}{listing.state ? `, ${listing.state}` : ''}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {timeAgo(listing.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {listing.views_count} vistas
            </span>
          </div>

          {/* Condición */}
          {listing.condition && (
            <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-black/8">
              <span className="text-sm" style={{ color: '#6B7280' }}>Condición</span>
              <span className="text-sm font-semibold" style={{ color: TINTA }}>
                {CONDITIONS[listing.condition as keyof typeof CONDITIONS] ?? listing.condition}
              </span>
            </div>
          )}

          {/* Descripción */}
          {listing.description && (
            <div className="bg-white rounded-xl px-4 py-4 border border-black/8">
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF' }}>Descripción</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: TINTA }}>{listing.description}</p>
            </div>
          )}

          {/* Punto de referencia */}
          {listing.address_hint && (
            <div className="bg-white rounded-xl px-4 py-3 border border-black/8">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9CA3AF' }}>📍 Punto de referencia</p>
              <p className="text-sm" style={{ color: TINTA }}>{listing.address_hint}</p>
            </div>
          )}

          {/* Vendedor */}
          {profile && (
            <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-black/8">
              <div className="w-11 h-11 rounded-full bg-[#E8E4DC] overflow-hidden shrink-0">
                {profile.avatar_url ? (
                  <Image src={profile.avatar_url} alt="" width={44} height={44} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate flex items-center gap-1" style={{ color: TINTA }}>
                  {profile.full_name ?? profile.username ?? 'Usuario'}
                  {profile.is_verified && <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: VERDE }} />}
                </p>
                {profile.city && <p className="text-xs" style={{ color: '#9CA3AF' }}>{profile.city}</p>}
              </div>
            </div>
          )}

          {/* Editar si es el dueño */}
          {isOwner && (
            <Link
              href={`/listings/${listing.id}/edit`}
              className="block text-center text-sm font-semibold py-3 rounded-xl border border-black/15 hover:border-black/30 transition-colors"
              style={{ color: TINTA }}
            >
              ✏️ Editar mi publicación
            </Link>
          )}

          <ReportButton listingId={listing.id} />
        </div>
      </main>

      {/* CTA flotante */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-black/8">
        <div className="max-w-2xl mx-auto">
          {session ? (
            /* Usuario registrado → WhatsApp */
            whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full text-white font-bold py-4 rounded-xl text-base transition-all hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
              >
                💬 Contactar por WhatsApp
              </a>
            ) : (
              <p className="text-center text-sm" style={{ color: '#9CA3AF' }}>El vendedor no tiene WhatsApp configurado.</p>
            )
          ) : (
            /* No registrado → prompt de registro */
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-xs" style={{ color: '#9CA3AF' }}>
                <ShieldCheck className="w-4 h-4" style={{ color: VERDE }} />
                Regístrate gratis para contactar al vendedor
              </div>
              <div className="flex gap-3 w-full">
                <Link
                  href={`/auth/signup?redirect=/listings/${listing.id}`}
                  className="flex-1 flex items-center justify-center text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: CORAL }}
                >
                  Crear cuenta gratis
                </Link>
                <Link
                  href={`/auth/login?redirect=/listings/${listing.id}`}
                  className="flex items-center justify-center font-semibold px-5 py-3.5 rounded-xl border border-black/15 hover:border-black/30 transition-colors"
                  style={{ color: TINTA }}
                >
                  Entrar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

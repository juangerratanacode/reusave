import { createClient } from '@/lib/supabase-server'
import { Suspense } from 'react'
import ListingCard from '@/components/listings/ListingCard'
import CategoryFilter from '@/components/listings/CategoryFilter'
import StateFilter from '@/components/listings/StateFilter'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import { FeedSkeleton } from '@/components/listings/ListingSkeleton'
import { Listing } from '@/types'

export const dynamic = 'force-dynamic'

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; state?: string; min?: string; max?: string; type?: string }
}) {
  const supabase = createClient()

  // Feed is public — no auth required
  let query = supabase
    .from('listings')
    .select(`
      *,
      profiles (id, username, full_name, whatsapp, city),
      categories (id, slug, name, icon, color, type),
      listing_images (id, url, is_cover, sort_order)
    `)
    .eq('status', 'active')
    .order('is_urgent', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(40)

  if (searchParams.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.category)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (searchParams.q) {
    const term = `%${searchParams.q}%`
    query = query.or(`title.ilike.${term},description.ilike.${term}`)
  }

  if (searchParams.state) {
    query = query.eq('state', searchParams.state)
  }

  if (searchParams.min) {
    query = query.gte('price', parseFloat(searchParams.min))
  }

  if (searchParams.max) {
    query = query.lte('price', parseFloat(searchParams.max))
  }

  if (searchParams.type) {
    query = query.eq('listing_type', searchParams.type)
  }

  const { data: listings } = await query

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const hasFilters = searchParams.state || searchParams.category || searchParams.q

  return (
    <div className="min-h-screen bg-[#F5F0E5]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24">

        {/* Banner emergencia */}
        <div className="bg-[#FFF5F2] border border-[#FBBFAA] rounded-2xl px-4 py-3 mb-5 mt-4 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FF5A38] animate-pulse shrink-0" />
          <p className="text-sm font-medium" style={{ color: '#15221B' }}>
            <strong>Apoyo post-sismo Venezuela</strong> — Comparte lo que no usas. Encuentra lo que necesitas.
          </p>
        </div>

        {/* Filtros */}
        <CategoryFilter categories={categories ?? []} active={searchParams.category} />
        <StateFilter activeState={searchParams.state} />

        {/* Header resultados */}
        {hasFilters && (
          <p className="text-xs mt-4 mb-2" style={{ color: '#9CA3AF' }}>
            {listings?.length ?? 0} resultado{(listings?.length ?? 0) !== 1 ? 's' : ''}
            {searchParams.state ? ` en ${searchParams.state}` : ''}
            {searchParams.q ? ` para "${searchParams.q}"` : ''}
          </p>
        )}

        {/* Grid de listings */}
        <Suspense fallback={<FeedSkeleton />}>
          {listings && listings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing as Listing} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-white border border-black/8 flex items-center justify-center mb-4">
                <svg className="w-8 h-8" style={{ color: '#B0A89E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <p className="font-semibold" style={{ color: '#15221B' }}>No hay publicaciones aún</p>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>¡Sé el primero en publicar!</p>
            </div>
          )}
        </Suspense>
      </main>

      <BottomNav />
    </div>
  )
}

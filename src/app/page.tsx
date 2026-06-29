import { createClient } from '@/lib/supabase-server'
import ListingCard from '@/components/listings/ListingCard'
import CategoryFilter from '@/components/listings/CategoryFilter'
import StateFilter from '@/components/listings/StateFilter'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import { Listing } from '@/types'

export const revalidate = 60

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; state?: string }
}) {
  const supabase = createClient()

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
    query = query.ilike('title', `%${searchParams.q}%`)
  }

  if (searchParams.state) {
    query = query.eq('state', searchParams.state)
  }

  const { data: listings } = await query

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-3 pt-16 pb-24">
        {/* Banner emergencia */}
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-800/50 rounded-xl p-4 mb-4 mt-3">
          <p className="text-sm text-red-200 font-medium">
            🆘 <strong>Apoyo post-sismo Venezuela</strong> — Comparte lo que no usas. Encuentra lo que necesitas.
          </p>
        </div>

        {/* Categorías */}
        <CategoryFilter categories={categories ?? []} active={searchParams.category} />

        {/* Filtro de Estado */}
        <StateFilter activeState={searchParams.state} />

        {/* Resultados header */}
        {(searchParams.state || searchParams.category || searchParams.q) && (
          <p className="text-xs text-gray-500 mt-3 mb-1">
            {listings?.length ?? 0} resultado{(listings?.length ?? 0) !== 1 ? 's' : ''}
            {searchParams.state ? ` en ${searchParams.state}` : ''}
            {searchParams.q ? ` para "${searchParams.q}"` : ''}
          </p>
        )}

        {/* Listings */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {listings?.map((listing) => (
            <ListingCard key={listing.id} listing={listing as Listing} />
          ))}
        </div>

        {(!listings || listings.length === 0) && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">📦</p>
            <p>No hay publicaciones aún.</p>
            <p className="text-sm mt-1">¡Sé el primero en publicar!</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

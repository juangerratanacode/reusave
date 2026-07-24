import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import LandingPage from '@/components/LandingPage'

export const dynamic = 'force-dynamic'

export default async function RootPage({
  searchParams,
}: {
  searchParams: { q?: string; state?: string; category?: string }
}) {
  const supabase = createClient()

  // Redirect logged-in users to feed
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) redirect('/feed')
  } catch {}

  let listings: any[] | null = null

  if (searchParams.q) {
    const q = searchParams.q

    // Buscar categorías cuyo nombre coincide (ej: "ropa" → "Ropa y Calzado")
    const { data: matchingCats } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', `%${q}%`)
    const catIds = matchingCats?.map((c: any) => c.id) ?? []

    // Búsqueda fuzzy via RPC (pg_trgm)
    const { data: rpcRows } = await supabase
      .rpc('search_listings', { query: q })
      .select(`
        *,
        profiles (id, username, full_name, city),
        categories (id, slug, name, icon, color, type),
        listing_images (id, url, is_cover, sort_order)
      `)

    // Listings de categorías que coinciden por nombre
    let catRows: any[] = []
    if (catIds.length > 0) {
      const { data } = await supabase
        .from('listings')
        .select(`
          *,
          profiles (id, username, full_name, city),
          categories (id, slug, name, icon, color, type),
          listing_images (id, url, is_cover, sort_order)
        `)
        .eq('status', 'active')
        .in('category_id', catIds)
        .order('created_at', { ascending: false })
        .limit(12)
      catRows = data ?? []
    }

    // Combinar y deduplicar (RPC primero = mayor relevancia)
    const seen = new Set<string>()
    let rows: any[] = []
    for (const r of [...(rpcRows ?? []), ...catRows]) {
      if (!seen.has(r.id)) { seen.add(r.id); rows.push(r) }
    }

    if (searchParams.state) rows = rows.filter((r: any) => r.state === searchParams.state)
    if (searchParams.category) {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', searchParams.category).single()
      if (cat) rows = rows.filter((r: any) => r.category_id === cat.id)
    }

    listings = rows.slice(0, 12)
  } else {
    let q = supabase
      .from('listings')
      .select(`
        *,
        profiles (id, username, full_name, city),
        categories (id, slug, name, icon, color, type),
        listing_images (id, url, is_cover, sort_order)
      `)
      .eq('status', 'active')
      .order('is_urgent', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(12)

    if (searchParams.state) q = q.eq('state', searchParams.state)
    if (searchParams.category) {
      const { data: cat } = await supabase
        .from('categories').select('id').eq('slug', searchParams.category).single()
      if (cat) q = q.eq('category_id', cat.id)
    }

    const { data } = await q
    listings = data
  }

  const { data: categories } = await supabase
    .from('categories').select('*').eq('is_active', true).order('sort_order')

  return (
    <LandingPage
      listings={listings ?? []}
      categories={categories ?? []}
      searchParams={searchParams}
    />
  )
}

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

  // Fetch real public listings (anon access)
  let query = supabase
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

  if (searchParams.q) {
    const term = `%${searchParams.q}%`
    query = query.or(`title.ilike.${term},description.ilike.${term}`)
  }
  if (searchParams.state) query = query.eq('state', searchParams.state)
  if (searchParams.category) {
    const { data: cat } = await supabase
      .from('categories').select('id').eq('slug', searchParams.category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data: listings } = await query

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

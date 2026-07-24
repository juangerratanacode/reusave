import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import FavoritesClient from './FavoritesClient'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      listing_id,
      created_at,
      listings (
        *,
        categories (*),
        listing_images (*),
        profiles (id, username, full_name, whatsapp, city)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const listings = favorites
    ?.map((f: any) => ({ ...f.listings, favorited_at: f.created_at }))
    .filter(Boolean) ?? []

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F0E5' }}>
      <Navbar />
      <FavoritesClient listings={listings} />
      <BottomNav />
    </div>
  )
}

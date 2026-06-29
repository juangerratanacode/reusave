import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import ListingCard from '@/components/listings/ListingCard'
import { Listing } from '@/types'
import Link from 'next/link'

export default async function FavoritesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      listing_id,
      listings (
        *,
        categories (*),
        listing_images (*),
        profiles (id, username, full_name, whatsapp, city)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const listings = favorites?.map((f: any) => f.listings).filter(Boolean) ?? []

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-3 pt-16 pb-24">
        <h1 className="text-lg font-bold text-gray-100 mt-4 mb-4">❤️ Guardados</h1>

        {listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {listings.map((l: any) => <ListingCard key={l.id} listing={l as Listing} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">🤍</p>
            <p>Aún no tienes nada guardado</p>
            <Link href="/" className="mt-4 inline-block text-green-400 text-sm hover:underline">
              Explorar publicaciones
            </Link>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

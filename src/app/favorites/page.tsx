import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import ListingCard from '@/components/listings/ListingCard'
import { Listing } from '@/types'
import Link from 'next/link'

const PAPEL = '#F5F0E5'
const TINTA = '#15221B'
const CORAL = '#FF5A38'

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
    <div className="min-h-screen" style={{ backgroundColor: PAPEL }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-3 pt-16 pb-24">
        <h1 className="text-lg font-bold mt-4 mb-4" style={{ color: TINTA }}>❤️ Guardados</h1>

        {listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {listings.map((l: any) => <ListingCard key={l.id} listing={l as Listing} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white border border-black/8 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤍</span>
            </div>
            <p className="font-semibold mb-1" style={{ color: TINTA }}>Aún no tienes nada guardado</p>
            <p className="text-sm mb-5" style={{ color: '#9CA3AF' }}>Guarda artículos que te interesen para verlos luego</p>
            <Link
              href="/feed"
              className="inline-block font-bold text-sm px-6 py-3 rounded-xl text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: CORAL }}
            >
              Explorar publicaciones
            </Link>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

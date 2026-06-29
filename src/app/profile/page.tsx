import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Plus, Settings, Package } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import MyListingCard from '@/components/listings/MyListingCard'
import { Listing } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: listings } = await supabase
    .from('listings')
    .select(`*, categories(*), listing_images(*)`)
    .eq('user_id', user.id)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false })

  const initials = (profile?.full_name ?? profile?.username ?? user.email ?? '?')
    .charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24">

        {/* Header perfil */}
        <div className="flex items-center gap-4 py-6">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-white/10 overflow-hidden shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                {initials}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-gray-100 truncate">
              {profile?.full_name ?? profile?.username ?? user.email}
            </h1>
            {profile?.city && <p className="text-sm text-gray-500">{profile.city}</p>}
            <p className="text-xs text-gray-600 mt-0.5">{listings?.length ?? 0} publicaciones</p>
          </div>
          <Link href="/profile/settings" className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        {/* Mis publicaciones */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-200">Mis publicaciones</h2>
          <Link
            href="/listings/new"
            className="flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            <Plus className="w-4 h-4" /> Publicar
          </Link>
        </div>

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {listings.map((l) => <MyListingCard key={l.id} listing={l as Listing} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <p className="font-semibold text-gray-400">Aún no tienes publicaciones</p>
            <p className="text-sm mt-1 text-gray-600">¡Publica tu primer artículo gratis!</p>
            <Link
              href="/listings/new"
              className="mt-5 bg-green-500 text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-green-400 transition-colors"
            >
              Publicar ahora
            </Link>
          </div>
        )}

        {/* Cerrar sesión */}
        <form action="/auth/signout" method="POST" className="mt-10">
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-white/5 rounded-xl text-gray-600 hover:text-red-400 hover:border-red-900/50 transition-colors text-sm cursor-pointer">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </form>
      </main>
      <BottomNav />
    </div>
  )
}

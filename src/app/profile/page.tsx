import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Plus, Settings } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import ListingCard from '@/components/listings/ListingCard'
import { Listing } from '@/types'

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

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-16 pb-24">
        {/* Header perfil */}
        <div className="flex items-center gap-4 py-6">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-3xl">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : '👤'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-gray-100 truncate">
              {profile?.full_name ?? profile?.username ?? user.email}
            </h1>
            {profile?.city && <p className="text-sm text-gray-500">{profile.city}</p>}
            <p className="text-xs text-gray-600 mt-0.5">{listings?.length ?? 0} publicaciones</p>
          </div>
          <Link href="/profile/settings" className="p-2 text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        {/* Mis publicaciones */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-200">Mis publicaciones</h2>
          <Link
            href="/listings/new"
            className="flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300"
          >
            <Plus className="w-4 h-4" /> Publicar
          </Link>
        </div>

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {listings.map((l) => <ListingCard key={l.id} listing={l as Listing} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">📦</p>
            <p>Aún no tienes publicaciones</p>
            <Link
              href="/listings/new"
              className="mt-4 inline-block bg-green-500 text-black font-bold px-6 py-3 rounded-xl text-sm"
            >
              Publicar ahora
            </Link>
          </div>
        )}

        {/* Cerrar sesión */}
        <form action="/auth/signout" method="POST" className="mt-8">
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-[#2a2a2a] rounded-xl text-gray-400 hover:text-red-400 hover:border-red-800 transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </form>
      </main>
      <BottomNav />
    </div>
  )
}

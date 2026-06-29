import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import AdminListingActions from './AdminListingActions'
import { formatPrice, timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string }
}) {
  await requireAdmin()
  const supabase = createClient()

  let query = supabase
    .from('listings')
    .select(`id, title, price, status, created_at, is_urgent, city, state,
      profiles(username, full_name, whatsapp),
      categories(name),
      listing_images(url, is_cover)
    `)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false })
    .limit(100)

  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`)
  }
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: listings } = await query

  const statusColors: Record<string, string> = {
    active: 'text-green-400 bg-green-500/10',
    sold: 'text-gray-400 bg-gray-500/10',
    paused: 'text-yellow-400 bg-yellow-500/10',
    reserved: 'text-blue-400 bg-blue-500/10',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <header className="border-b border-white/5 px-6 h-14 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold">Publicaciones <span className="text-gray-600 font-normal text-sm">({listings?.length ?? 0})</span></h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Filters */}
        <form className="flex flex-wrap gap-3 mb-6">
          <input
            type="search"
            name="q"
            defaultValue={searchParams.q}
            placeholder="Buscar por título..."
            className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
          />
          <select
            name="status"
            defaultValue={searchParams.status ?? ''}
            className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-green-500 transition-colors cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="sold">Vendidas</option>
            <option value="paused">Pausadas</option>
          </select>
          <button type="submit" className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
            Filtrar
          </button>
        </form>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Publicación</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Vendedor</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Precio</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {listings?.map((l: any) => {
                const cover = l.listing_images?.find((i: any) => i.is_cover) ?? l.listing_images?.[0]
                return (
                  <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] overflow-hidden shrink-0">
                          {cover && <img src={cover.url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <Link href={`/listings/${l.id}`} target="_blank"
                            className="font-medium text-gray-200 hover:text-white transition-colors flex items-center gap-1">
                            {l.title}
                            <ExternalLink className="w-3 h-3 text-gray-600" />
                          </Link>
                          <p className="text-xs text-gray-500">{l.categories?.name} · {timeAgo(l.created_at)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-300">{l.profiles?.full_name ?? l.profiles?.username ?? '—'}</p>
                      {l.profiles?.whatsapp && (
                        <a href={`https://wa.me/${l.profiles.whatsapp.replace(/\D/g, '')}`}
                          target="_blank" className="text-xs text-green-400 hover:text-green-300">
                          {l.profiles.whatsapp}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[l.status] ?? 'text-gray-400 bg-gray-500/10'}`}>
                        {l.status}
                      </span>
                      {l.is_urgent && <span className="ml-1 text-xs text-red-400">URGENTE</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-300 hidden lg:table-cell">{formatPrice(l.price)}</td>
                    <td className="px-4 py-3">
                      <AdminListingActions listingId={l.id} status={l.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!listings || listings.length === 0) && (
            <div className="text-center py-12 text-gray-600">Sin resultados</div>
          )}
        </div>
      </main>
    </div>
  )
}

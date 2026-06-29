import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, ShieldOff, MessageCircle } from 'lucide-react'
import AdminUserActions from './AdminUserActions'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  await requireAdmin()
  const supabase = createClient()

  let query = supabase
    .from('profiles')
    .select('id, username, full_name, email, whatsapp, city, state, is_verified, created_at, avatar_url')
    .order('created_at', { ascending: false })
    .limit(100)

  if (searchParams.q) {
    const term = `%${searchParams.q}%`
    query = query.or(`username.ilike.${term},full_name.ilike.${term},email.ilike.${term}`)
  }

  const { data: users } = await query

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <header className="border-b border-white/5 px-6 h-14 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold">Usuarios <span className="text-gray-600 font-normal text-sm">({users?.length ?? 0})</span></h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Search */}
        <form className="mb-6">
          <input
            type="search"
            name="q"
            defaultValue={searchParams.q}
            placeholder="Buscar por nombre, usuario o correo..."
            className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
          />
        </form>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">WhatsApp</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ubicación</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Registro</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users?.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center text-sm font-bold text-gray-500">
                        {user.avatar_url
                          ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                          : (user.full_name?.[0] ?? user.username?.[0] ?? '?').toUpperCase()
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">{user.full_name ?? user.username ?? '—'}</p>
                        <p className="text-xs text-gray-500">@{user.username ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {user.whatsapp ? (
                      <a
                        href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {user.whatsapp}
                      </a>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                    {user.city && user.state ? `${user.city}, ${user.state}` : user.state ?? user.city ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {new Date(user.created_at).toLocaleDateString('es-VE')}
                  </td>
                  <td className="px-4 py-3">
                    <AdminUserActions userId={user.id} isVerified={user.is_verified} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!users || users.length === 0) && (
            <div className="text-center py-12 text-gray-600">Sin resultados</div>
          )}
        </div>
      </main>
    </div>
  )
}

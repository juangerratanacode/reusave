import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Users, Package, Flag, TrendingUp, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdmin()
  const supabase = createClient()

  const [
    { count: totalUsers },
    { count: totalListings },
    { count: activeListings },
    { count: totalReports },
    { count: pendingReports },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }).neq('status', 'deleted'),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('resolved', false),
  ])

  const stats = [
    { label: 'Usuarios registrados', value: totalUsers ?? 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Publicaciones activas', value: activeListings ?? 0, icon: Package, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total publicaciones', value: totalListings ?? 0, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Reportes pendientes', value: pendingReports ?? 0, icon: Flag, color: 'text-red-400', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <header className="border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-400" />
          <span className="font-display font-bold text-green-400">resuel<span className="text-gray-600">✓</span>e</span>
          <span className="text-gray-600 text-sm ml-2">/ Admin</span>
        </div>
        <Link href="/feed" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Volver al feed
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl font-bold mb-8">Panel de control</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="font-accent text-2xl text-gray-100">{s.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nav */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/admin/users', icon: Users, label: 'Usuarios', desc: 'Ver, buscar y desactivar cuentas', color: 'text-blue-400' },
            { href: '/admin/listings', icon: Package, label: 'Publicaciones', desc: 'Moderar contenido del feed', color: 'text-green-400' },
            { href: '/admin/reports', icon: Flag, label: 'Reportes', desc: 'Contenido reportado por usuarios', color: 'text-red-400' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="bg-[#1a1a1a] border border-white/5 hover:border-white/15 rounded-2xl p-6 transition-all group">
              <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
              <p className="font-bold text-gray-100 group-hover:text-white transition-colors">{item.label}</p>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

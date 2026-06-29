import { requireAdmin } from '@/lib/admin'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import AdminReportActions from './AdminReportActions'
import { timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  await requireAdmin()
  const supabase = createClient()

  const { data: reports } = await supabase
    .from('reports')
    .select(`
      id, reason, created_at, resolved,
      listings(id, title, status),
      profiles!reports_reporter_id_fkey(username, full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  const pending = reports?.filter(r => !r.resolved) ?? []
  const resolved = reports?.filter(r => r.resolved) ?? []

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <header className="border-b border-white/5 px-6 h-14 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-bold">
          Reportes
          {pending.length > 0 && (
            <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
          )}
        </h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6 space-y-8">
        {/* Pending */}
        <section>
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">Pendientes ({pending.length})</h2>
          <div className="space-y-3">
            {pending.length === 0 && (
              <p className="text-gray-600 text-sm py-4">Sin reportes pendientes</p>
            )}
            {pending.map((r: any) => (
              <ReportRow key={r.id} report={r} />
            ))}
          </div>
        </section>

        {/* Resolved */}
        {resolved.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Resueltos ({resolved.length})</h2>
            <div className="space-y-2 opacity-60">
              {resolved.map((r: any) => (
                <ReportRow key={r.id} report={r} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function ReportRow({ report }: { report: any }) {
  const reporter = report.profiles
  const listing = report.listings

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs bg-red-500/10 text-red-400 border border-red-900/30 px-2 py-0.5 rounded-full font-semibold">
            {report.reason}
          </span>
          <span className="text-xs text-gray-600">{timeAgo(report.created_at)}</span>
        </div>
        {listing && (
          <Link href={`/listings/${listing.id}`} target="_blank"
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
            {listing.title}
            <ExternalLink className="w-3 h-3 text-gray-600 shrink-0" />
          </Link>
        )}
        <p className="text-xs text-gray-600 mt-1">
          Reportado por @{reporter?.username ?? reporter?.full_name ?? '—'}
        </p>
      </div>
      <AdminReportActions reportId={report.id} listingId={listing?.id} resolved={report.resolved} />
    </div>
  )
}

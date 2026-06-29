'use client'
import { useState } from 'react'
import { CheckCircle, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminReportActions({
  reportId,
  listingId,
  resolved,
}: {
  reportId: string
  listingId?: string
  resolved: boolean
}) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const resolve = async () => {
    setLoading(true)
    await supabase.from('reports').update({ resolved: true }).eq('id', reportId)
    router.refresh()
    setLoading(false)
  }

  const removeAndResolve = async () => {
    if (!confirm('¿Eliminar la publicación y marcar el reporte como resuelto?')) return
    setLoading(true)
    if (listingId) {
      await supabase.from('listings').update({ status: 'deleted' }).eq('id', listingId)
    }
    await supabase.from('reports').update({ resolved: true }).eq('id', reportId)
    router.refresh()
    setLoading(false)
  }

  if (resolved) {
    return <span className="text-xs text-gray-600">Resuelto</span>
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={resolve}
        disabled={loading}
        title="Marcar como resuelto"
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer disabled:opacity-50 border border-green-900/40"
      >
        <CheckCircle className="w-3.5 h-3.5" />
        Resolver
      </button>
      {listingId && (
        <button
          onClick={removeAndResolve}
          disabled={loading}
          title="Eliminar publicación y resolver"
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

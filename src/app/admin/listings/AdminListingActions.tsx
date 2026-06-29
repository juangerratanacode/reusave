'use client'
import { useState } from 'react'
import { Trash2, PauseCircle, PlayCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminListingActions({
  listingId,
  status,
}: {
  listingId: string
  status: string
}) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const setStatus = async (newStatus: string) => {
    setLoading(true)
    await supabase.from('listings').update({ status: newStatus }).eq('id', listingId)
    router.refresh()
    setLoading(false)
  }

  const deleteListing = async () => {
    if (!confirm('¿Eliminar esta publicación permanentemente?')) return
    setLoading(true)
    await supabase.from('listings').update({ status: 'deleted' }).eq('id', listingId)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-1">
      {status === 'active' ? (
        <button onClick={() => setStatus('paused')} disabled={loading} title="Pausar"
          className="p-1.5 rounded-lg text-yellow-400 hover:bg-yellow-500/10 transition-colors cursor-pointer disabled:opacity-50">
          <PauseCircle className="w-4 h-4" />
        </button>
      ) : status === 'paused' ? (
        <button onClick={() => setStatus('active')} disabled={loading} title="Reactivar"
          className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer disabled:opacity-50">
          <PlayCircle className="w-4 h-4" />
        </button>
      ) : null}

      <button onClick={deleteListing} disabled={loading} title="Eliminar"
        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

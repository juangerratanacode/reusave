'use client'
import { useState } from 'react'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminUserActions({
  userId,
  isVerified,
}: {
  userId: string
  isVerified: boolean
}) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const toggleVerified = async () => {
    setLoading(true)
    await supabase.from('profiles').update({ is_verified: !isVerified }).eq('id', userId)
    router.refresh()
    setLoading(false)
  }

  const deactivateListings = async () => {
    if (!confirm('¿Desactivar todas las publicaciones de este usuario?')) return
    setLoading(true)
    await supabase.from('listings').update({ status: 'paused' }).eq('user_id', userId).eq('status', 'active')
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleVerified}
        disabled={loading}
        title={isVerified ? 'Quitar verificación' : 'Verificar usuario'}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${isVerified ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-600 hover:bg-white/5 hover:text-gray-300'}`}
      >
        {isVerified ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
      </button>

      <button
        onClick={deactivateListings}
        disabled={loading}
        title="Desactivar publicaciones"
        className="px-2.5 py-1 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50 border border-red-900/40"
      >
        Desactivar
      </button>
    </div>
  )
}

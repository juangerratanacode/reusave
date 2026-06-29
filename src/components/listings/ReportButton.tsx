'use client'
import { useState } from 'react'
import { Flag, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const REASONS = [
  'Contenido inapropiado',
  'Es spam o publicidad',
  'Artículo prohibido',
  'Precio abusivo',
  'Información falsa',
  'Otro',
]

export default function ReportButton({ listingId }: { listingId: string }) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!reason) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('reports').insert({
        listing_id: listingId,
        reporter_id: user.id,
        reason,
      })
    }
    setLoading(false)
    setDone(true)
    setTimeout(() => { setOpen(false); setDone(false); setReason('') }, 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors cursor-pointer mt-2"
      >
        <Flag className="w-3.5 h-3.5" />
        Reportar publicación
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h3 className="font-bold text-gray-100">Reportar publicación</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-300 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="px-5 py-8 text-center">
                <p className="text-green-400 font-semibold">Reporte enviado</p>
                <p className="text-sm text-gray-500 mt-1">Gracias por ayudarnos a mejorar</p>
              </div>
            ) : (
              <div className="p-3">
                {REASONS.map(r => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${reason === r ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    {r}
                  </button>
                ))}
                <button
                  onClick={submit}
                  disabled={!reason || loading}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Enviar reporte
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

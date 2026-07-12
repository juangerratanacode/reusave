'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { X, DollarSign, Send } from 'lucide-react'

const CORAL = '#FF5A38'
const TINTA = '#15221B'

export default function OfferButton({
  listingId,
  sellerId,
  sellerWhatsapp,
  listingTitle,
}: {
  listingId: string
  sellerId: string
  sellerWhatsapp: string
  listingTitle: string
}) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    if (!amount) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    await supabase.from('offers').insert({
      listing_id: listingId,
      buyer_id: user.id,
      seller_id: sellerId,
      amount: parseFloat(amount),
      message: message || null,
    })

    // Abrir WhatsApp con mensaje pre-armado
    const text = `Hola, te hago una oferta de $${amount} por tu "${listingTitle}"${message ? `.\n\n${message}` : '.'}`
    const wa = `https://wa.me/${sellerWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
    window.open(wa, '_blank')

    setSent(true)
    setLoading(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-xl border-2 transition-all hover:opacity-90"
        style={{ borderColor: CORAL, color: CORAL, backgroundColor: 'white' }}
      >
        <DollarSign className="w-4 h-4" />
        Hacer una oferta
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-10 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold" style={{ color: TINTA }}>Hacer una oferta</h3>
          <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-semibold" style={{ color: TINTA }}>Oferta enviada</p>
            <p className="text-sm text-gray-400 mt-1">Se abrió WhatsApp con tu oferta de ${amount}</p>
            <button onClick={() => setOpen(false)}
              className="mt-5 w-full py-3 rounded-xl font-bold text-white"
              style={{ backgroundColor: CORAL }}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Tu oferta (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number" min="0" step="0.5" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  autoFocus
                  placeholder="0.00"
                  className="w-full bg-gray-50 border border-black/10 rounded-xl pl-8 pr-4 py-3 text-lg font-bold focus:outline-none focus:border-[#FF5A38] transition-colors"
                  style={{ color: TINTA }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Mensaje (opcional)</label>
              <textarea
                value={message} onChange={e => setMessage(e.target.value)}
                rows={2} placeholder="Ej: Lo recojo mañana, pago en efectivo..."
                className="w-full bg-gray-50 border border-black/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#FF5A38] transition-colors"
                style={{ color: TINTA }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={loading || !amount}
              className="flex items-center justify-center gap-2 w-full text-white font-bold py-4 rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: CORAL }}
            >
              <Send className="w-4 h-4" />
              {loading ? 'Enviando...' : 'Enviar oferta por WhatsApp'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

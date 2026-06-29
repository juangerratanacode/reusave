'use client'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export default function FavoriteButton({ listingId }: { listingId: string }) {
  const supabase = createClient()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .maybeSingle()
      setSaved(!!data)
      setLoading(false)
    }
    check()
  }, [listingId])

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (saved) {
      await supabase.from('favorites').delete()
        .eq('user_id', user.id).eq('listing_id', listingId)
      setSaved(false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, listing_id: listingId })
      setSaved(true)
    }
  }

  if (loading) return null

  return (
    <button
      onClick={toggle}
      className={cn(
        'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer z-10',
        saved
          ? 'bg-red-500 text-white'
          : 'bg-black/50 backdrop-blur text-gray-300 hover:text-white'
      )}
      aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
    >
      <Heart className={cn('w-3.5 h-3.5', saved && 'fill-current')} />
    </button>
  )
}

'use client'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { VENEZUELA_STATES } from '@/lib/venezuela'
import { MapPin, X } from 'lucide-react'

export default function StateFilter({ activeState }: { activeState?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (state: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (state) params.set('state', state)
    else params.delete('state')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
      <div className="flex-1 overflow-x-auto">
        <select
          value={activeState ?? ''}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-green-500 cursor-pointer"
        >
          <option value="">Todo Venezuela</option>
          {VENEZUELA_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      {activeState && (
        <button
          onClick={() => handleChange('')}
          className="text-gray-500 hover:text-gray-300 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

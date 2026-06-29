'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VENEZUELA_STATES } from '@/lib/venezuela'
import { MapPin, ChevronDown, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StateFilter({ activeState }: { activeState?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = VENEZUELA_STATES.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (state: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (state) params.set('state', state)
    else params.delete('state')
    router.push(`/feed?${params.toString()}`)
    setOpen(false)
    setQuery('')
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative mt-3">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold border transition-all duration-150 cursor-pointer',
          activeState
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'bg-transparent border-white/10 text-gray-400 hover:border-white/25 hover:text-gray-200'
        )}
      >
        <MapPin className="w-3.5 h-3.5 shrink-0" />
        <span>{activeState ?? 'Todo Venezuela'}</span>
        {activeState ? (
          <span
            role="button"
            onClick={e => { e.stopPropagation(); handleSelect('') }}
            className="ml-0.5 hover:opacity-70 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar estado..."
                className="w-full bg-[#111] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">
            <button
              onClick={() => handleSelect('')}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer hover:bg-white/5',
                !activeState ? 'text-green-400 font-semibold' : 'text-gray-300'
              )}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Todo Venezuela
            </button>

            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-600">Sin resultados</p>
            )}

            {filtered.map(state => (
              <button
                key={state}
                onClick={() => handleSelect(state)}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer hover:bg-white/5',
                  activeState === state ? 'text-green-400 font-semibold bg-green-500/10' : 'text-gray-300'
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', activeState === state ? 'bg-green-400' : 'bg-transparent')} />
                {state}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

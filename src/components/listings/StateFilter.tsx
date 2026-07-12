'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VENEZUELA_STATES } from '@/lib/venezuela'
import { MapPin, ChevronDown, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const CORAL = '#FF5A38'
const TINTA = '#15221B'
const PAPEL = '#F5F0E5'

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
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold border transition-all duration-150 cursor-pointer"
        style={{
          backgroundColor: activeState ? CORAL : 'white',
          borderColor: activeState ? CORAL : 'rgba(0,0,0,0.12)',
          color: activeState ? 'white' : TINTA,
        }}
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

      {open && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }} onClick={() => { setOpen(false); setQuery('') }} />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white border border-black/8 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-3 border-b border-black/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9CA3AF' }} />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar estado..."
                  className="w-full rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#FF5A38] border transition-colors"
                  style={{ backgroundColor: PAPEL, color: TINTA, borderColor: 'rgba(0,0,0,0.08)' }}
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              <button
                onClick={() => handleSelect('')}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer hover:bg-[#FFF0EC]"
                style={{ color: !activeState ? CORAL : TINTA, fontWeight: !activeState ? 700 : 400 }}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: CORAL }} />
                Todo Venezuela
              </button>

              {filtered.length === 0 && (
                <p className="px-4 py-3 text-sm" style={{ color: '#9CA3AF' }}>Sin resultados</p>
              )}

              {filtered.map(state => (
                <button
                  key={state}
                  onClick={() => handleSelect(state)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer hover:bg-[#FFF0EC]"
                  style={{
                    color: activeState === state ? CORAL : TINTA,
                    fontWeight: activeState === state ? 700 : 400,
                    backgroundColor: activeState === state ? '#FFF0EC' : 'transparent',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activeState === state ? CORAL : 'transparent' }} />
                  {state}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

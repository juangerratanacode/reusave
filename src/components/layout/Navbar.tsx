'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Plus } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const CORAL = '#EF4D28'
const TINTA = '#0F1B13'

const SUGGESTIONS = [
  'iPhone', 'Nevera', 'Televisor', 'Moto', 'Ropa bebé',
  'Laptop', 'Sofá', 'Bicicleta', 'Juguetes', 'Herramientas',
]

export default function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQ(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const doSearch = (term: string) => {
    const trimmed = term.trim()
    if (trimmed) router.push(`/feed?q=${encodeURIComponent(trimmed)}`)
    else router.push('/feed')
    setFocused(false)
    inputRef.current?.blur()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch(q)
  }

  const clearSearch = () => {
    setQ('')
    router.push('/feed')
    inputRef.current?.focus()
  }

  const filtered = q.length > 0
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(q.toLowerCase())).slice(0, 5)
    : SUGGESTIONS.slice(0, 6)

  const showSuggestions = focused && filtered.length > 0

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        {/* Logo */}
        <Link href="/feed" className="font-black text-lg shrink-0 tracking-tight" style={{ color: TINTA }}>
          resuel<span style={{ color: CORAL }}>✓</span>e
        </Link>

        {/* Search */}
        <div ref={wrapperRef} className="flex-1 relative max-w-xl">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9CA3AF' }} />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Busca artículos, categorías, ciudad..."
              className="w-full bg-[#F5F2ED] border border-black/10 rounded-full pl-9 pr-9 py-2 text-sm placeholder-[#B0A89E] focus:outline-none focus:border-[#EF4D28] focus:bg-white transition-colors"
              style={{ color: TINTA }}
            />
            {q && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70"
                style={{ color: '#9CA3AF' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/10 rounded-2xl shadow-xl overflow-hidden z-50">
              <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#B0A89E' }}>
                {q ? 'Sugerencias' : 'Búsquedas populares'}
              </p>
              {filtered.map(s => (
                <button
                  key={s}
                  onMouseDown={() => { setQ(s); doSearch(s) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#F5F2ED] transition-colors cursor-pointer text-left"
                  style={{ color: TINTA }}
                >
                  <Search className="w-3.5 h-3.5 shrink-0" style={{ color: '#B0A89E' }} />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href="/listings/new"
          className="shrink-0 flex items-center gap-1.5 text-white font-bold text-sm px-4 py-2 rounded-full transition-all cursor-pointer hover:opacity-90"
          style={{ backgroundColor: CORAL }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Publicar</span>
        </Link>
      </div>
    </header>
  )
}

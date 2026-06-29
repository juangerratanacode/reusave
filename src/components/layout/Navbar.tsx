'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Plus } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

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

  // Sync query from URL
  useEffect(() => {
    setQ(searchParams.get('q') ?? '')
  }, [searchParams])

  // Close suggestions on outside click
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <Link href="/feed" className="font-black text-lg text-green-400 shrink-0 tracking-tight">
          ReUsa<span className="text-gray-600">.ve</span>
        </Link>

        {/* Search */}
        <div ref={wrapperRef} className="flex-1 relative max-w-xl">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Busca artículos, categorías, ciudad..."
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-full pl-9 pr-9 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500 focus:bg-[#1f1f1f] transition-colors"
            />
            {q && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
              <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
                {q ? 'Sugerencias' : 'Búsquedas populares'}
              </p>
              {filtered.map(s => (
                <button
                  key={s}
                  onMouseDown={() => { setQ(s); doSearch(s) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <Search className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href="/listings/new"
          className="shrink-0 flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-4 py-2 rounded-full transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Publicar</span>
        </Link>
      </div>
    </header>
  )
}

'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [q, setQ] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push(`/?q=${encodeURIComponent(q.trim())}`)
    else router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur border-b border-[#2a2a2a]">
      <div className="max-w-2xl mx-auto px-3 h-14 flex items-center gap-3">
        <Link href="/" className="font-bold text-lg text-green-400 shrink-0">
          ReUsa<span className="text-gray-500">.ve</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar artículos..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-full pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
        </form>
      </div>
    </header>
  )
}

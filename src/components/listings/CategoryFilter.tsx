'use client'
import { useRouter } from 'next/navigation'
import { Category } from '@/types'
import { cn } from '@/lib/utils'

export default function CategoryFilter({
  categories,
  active,
}: {
  categories: Category[]
  active?: string
}) {
  const router = useRouter()
  const emergency = categories.filter((c) => c.type === 'emergency')
  const commercial = categories.filter((c) => c.type === 'commercial')

  const handleClick = (slug: string) => {
    router.push(active === slug ? '/' : `/?category=${slug}`)
  }

  return (
    <div className="space-y-2">
      {/* Emergencia */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {emergency.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.slug)}
            className={cn(
              'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              active === cat.slug
                ? 'border-current opacity-100'
                : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:border-gray-600',
              active === cat.slug && cat.slug === 'donacion' && 'bg-green-500/20 text-green-400 border-green-600',
              active === cat.slug && cat.slug === 'venta-solidaria' && 'bg-orange-500/20 text-orange-400 border-orange-600',
              active === cat.slug && cat.slug === 'necesidad-urgente' && 'bg-red-500/20 text-red-400 border-red-600',
              active === cat.slug && cat.slug === 'objetos-perdidos' && 'bg-purple-500/20 text-purple-400 border-purple-600',
            )}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Comercial */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {commercial.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.slug)}
            className={cn(
              'shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              active === cat.slug
                ? 'bg-white/10 border-white/30 text-white'
                : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:border-gray-600'
            )}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}

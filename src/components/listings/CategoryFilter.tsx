'use client'
import { useRouter } from 'next/navigation'
import { Category } from '@/types'

const CORAL = '#EF4D28'
const TINTA = '#0F1B13'

export default function CategoryFilter({ categories, active }: { categories: Category[], active?: string }) {
  const router = useRouter()

  return (
    <div className="relative">
      {/* Fade hint derecha en mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none sm:hidden"
        style={{ background: 'linear-gradient(to right, transparent, #F0EDE6)' }} />

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => router.push('/feed')}
          className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition-all whitespace-nowrap"
          style={{
            backgroundColor: !active ? CORAL : 'white',
            color: !active ? 'white' : '#6B7280',
            borderColor: !active ? CORAL : 'rgba(0,0,0,0.12)',
          }}
        >
          Todo
        </button>

        {categories.map((cat) => {
          const isActive = active === cat.slug
          return (
            <button
              key={cat.id}
              onClick={() => router.push(isActive ? '/feed' : `/feed?category=${cat.slug}`)}
              className="shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActive ? CORAL : 'white',
                color: isActive ? 'white' : '#6B7280',
                borderColor: isActive ? CORAL : 'rgba(0,0,0,0.12)',
              }}
            >
              {cat.icon} {cat.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

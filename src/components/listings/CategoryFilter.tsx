'use client'
import { useRouter } from 'next/navigation'
import { Category } from '@/types'
import FilterSheet from './FilterSheet'

const CORAL = '#FF5A38'
const CORAL_BG = '#FFF0EC'
const TINTA = '#15221B'

export default function CategoryFilter({ categories, active }: { categories: Category[], active?: string }) {
  const router = useRouter()

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none sm:hidden"
        style={{ background: 'linear-gradient(to right, transparent, #F5F0E5)' }} />

      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 sm:flex-wrap">
        <button
          onClick={() => router.push('/feed')}
          className="shrink-0 text-base font-bold px-5 py-2.5 rounded-full border-2 transition-all whitespace-nowrap cursor-pointer"
          style={{
            backgroundColor: !active ? CORAL : 'white',
            color: !active ? 'white' : '#6B7280',
            borderColor: !active ? CORAL : 'rgba(0,0,0,0.10)',
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
              className="shrink-0 text-base font-bold px-5 py-2.5 rounded-full border-2 transition-all whitespace-nowrap cursor-pointer"
              style={{
                backgroundColor: isActive ? CORAL : CORAL_BG,
                color: isActive ? 'white' : TINTA,
                borderColor: isActive ? CORAL : 'transparent',
              }}
            >
              {cat.icon} {cat.name}
            </button>
          )
        })}

        {/* Separador visual */}
        <div className="w-px bg-black/10 self-stretch mx-1 shrink-0" />

        <FilterSheet categories={categories} activeCategory={active} />
      </div>
    </div>
  )
}

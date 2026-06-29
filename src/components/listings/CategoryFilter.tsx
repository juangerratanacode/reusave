'use client'
import { useRouter } from 'next/navigation'
import { Category } from '@/types'
import { cn } from '@/lib/utils'
import {
  Heart, Handshake, AlertCircle, Search,
  Home, Zap, Smartphone, Shirt, Car, Wrench,
  Package, UtensilsCrossed, BookOpen, Dumbbell,
  Baby, PawPrint, Hammer, Bike, LayoutGrid,
} from 'lucide-react'

const SLUG_TO_ICON: Record<string, { icon: React.ElementType; color: string; activeColor: string; activeBg: string }> = {
  'donacion':           { icon: Heart,          color: 'text-green-400',  activeColor: 'text-black', activeBg: 'bg-green-500 border-green-500' },
  'venta-solidaria':    { icon: Handshake,       color: 'text-orange-400', activeColor: 'text-black', activeBg: 'bg-orange-500 border-orange-500' },
  'necesidad-urgente':  { icon: AlertCircle,     color: 'text-red-400',    activeColor: 'text-white', activeBg: 'bg-red-600 border-red-600' },
  'objetos-perdidos':   { icon: Search,          color: 'text-purple-400', activeColor: 'text-white', activeBg: 'bg-purple-600 border-purple-600' },
  'hogar':              { icon: Home,            color: 'text-amber-400',  activeColor: 'text-black', activeBg: 'bg-amber-500 border-amber-500' },
  'electrodomesticos':  { icon: Zap,             color: 'text-yellow-400', activeColor: 'text-black', activeBg: 'bg-yellow-500 border-yellow-500' },
  'electronica':        { icon: Smartphone,      color: 'text-blue-400',   activeColor: 'text-white', activeBg: 'bg-blue-600 border-blue-600' },
  'ropa-calzado':       { icon: Shirt,           color: 'text-pink-400',   activeColor: 'text-white', activeBg: 'bg-pink-600 border-pink-600' },
  'vehiculos':          { icon: Car,             color: 'text-violet-400', activeColor: 'text-white', activeBg: 'bg-violet-600 border-violet-600' },
  'servicios':          { icon: Wrench,          color: 'text-orange-400', activeColor: 'text-black', activeBg: 'bg-orange-500 border-orange-500' },
  'alimentos':          { icon: UtensilsCrossed, color: 'text-lime-400',   activeColor: 'text-black', activeBg: 'bg-lime-500 border-lime-500' },
  'libros':             { icon: BookOpen,        color: 'text-cyan-400',   activeColor: 'text-black', activeBg: 'bg-cyan-500 border-cyan-500' },
  'deportes':           { icon: Dumbbell,        color: 'text-teal-400',   activeColor: 'text-white', activeBg: 'bg-teal-600 border-teal-600' },
  'bebe':               { icon: Baby,            color: 'text-rose-400',   activeColor: 'text-white', activeBg: 'bg-rose-500 border-rose-500' },
  'mascotas':           { icon: PawPrint,        color: 'text-amber-400',  activeColor: 'text-black', activeBg: 'bg-amber-500 border-amber-500' },
  'construccion':       { icon: Hammer,          color: 'text-stone-400',  activeColor: 'text-white', activeBg: 'bg-stone-600 border-stone-600' },
  'bicicletas':         { icon: Bike,            color: 'text-green-400',  activeColor: 'text-black', activeBg: 'bg-green-500 border-green-500' },
}

const FALLBACK = { icon: Package, color: 'text-gray-400', activeColor: 'text-white', activeBg: 'bg-gray-600 border-gray-600' }

export default function CategoryFilter({
  categories,
  active,
}: {
  categories: Category[]
  active?: string
}) {
  const router = useRouter()

  const handleClick = (slug: string) => {
    router.push(active === slug ? '/feed' : `/feed?category=${slug}`)
  }

  const allBtn = !active

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {/* "Todo" pill */}
      <button
        onClick={() => router.push('/feed')}
        className={cn(
          'shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold border transition-all duration-150 cursor-pointer',
          allBtn
            ? 'bg-white text-black border-white'
            : 'bg-transparent text-gray-400 border-white/10 hover:border-white/25 hover:text-gray-200'
        )}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        Todo
      </button>

      {categories.map((cat) => {
        const config = SLUG_TO_ICON[cat.slug] ?? FALLBACK
        const Icon = config.icon
        const isActive = active === cat.slug

        return (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.slug)}
            className={cn(
              'shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold border transition-all duration-150 cursor-pointer whitespace-nowrap',
              isActive
                ? `${config.activeBg} ${config.activeColor}`
                : `bg-transparent border-white/10 hover:border-white/25 hover:text-gray-200 ${config.color}`
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}

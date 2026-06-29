'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/feed', icon: Home, label: 'Inicio' },
  { href: '/listings/new', icon: Plus, label: 'Publicar', highlight: true },
  { href: '/favorites', icon: Heart, label: 'Guardados' },
  { href: '/profile', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur border-t border-[#2a2a2a] safe-area-pb">
      <div className="max-w-7xl mx-auto flex">
        {links.map(({ href, icon: Icon, label, highlight }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors',
              highlight
                ? 'text-green-400'
                : path === href
                ? 'text-green-400'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {highlight ? (
              <span className="bg-green-500 rounded-full p-2 -mt-5 shadow-lg shadow-green-500/30">
                <Icon className="w-5 h-5 text-black" />
              </span>
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

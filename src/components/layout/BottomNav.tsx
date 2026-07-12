'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const CORAL = '#EF4D28'
const TINTA = '#0F1B13'

const links = [
  { href: '/feed', icon: Home, label: 'Inicio' },
  { href: '/listings/new', icon: Plus, label: 'Publicar', highlight: true },
  { href: '/favorites', icon: Heart, label: 'Guardados' },
  { href: '/profile', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-black/8 safe-area-pb">
      <div className="max-w-7xl mx-auto flex">
        {links.map(({ href, icon: Icon, label, highlight }) => {
          const isActive = path === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors',
              )}
              style={{ color: (highlight || isActive) ? CORAL : '#9CA3AF' }}
            >
              {highlight ? (
                <span
                  className="rounded-full p-2 -mt-5 shadow-lg"
                  style={{ backgroundColor: CORAL, boxShadow: '0 4px 14px rgba(239,77,40,0.35)' }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </span>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

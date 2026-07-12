'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Heart, User, Search } from 'lucide-react'

const CORAL = '#FF5A38'
const TINTA = '#15221B'

const links = [
  { href: '/feed',         icon: Home,       label: 'Inicio' },
  { href: '/feed',         icon: Search,     label: 'Explorar' },
  { href: '/listings/new', icon: PlusCircle, label: 'Publicar', highlight: true },
  { href: '/favorites',    icon: Heart,      label: 'Guardados' },
  { href: '/profile',      icon: User,       label: 'Tú' },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/8" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex max-w-lg mx-auto">
        {links.map(({ href, icon: Icon, label, highlight }) => {
          const isActive = path === href && !highlight

          if (highlight) {
            return (
              <Link
                key="publicar"
                href={href}
                className="flex-1 flex flex-col items-center pt-1 pb-2 gap-0.5"
              >
                {/* Botón elevado coral — igual que Wallapop */}
                <span
                  className="flex items-center justify-center w-12 h-12 rounded-full shadow-md -mt-6"
                  style={{ backgroundColor: CORAL, boxShadow: '0 4px 16px rgba(239,77,40,0.4)' }}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </span>
                <span className="text-[10px] font-semibold" style={{ color: CORAL }}>{label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={href + label}
              href={href}
              className="flex-1 flex flex-col items-center pt-2 pb-2 gap-0.5 transition-opacity active:opacity-60"
            >
              <Icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? TINTA : '#9CA3AF' }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? TINTA : '#9CA3AF' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = 'USD'): string {
  if (price === 0) return 'Gratis'
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
}

export function buildWhatsAppLink(phone: string, listingTitle: string, listingUrl: string): string {
  const clean = phone.replace(/\D/g, '')
  const msg = encodeURIComponent(
    `¡Hola! Vi tu publicación en ReUsa.ve: "${listingTitle}" (${listingUrl}). ¿Sigue disponible?`
  )
  return `https://wa.me/${clean}?text=${msg}`
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `hace ${days}d`
}

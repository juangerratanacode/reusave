import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReUsa.ve — Compra y vende lo que no usas',
  description: 'Marketplace de segunda mano para Venezuela. Ayuda solidaria post-sismo.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'ReUsa.ve' },
  openGraph: {
    title: 'ReUsa.ve',
    description: 'Compra y vende lo que no usas, a precios reales.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-[#0f0f0f] text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}

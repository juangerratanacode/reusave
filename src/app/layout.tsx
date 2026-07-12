import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'resuelve — Compra y vende lo que no usas',
  description: 'Marketplace de segunda mano para Venezuela. Compra, vende y dona sin intermediarios.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'resuelve' },
  openGraph: {
    title: 'resuelve',
    description: 'Compra y vende lo que no usas, a precios reales.',
    type: 'website',
    url: 'https://www.entrayresuelve.com',
    siteName: 'resuelve',
  },
  twitter: {
    card: 'summary',
    title: 'resuelve',
    description: 'Marketplace de segunda mano para Venezuela.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#EF4D28',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen" style={{ backgroundColor: '#F0EDE6' }}>
        {children}
      </body>
    </html>
  )
}

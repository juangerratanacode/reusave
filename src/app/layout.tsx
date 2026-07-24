import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Archivo_Black, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const archivoblack = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-accent',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

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
  themeColor: '#FF5A38',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${archivoblack.variable} ${inter.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen font-body" style={{ backgroundColor: '#F5F0E5' }}>
        {children}
      </body>
    </html>
  )
}

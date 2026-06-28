import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { BRAND } from '@/lib/brand'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${BRAND.title} - ${BRAND.tagline}`,
    template: `%s | ${BRAND.title}`,
  },
  description: `${BRAND.tagline}. Experience premium diagnostic and health services at ${BRAND.title}. Book appointments, consult with expert doctors, and get personalized care.`,
  keywords: ['healthcare', 'clinic', 'doctor', 'appointment', 'medical', 'hyderabad', 'astermed', 'diagnostic'],
  authors: [{ name: BRAND.title }],
  creator: BRAND.title,
  publisher: BRAND.title,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: `${BRAND.title} - ${BRAND.tagline}`,
    description: `${BRAND.tagline}. Experience premium diagnostic and health services at ${BRAND.title}.`,
    url: '/',
    siteName: BRAND.title,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: BRAND.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND.title,
    description: `${BRAND.tagline} - Diagnostic and Health services in Hyderabad`,
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B4F6C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-body">
        {children}
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

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
    default: 'AsterMed Healthcare - Premium Healthcare Services',
    template: '%s | AsterMed Healthcare',
  },
  description: 'Experience premium healthcare services at AsterMed Healthcare. Book appointments, consult with expert doctors, and get personalized care.',
  keywords: ['healthcare', 'clinic', 'doctor', 'appointment', 'medical', 'hyderabad', 'astermed'],
  authors: [{ name: 'AsterMed Healthcare' }],
  creator: 'AsterMed Healthcare',
  publisher: 'AsterMed Healthcare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'AsterMed Healthcare - Premium Healthcare Services',
    description: 'Experience premium healthcare services at AsterMed Healthcare.',
    url: '/',
    siteName: 'AsterMed Healthcare',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AsterMed Healthcare',
    description: 'Premium Healthcare Services in Hyderabad',
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

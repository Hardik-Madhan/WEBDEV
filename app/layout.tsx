import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CareSure — Trusted Care, Right When You Need It',
  description:
    'Find reliable, verified caretakers near you, compare their profiles, and book the right support for yourself or your loved ones. Or become a caretaker and help families in your community.',
  generator: 'v0.app',
  keywords: [
    'caretaker',
    'elderly care',
    'home care',
    'patient care',
    'child care',
    'find caregiver',
    'care marketplace',
  ],
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2f6bd6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

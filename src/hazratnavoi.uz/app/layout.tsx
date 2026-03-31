import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SplashScreen } from '@/components/splash-screen'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hazratnavoi.uz — Navoiy shahrining bosh masjidi',
  description: 'Navoiy viloyati Hazrat Navoiy jome masjidining rasmiy veb-sayti. Namoz vaqtlari, ma\'ruzalar, yangiliklar va savol-javoblar.',
  generator: 'v0.app',
  keywords: ['Hazratnavoi', 'Navoiy masjid', 'namoz vaqtlari', 'islom', 'Uzbekistan mosque'],
  openGraph: {
    title: 'Hazratnavoi.uz — Navoiy shahrining bosh masjidi',
    description: 'Navoiy viloyati Hazrat Navoiy jome masjidining rasmiy veb-sayti.',
    locale: 'uz_UZ',
    type: 'website',
  },
  themeColor: '#166534',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <SplashScreen>
          {children}
          <Analytics />
        </SplashScreen>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SplashScreen } from '@/components/splash-screen'
import { AuthProvider } from '@/lib/auth-context'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
import { FloatingMenu } from '@/components/floating-menu'
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
  title: 'Hazratnavoi.uz — Навоий шаҳрининг бош масжиди',
  description: 'Навоий вилояти Ҳазрат Навоий жоме масжидининг расмий веб-сайти. Намоз вақтлари, маърузалар, янгиликлар ва савол-жавоблар.',
  generator: 'v0.app',
  keywords: ['Hazratnavoi', 'Навоий масжид', 'намоз вақтлари', 'ислом', 'Uzbekistan mosque'],
  openGraph: {
    title: 'Hazratnavoi.uz — Навоий шаҳрининг бош масжиди',
    description: 'Навоий вилояти Ҳазрат Навоий жоме масжидининг расмий веб-сайти.',
    locale: 'uz_UZ',
    type: 'website',
  },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'HazratNavoi' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ServiceWorkerRegister />
          <FloatingMenu />
          <SplashScreen>
            {children}
            <Analytics />
          </SplashScreen>
        </AuthProvider>
      </body>
    </html>
  )
}

import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import 'lenis/dist/lenis.css'
import '@/styles/globals.css'
import SmoothScroll from '@/components/editorial/SmoothScroll'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono-editorial',
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${playfair.variable} ${mono.variable}`}>
      <SmoothScroll />
      <Component {...pageProps} />
    </div>
  )
}

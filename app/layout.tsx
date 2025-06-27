// app/layout.tsx (Server Component)
import './globals.css'
import { Inter } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from 'next'
import LayoutWrapper from './components/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KMTCS - KM Training & Consulting Services',
  description:
    'KMTCS provides expert training and consulting services in engineering, management, and IT for both private and public sectors. We are an accredited Training Provider registered with SSM, HRDCorp, SMECorp, and the Ministry of Finance (MoF).',
	icons: {
		icon: [
			{
				type: 'image/svg+xml',
				media: '(prefers-color-scheme: light)',
				url: '/favicon.svg'
			},
			{
				type: 'image/svg+xml',
				media: '(prefers-color-scheme: dark)',
				url: '/favicon.svg'
			}
		]
	}
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}

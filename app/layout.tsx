// app/layout.tsx (Server Component)
import './globals.css'
import { Inter } from 'next/font/google'
import Footer from './components/Footer'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KM Training & Consulting Services (KMTCS)',
  description: 'Innovate - Grow - Transform',
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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-baby-blue min-h-screen`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Footer />
      </body>
    </html>
  )
}

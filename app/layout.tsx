// app/layout.tsx (Server Component)
import './globals.css'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './components/ClientLayout'
import type { Metadata } from 'next'

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
      <body className={`${inter.className} bg-baby-blue min-h-screen`}>
        <ClientLayout>
          <main>{children}</main>
        </ClientLayout>
      </body>
    </html>
  )
}

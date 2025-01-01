// app/layout.tsx (Server Component)
import './globals.css'
import { Inter } from 'next/font/google'
import Footer from './components/Footer'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KMTCS - Training and Consulting',
  description: 'KMTCS is a leading training and consulting firm.',
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

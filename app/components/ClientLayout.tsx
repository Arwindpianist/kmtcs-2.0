'use client'

import dynamic from 'next/dynamic'
import { SessionProvider } from 'next-auth/react' // Import SessionProvider

// Dynamically import Header, disabling SSR
const Header = dynamic(() => import('./Header'), { ssr: false })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      <main className="pt-24">
        {children}
      </main>
    </SessionProvider>
  )
}

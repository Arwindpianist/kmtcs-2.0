'use client'

import dynamic from 'next/dynamic'
import { SessionProvider } from 'next-auth/react' // Import SessionProvider

// Dynamically import Header, disabling SSR
const Header = dynamic(() => import('./Header'), { ssr: false })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      <main className="min-h-screen pt-[120px] md:pt-[140px] lg:pt-[160px]">
        {children}
      </main>
    </SessionProvider>
  )
}

'use client'

import dynamic from 'next/dynamic'
const Header = dynamic(() => import('./Header'), { ssr: false })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-24">
        {children}
      </main>
    </>
  )
} 
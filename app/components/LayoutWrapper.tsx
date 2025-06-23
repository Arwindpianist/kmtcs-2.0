'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      <main className={!isAdminPage ? "pt-28 md:pt-32 flex-grow" : "flex-grow"}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
} 
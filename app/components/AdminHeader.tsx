'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';

export default function AdminHeader() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-3">
              <img src="/KMTCS-NEW-LOGO.svg" alt="KMTCS" className="h-10 w-auto" />
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 
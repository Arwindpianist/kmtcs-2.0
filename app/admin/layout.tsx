'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HomeIcon,
  AcademicCapIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  EnvelopeIcon, 
  UsersIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/admin/login');
        return;
      }

      // For now, allow any authenticated user to access admin
      // In the future, you can add role checking when the users table is created
      console.log('User authenticated:', session.user.email);
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/admin/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <Image
                src="/KMTCS-NEW-LOGO.svg"
                alt="KMTCS Admin"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <span className="ml-4 text-xl font-semibold text-gray-900">Admin Panel</span>
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-72 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/admin"
                  className="flex items-center px-5 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group"
                >
                  <HomeIcon className="w-5 h-5 mr-4 text-gray-400 group-hover:text-blue-600" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/technical-trainings"
                  className="flex items-center px-5 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group"
                >
                  <AcademicCapIcon className="w-5 h-5 mr-4 text-gray-400 group-hover:text-blue-600" />
                  Technical Trainings
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/non-technical-trainings"
                  className="flex items-center px-5 py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors group"
                >
                  <AcademicCapIcon className="w-5 h-5 mr-4 text-gray-400 group-hover:text-green-600" />
                  Non-Technical Trainings
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/services"
                  className="flex items-center px-5 py-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors group"
                >
                  <BriefcaseIcon className="w-5 h-5 mr-4 text-gray-400 group-hover:text-purple-600" />
                  Consulting Services
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/contacts"
                  className="flex items-center px-5 py-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-4 text-gray-400 group-hover:text-red-600" />
                  Contact Messages
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
} 
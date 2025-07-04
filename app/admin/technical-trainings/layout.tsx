'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabase';
import { 
  HomeIcon,
  AcademicCapIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  EnvelopeIcon, 
  UsersIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

interface TechnicalTrainingsLayoutProps {
  children: ReactNode;
}

export default function TechnicalTrainingsLayout({ children }: TechnicalTrainingsLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('TechnicalTrainingsLayout: Checking authentication...');
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('TechnicalTrainingsLayout: Session found for user:', session.user.email);
          
          // Set user info from session
          setCurrentUser({
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || ''
          });
        } else {
          console.log('TechnicalTrainingsLayout: No session found, redirecting to login...');
          router.push('/login');
        }
      } catch (error) {
        console.error('TechnicalTrainingsLayout: Auth check error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('TechnicalTrainingsLayout: Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          router.push('/login');
        } else if (event === 'SIGNED_IN' && session?.user) {
          setCurrentUser({
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || ''
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden -m-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <Link href="/admin" className="flex items-center ml-2 lg:ml-0">
              <Image
                src="/KMTCS-NEW-LOGO.svg"
                alt="KMTCS Admin"
                width={120}
                height={40}
                className="h-8 w-auto lg:h-10"
              />
              <span className="ml-3 lg:ml-4 text-lg lg:text-xl font-semibold text-gray-900">Admin Panel</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name || currentUser.email}</p>
                <p className="text-xs text-gray-500">Technical Trainings</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            <button
              type="button"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="p-4 lg:p-6">
            <ul className="space-y-2 lg:space-y-3">
              <li>
                <Link
                  href="/admin"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <HomeIcon className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/technical-trainings"
                  className="flex items-center px-3 py-2 text-blue-700 bg-blue-50 rounded-lg font-medium"
                >
                  <AcademicCapIcon className="w-5 h-5 mr-3" />
                  Technical Trainings
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/non-technical-trainings"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <AcademicCapIcon className="w-5 h-5 mr-3" />
                  Non-Technical Trainings
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/services"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <BriefcaseIcon className="w-5 h-5 mr-3" />
                  Consulting Services
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/consultants"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <UserGroupIcon className="w-5 h-5 mr-3" />
                  Consultants
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/contacts"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-3" />
                  Contact Submissions
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <UsersIcon className="w-5 h-5 mr-3" />
                  Users
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 
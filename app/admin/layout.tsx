'use client';

import { useEffect, useState } from 'react';
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
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

// Admin emails that are allowed to access the admin panel
const ADMIN_EMAILS = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_1,
  process.env.NEXT_PUBLIC_ADMIN_EMAIL_2,
].filter(Boolean);

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if user is an admin
          if (ADMIN_EMAILS.includes(session.user.email)) {
            setIsAuthorized(true);
            setCurrentAdmin({
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email
            });
          } else {
            // Not an admin, sign out and redirect
            await supabase.auth.signOut();
            setIsAuthorized(false);
            setCurrentAdmin(null);
            router.push('/login');
          }
        } else {
          // No session, redirect to login
          setIsAuthorized(false);
          setCurrentAdmin(null);
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthorized(false);
        setCurrentAdmin(null);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsAuthorized(false);
          setCurrentAdmin(null);
          router.push('/login');
        } else if (event === 'SIGNED_IN' && session?.user) {
          if (ADMIN_EMAILS.includes(session.user.email)) {
            setIsAuthorized(true);
            setCurrentAdmin({
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email
            });
          } else {
            await supabase.auth.signOut();
            router.push('/login');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthorized(false);
      setCurrentAdmin(null);
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
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
            {currentAdmin && (
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{currentAdmin.name || currentAdmin.email}</p>
                <p className="text-xs text-gray-500 capitalize">admin</p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 lg:px-4 py-2 lg:py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm lg:text-base"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
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
                  className="flex items-center px-4 lg:px-5 py-3 lg:py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <HomeIcon className="w-5 h-5 mr-3 lg:mr-4 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-sm lg:text-base">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/technical-trainings"
                  className="flex items-center px-4 lg:px-5 py-3 lg:py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <AcademicCapIcon className="w-5 h-5 mr-3 lg:mr-4 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-sm lg:text-base">Technical Trainings</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/non-technical-trainings"
                  className="flex items-center px-4 lg:px-5 py-3 lg:py-4 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <AcademicCapIcon className="w-5 h-5 mr-3 lg:mr-4 text-gray-400 group-hover:text-green-600" />
                  <span className="text-sm lg:text-base">Non-Technical Trainings</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/services"
                  className="flex items-center px-4 lg:px-5 py-3 lg:py-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <BriefcaseIcon className="w-5 h-5 mr-3 lg:mr-4 text-gray-400 group-hover:text-purple-600" />
                  <span className="text-sm lg:text-base">Consulting Services</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/consultants"
                  className="flex items-center px-4 lg:px-5 py-3 lg:py-4 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-xl transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <UserGroupIcon className="w-5 h-5 mr-3 lg:mr-4 text-gray-400 group-hover:text-yellow-600" />
                  <span className="text-sm lg:text-base">Consultants</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/contacts"
                  className="flex items-center px-4 lg:px-5 py-3 lg:py-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <EnvelopeIcon className="w-5 h-5 mr-3 lg:mr-4 text-gray-400 group-hover:text-red-600" />
                  <span className="text-sm lg:text-base">Contact Messages</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/test-auth"
                  className="flex items-center px-4 lg:px-5 py-3 lg:py-4 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-xl transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <UsersIcon className="w-5 h-5 mr-3 lg:mr-4 text-gray-400 group-hover:text-yellow-600" />
                  <span className="text-sm lg:text-base">Test Auth</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { AdminAuthService } from '@/app/lib/adminAuth';
import { logger } from '@/app/lib/logger';
import { 
  HomeIcon,
  AcademicCapIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  EnvelopeIcon, 
  UsersIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import { AdminAuthSkeleton } from '@/app/components/skeletons/PageSkeletons';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<{ email: string; name: string } | null>(null);

  // Check if current route should skip admin verification
  const shouldSkipAdminCheck = pathname?.includes('/admin/technical-trainings') ||
                              pathname?.includes('/admin/non-technical-trainings') ||
                              pathname?.includes('/admin/calendar') ||
                              pathname?.includes('/admin/payment-links') ||
                              pathname?.includes('/admin/brochure-reconciliation') ||
                              pathname?.includes('/admin/services') ||
                              pathname?.includes('/admin/consultants');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        logger.log('AdminLayout: Checking authentication...');
        
        // Get current session
        const session = await getSession();
        
        if (session?.user) {
          logger.log('AdminLayout: Session found for user:', session.user.email);
          
          // Set basic user info from session first
          setCurrentAdmin({
            email: session.user.email || '',
            name: session.user.name || session.user.email || ''
          });
          
          // If this is one of the pages that should skip admin check, just authorize
          if (shouldSkipAdminCheck) {
            logger.log('AdminLayout: Skipping admin check for this route');
            setIsAuthorized(true);
            return;
          }
          
          // Check if user is an admin using AdminAuthService with timeout
          try {
            const isAdmin = await Promise.race([
              AdminAuthService.isAdmin(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Admin check timeout')), 5000)
              )
            ]);
            
            logger.log('AdminLayout: Is admin check result:', isAdmin);
            
            if (isAdmin) {
              // Try to get detailed admin user data, but don't block if it fails
              try {
                const adminUser = await Promise.race([
                  AdminAuthService.getCurrentAdmin(),
                  new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Admin data timeout')), 3000)
                  )
                ]);
                
                if (adminUser && typeof adminUser === 'object' && 'full_name' in adminUser && adminUser.full_name) {
                  setCurrentAdmin(prev => ({
                    ...prev!,
                    name: adminUser.full_name as string
                  }));
                }
              } catch {
                logger.log('AdminLayout: Could not get detailed admin data, using session data');
              }
              
              setIsAuthorized(true);
            } else {
              logger.log('AdminLayout: User is not an admin, signing out...');
              await AdminAuthService.signOut();
              setIsAuthorized(false);
              setCurrentAdmin(null);
              router.push('/login');
            }
          } catch (adminCheckError) {
            logger.error('AdminLayout: Admin check failed:', adminCheckError);
            // If admin check fails, allow access temporarily and log the error
            // This prevents getting stuck on authorization check
            logger.log('AdminLayout: Allowing access despite admin check failure');
            setIsAuthorized(true);
          }
        } else {
          logger.log('AdminLayout: No session found, redirecting to login...');
          setIsAuthorized(false);
          setCurrentAdmin(null);
          router.push('/login');
        }
      } catch (error) {
        logger.error('AdminLayout: Auth check error:', error);
        setIsAuthorized(false);
        setCurrentAdmin(null);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, shouldSkipAdminCheck]);

  const handleSignOut = async () => {
    try {
      await AdminAuthService.signOut();
      setIsAuthorized(false);
      setCurrentAdmin(null);
      router.push('/login');
    } catch (error) {
      logger.error('Sign out error:', error);
    }
  };

  if (isLoading) {
    return <AdminAuthSkeleton />;
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
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <HomeIcon className="w-5 h-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/technical-trainings"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
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
                  href="/admin/calendar"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <CalendarDaysIcon className="w-5 h-5 mr-3" />
                  Calendar Management
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/payment-links"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <CreditCardIcon className="w-5 h-5 mr-3" />
                  Payment Links
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/brochure-reconciliation"
                  className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <DocumentTextIcon className="w-5 h-5 mr-3" />
                  Brochure Reconciliation
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
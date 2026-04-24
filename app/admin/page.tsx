'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { logger } from '@/app/lib/logger';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  EnvelopeIcon, 
  UsersIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { AdminDashboardSkeleton } from '@/app/components/skeletons/PageSkeletons';

interface DashboardStats {
  technicalTrainings: number;
  technicalTrainingsActive: number;
  nonTechnicalTrainings: number;
  nonTechnicalTrainingsActive: number;
  consultingServices: number;
  consultingServicesActive: number;
  contacts: number;
  contactsNew: number;
  calendarEvents: number;
  calendarEventsActive: number;
  calendarEventsUpcoming: number;
  upcomingEvents: Array<{
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    location: string | null;
    status: boolean;
  }>;
  lastUpdated: Date | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    technicalTrainings: 0,
    technicalTrainingsActive: 0,
    nonTechnicalTrainings: 0,
    nonTechnicalTrainingsActive: 0,
    consultingServices: 0,
    consultingServicesActive: 0,
    contacts: 0,
    contactsNew: 0,
    calendarEvents: 0,
    calendarEventsActive: 0,
    calendarEventsUpcoming: 0,
    upcomingEvents: [],
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetch('/api/admin/dashboard-stats');
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to load dashboard stats');
      }

      setStats({
        ...(payload.data as Omit<DashboardStats, 'lastUpdated'>),
        lastUpdated: new Date(),
      });

    } catch (error) {
      logger.error('Error loading dashboard stats:', error);
      // Set default stats on error
      setStats({
        technicalTrainings: 0,
        technicalTrainingsActive: 0,
        nonTechnicalTrainings: 0,
        nonTechnicalTrainingsActive: 0,
        consultingServices: 0,
        consultingServicesActive: 0,
        contacts: 0,
        contactsNew: 0,
        calendarEvents: 0,
        calendarEventsActive: 0,
        calendarEventsUpcoming: 0,
        upcomingEvents: [],
        lastUpdated: null
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground">Monitor and manage your KMTCS services and content</p>
              {stats.lastUpdated && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {stats.lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <Button
              onClick={() => loadDashboardStats(true)}
              disabled={refreshing}
              variant="outline"
              className="mt-4 sm:mt-0"
            >
              <ArrowPathIcon className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-8 mb-8 lg:mb-12 items-stretch">
        {/* Technical Trainings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full border-2 transition-shadow hover:shadow-md flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 lg:p-4 bg-blue-100 rounded-xl">
                <AcademicCapIcon className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.technicalTrainings}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-muted-foreground break-words">{stats.technicalTrainingsActive} active</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-lg lg:text-xl mb-2">Technical Trainings</CardTitle>
            <CardDescription className="text-sm lg:text-base leading-relaxed break-words">
              Engineering and technical skill development programs
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <a
              href="/admin/technical-trainings"
              className="inline-flex items-center text-xs lg:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Manage Trainings
              <ArrowRightIcon className="ml-2 w-3 h-3 lg:w-4 lg:h-4" />
            </a>
          </CardContent>
        </Card>
        </motion.div>

        {/* Non-Technical Trainings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full border-2 transition-shadow hover:shadow-md flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 lg:p-4 bg-green-100 rounded-xl">
                <AcademicCapIcon className="w-6 h-6 lg:w-7 lg:h-7 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.nonTechnicalTrainings}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-muted-foreground break-words">{stats.nonTechnicalTrainingsActive} active</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-lg lg:text-xl mb-2">Non-Technical Trainings</CardTitle>
            <CardDescription className="text-sm lg:text-base leading-relaxed break-words">
              Management and soft skills development programs
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <a
              href="/admin/non-technical-trainings"
              className="inline-flex items-center text-xs lg:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Manage Trainings
              <ArrowRightIcon className="ml-2 w-3 h-3 lg:w-4 lg:h-4" />
            </a>
          </CardContent>
        </Card>
        </motion.div>

        {/* Consulting Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full border-2 transition-shadow hover:shadow-md flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 lg:p-4 bg-purple-100 rounded-xl">
                <BriefcaseIcon className="w-6 h-6 lg:w-7 lg:h-7 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.consultingServices}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-muted-foreground break-words">{stats.consultingServicesActive} active</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-lg lg:text-xl mb-2">Consulting Services</CardTitle>
            <CardDescription className="text-sm lg:text-base leading-relaxed break-words">
              Professional consulting and advisory services
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <a
              href="/admin/services"
              className="inline-flex items-center text-xs lg:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Manage Services
              <ArrowRightIcon className="ml-2 w-3 h-3 lg:w-4 lg:h-4" />
            </a>
          </CardContent>
        </Card>
        </motion.div>

        {/* Contact Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full border-2 transition-shadow hover:shadow-md flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 lg:p-4 bg-red-100 rounded-xl">
                <EnvelopeIcon className="w-6 h-6 lg:w-7 lg:h-7 text-red-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.contacts}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Total</p>
                {stats.contactsNew > 0 && (
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full break-words">
                      {stats.contactsNew} new
                    </span>
                  </div>
                )}
              </div>
            </div>
            <CardTitle className="text-lg lg:text-xl mb-2">Contact Messages</CardTitle>
            <CardDescription className="text-sm lg:text-base leading-relaxed break-words">
              Inquiries and contact form submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <a
              href="/admin/contacts"
              className="inline-flex items-center text-xs lg:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View Messages
              <ArrowRightIcon className="ml-2 w-3 h-3 lg:w-4 lg:h-4" />
            </a>
          </CardContent>
        </Card>
        </motion.div>

        {/* Calendar Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full border-2 transition-shadow hover:shadow-md flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 lg:p-4 bg-indigo-100 rounded-xl">
                  <CalendarDaysIcon className="w-6 h-6 lg:w-7 lg:h-7 text-indigo-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{stats.calendarEvents}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">Total</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-muted-foreground break-words">{stats.calendarEventsUpcoming} upcoming</span>
                  </div>
                </div>
              </div>
              <CardTitle className="text-lg lg:text-xl mb-2">Calendar Events</CardTitle>
              <CardDescription className="text-sm lg:text-base leading-relaxed break-words">
                Published sessions linked to your training catalog
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <a
                href="/admin/calendar"
                className="inline-flex items-center text-xs lg:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Manage Calendar
                <ArrowRightIcon className="ml-2 w-3 h-3 lg:w-4 lg:h-4" />
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Calendar Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <Card className="mb-8 lg:mb-12 border-2">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="text-xl lg:text-2xl mb-2 lg:mb-0">Upcoming Events Timeline</CardTitle>
              <a
                href="/admin/calendar"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
              >
                Open Calendar Management
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </a>
            </div>
            <CardDescription>Next published training events at a glance</CardDescription>
          </CardHeader>
          <CardContent className="p-6 lg:p-8 pt-0">
            {stats.upcomingEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-muted-foreground">
                No upcoming active calendar events yet.
              </div>
            ) : (
              <div className="space-y-4">
                {stats.upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.start_time).toLocaleString()}
                          {event.location ? ` • ${event.location}` : ''}
                        </p>
                      </div>
                      <a
                        href="/admin/calendar"
                        className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Manage
                        <ArrowRightIcon className="ml-1 w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
      >
        <Card className="mb-8 lg:mb-12 border-2">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl lg:text-2xl mb-2 lg:mb-0">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 lg:p-8 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
          <a
            href="/admin/technical-trainings"
            className="group flex h-full items-start p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all gap-3"
          >
            <div className="p-2 lg:p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <PlusIcon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
            <span className="min-w-0 flex-1 whitespace-normal text-left text-sm lg:text-base leading-snug text-gray-700 font-medium">
              Add Technical Training
            </span>
          </a>
          <a
            href="/admin/non-technical-trainings"
            className="group flex h-full items-start p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all gap-3"
          >
            <div className="p-2 lg:p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <PlusIcon className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
            <span className="min-w-0 flex-1 whitespace-normal text-left text-sm lg:text-base leading-snug text-gray-700 font-medium">
              Add Non-Technical Training
            </span>
          </a>
          <a
            href="/admin/services"
            className="group flex h-full items-start p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all gap-3"
          >
            <div className="p-2 lg:p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <PlusIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
            </div>
            <span className="min-w-0 flex-1 whitespace-normal text-left text-sm lg:text-base leading-snug text-gray-700 font-medium">
              Add Consulting Service
            </span>
          </a>
          <a
            href="/admin/contacts"
            className="group flex h-full items-start p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all gap-3"
          >
            <div className="p-2 lg:p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <PlusIcon className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
            </div>
            <span className="min-w-0 flex-1 whitespace-normal text-left text-sm lg:text-base leading-snug text-gray-700 font-medium">
              View Contact Messages
            </span>
          </a>
          <a
            href="/admin/calendar"
            className="group flex h-full items-start p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all gap-3"
          >
            <div className="p-2 lg:p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <CalendarDaysIcon className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
            </div>
            <span className="min-w-0 flex-1 whitespace-normal text-left text-sm lg:text-base leading-snug text-gray-700 font-medium">
              Open Calendar Management
            </span>
          </a>
          <a
            href="/admin/payment-links"
            className="group flex h-full items-start p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-sky-50 hover:border-sky-200 transition-all gap-3"
          >
            <div className="p-2 lg:p-3 bg-sky-100 rounded-lg group-hover:bg-sky-200 transition-colors">
              <CreditCardIcon className="w-5 h-5 lg:w-6 lg:h-6 text-sky-600" />
            </div>
            <span className="min-w-0 flex-1 whitespace-normal text-left text-sm lg:text-base leading-snug text-gray-700 font-medium">
              Manage Payment Links
            </span>
          </a>
        </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
      >
        <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl lg:text-2xl">System Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6 lg:p-8 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          <div className="text-center p-6 lg:p-8 bg-blue-50 rounded-xl">
            <p className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2 break-words">{stats.technicalTrainings + stats.nonTechnicalTrainings}</p>
            <p className="text-sm lg:text-base text-muted-foreground font-medium break-words">Total Training Programs</p>
          </div>
          <div className="text-center p-6 lg:p-8 bg-purple-50 rounded-xl">
            <p className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2 break-words">{stats.consultingServices}</p>
            <p className="text-sm lg:text-base text-muted-foreground font-medium break-words">Consulting Services</p>
          </div>
          <div className="text-center p-6 lg:p-8 bg-gray-50 rounded-xl">
            <p className="text-3xl lg:text-4xl font-bold text-gray-600 mb-2 break-words">{stats.contacts}</p>
            <p className="text-sm lg:text-base text-muted-foreground font-medium break-words">Pending Inquiries</p>
          </div>
          <div className="text-center p-6 lg:p-8 bg-indigo-50 rounded-xl">
            <p className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2 break-words">{stats.calendarEventsUpcoming}</p>
            <p className="text-sm lg:text-base text-muted-foreground font-medium break-words">Upcoming Calendar Events</p>
          </div>
        </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
} 
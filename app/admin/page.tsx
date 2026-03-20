'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase';
import { logger } from '@/app/lib/logger';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  EnvelopeIcon, 
  UsersIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

interface DashboardStats {
  technicalTrainings: number;
  technicalTrainingsActive: number;
  nonTechnicalTrainings: number;
  nonTechnicalTrainingsActive: number;
  consultingServices: number;
  consultingServicesActive: number;
  contacts: number;
  contactsNew: number;
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
      
      // Load stats with more detailed information
      const [
        technicalTrainingsResult,
        technicalTrainingsActiveResult,
        nonTechnicalTrainingsResult,
        nonTechnicalTrainingsActiveResult,
        consultingServicesResult,
        consultingServicesActiveResult,
        contactsResult,
        contactsNewResult
      ] = await Promise.all([
        supabase.from('technical_trainings').select('*', { count: 'exact', head: true }),
        supabase.from('technical_trainings').select('*', { count: 'exact', head: true }).eq('status', true),
        supabase.from('non_technical_trainings').select('*', { count: 'exact', head: true }),
        supabase.from('non_technical_trainings').select('*', { count: 'exact', head: true }).eq('status', true),
        supabase.from('consulting_services').select('*', { count: 'exact', head: true }),
        supabase.from('consulting_services').select('*', { count: 'exact', head: true }).eq('status', true),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new')
      ]);

      // Check for errors in each query and provide fallbacks
      const stats: DashboardStats = {
        technicalTrainings: technicalTrainingsResult.count || 0,
        technicalTrainingsActive: technicalTrainingsActiveResult.count || 0,
        nonTechnicalTrainings: nonTechnicalTrainingsResult.count || 0,
        nonTechnicalTrainingsActive: nonTechnicalTrainingsActiveResult.count || 0,
        consultingServices: consultingServicesResult.count || 0,
        consultingServicesActive: consultingServicesActiveResult.count || 0,
        contacts: contactsResult.count || 0,
        contactsNew: contactsNewResult.count || 0,
        lastUpdated: new Date()
      };

      // Log any errors for debugging
      if (technicalTrainingsResult.error) {
        logger.error('Error loading technical trainings:', technicalTrainingsResult.error);
      }
      if (nonTechnicalTrainingsResult.error) {
        logger.error('Error loading non-technical trainings:', nonTechnicalTrainingsResult.error);
      }
      if (consultingServicesResult.error) {
        logger.error('Error loading consulting services:', consultingServicesResult.error);
      }
      if (contactsResult.error) {
        logger.error('Error loading contact submissions:', contactsResult.error);
      }

      setStats(stats);

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
        lastUpdated: null
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-8 lg:mb-12">
        {/* Technical Trainings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow border-2">
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
          <CardContent>
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
          <Card className="hover:shadow-md transition-shadow border-2">
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
          <CardContent>
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
          <Card className="hover:shadow-md transition-shadow border-2">
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
          <CardContent>
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
          <Card className="hover:shadow-md transition-shadow border-2">
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
          <CardContent>
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
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="mb-8 lg:mb-12 border-2">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl lg:text-2xl mb-2 lg:mb-0">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 lg:p-8 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <a
            href="/admin/technical-trainings"
            className="group flex items-center p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all"
          >
            <div className="p-2 lg:p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <PlusIcon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
            <span className="ml-3 lg:ml-4 text-sm lg:text-base text-gray-700 font-medium">Add Technical Training</span>
          </a>
          <a
            href="/admin/non-technical-trainings"
            className="group flex items-center p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all"
          >
            <div className="p-2 lg:p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <PlusIcon className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
            <span className="ml-3 lg:ml-4 text-sm lg:text-base text-gray-700 font-medium">Add Non-Technical Training</span>
          </a>
          <a
            href="/admin/services"
            className="group flex items-center p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all"
          >
            <div className="p-2 lg:p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <PlusIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
            </div>
            <span className="ml-3 lg:ml-4 text-sm lg:text-base text-gray-700 font-medium">Add Consulting Service</span>
          </a>
          <a
            href="/admin/contacts"
            className="group flex items-center p-4 lg:p-6 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all"
          >
            <div className="p-2 lg:p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <PlusIcon className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
            </div>
            <span className="ml-3 lg:ml-4 text-sm lg:text-base text-gray-700 font-medium">View Contact Messages</span>
          </a>
        </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl lg:text-2xl">System Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6 lg:p-8 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
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
        </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
} 
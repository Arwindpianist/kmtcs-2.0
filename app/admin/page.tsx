'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  EnvelopeIcon, 
  UsersIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  technicalTrainings: number;
  nonTechnicalTrainings: number;
  consultingServices: number;
  contacts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    technicalTrainings: 0,
    nonTechnicalTrainings: 0,
    consultingServices: 0,
    contacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Load stats for existing tables only
      const [
        technicalTrainingsResult,
        nonTechnicalTrainingsResult,
        consultingServicesResult,
        contactsResult
      ] = await Promise.all([
        supabase.from('technical_trainings').select('*', { count: 'exact', head: true }),
        supabase.from('non_technical_trainings').select('*', { count: 'exact', head: true }),
        supabase.from('consulting_services').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true })
      ]);

      // Check for errors in each query and provide fallbacks
      const stats = {
        technicalTrainings: technicalTrainingsResult.count || 0,
        nonTechnicalTrainings: nonTechnicalTrainingsResult.count || 0,
        consultingServices: consultingServicesResult.count || 0,
        contacts: contactsResult.count || 0
      };

      // Log any errors for debugging
      if (technicalTrainingsResult.error) {
        console.error('Error loading technical trainings:', technicalTrainingsResult.error);
      }
      if (nonTechnicalTrainingsResult.error) {
        console.error('Error loading non-technical trainings:', nonTechnicalTrainingsResult.error);
      }
      if (consultingServicesResult.error) {
        console.error('Error loading consulting services:', consultingServicesResult.error);
      }
      if (contactsResult.error) {
        console.error('Error loading contact submissions:', contactsResult.error);
      }

      setStats(stats);

      console.log('Dashboard stats loaded successfully:', stats);

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set default stats on error
      setStats({
        technicalTrainings: 0,
        nonTechnicalTrainings: 0,
        consultingServices: 0,
        contacts: 0
      });
    } finally {
      setLoading(false);
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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor and manage your KMTCS services and content</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Technical Trainings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-blue-100 rounded-xl">
              <AcademicCapIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{stats.technicalTrainings}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Trainings</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">Engineering and technical skill development programs</p>
          <a
            href="/admin/technical-trainings"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Manage Trainings
            <ArrowRightIcon className="ml-2 w-4 h-4" />
          </a>
        </div>

        {/* Non-Technical Trainings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-green-100 rounded-xl">
              <AcademicCapIcon className="w-7 h-7 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{stats.nonTechnicalTrainings}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Non-Technical Trainings</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">Management and soft skills development programs</p>
          <a
            href="/admin/non-technical-trainings"
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
          >
            Manage Trainings
            <ArrowRightIcon className="ml-2 w-4 h-4" />
          </a>
        </div>

        {/* Consulting Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-purple-100 rounded-xl">
              <BriefcaseIcon className="w-7 h-7 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{stats.consultingServices}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Consulting Services</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">Professional consulting and advisory services</p>
          <a
            href="/admin/services"
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            Manage Services
            <ArrowRightIcon className="ml-2 w-4 h-4" />
          </a>
        </div>

        {/* Contact Messages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 bg-red-100 rounded-xl">
              <EnvelopeIcon className="w-7 h-7 text-red-600" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{stats.contacts}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Messages</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">Inquiries and contact form submissions</p>
          <a
            href="/admin/contacts"
            className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            View Messages
            <ArrowRightIcon className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-gray-600">Common administrative tasks</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a
            href="/admin/technical-trainings"
            className="group flex items-center p-6 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all"
          >
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <PlusIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="ml-4 text-gray-700 font-medium">Add Technical Training</span>
          </a>
          <a
            href="/admin/non-technical-trainings"
            className="group flex items-center p-6 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all"
          >
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <PlusIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="ml-4 text-gray-700 font-medium">Add Non-Technical Training</span>
          </a>
          <a
            href="/admin/services"
            className="group flex items-center p-6 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all"
          >
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <PlusIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="ml-4 text-gray-700 font-medium">Add Consulting Service</span>
          </a>
          <a
            href="/admin/contacts"
            className="group flex items-center p-6 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all"
          >
            <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <PlusIcon className="w-6 h-6 text-red-600" />
            </div>
            <span className="ml-4 text-gray-700 font-medium">View Contact Messages</span>
          </a>
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-blue-50 rounded-xl">
            <p className="text-4xl font-bold text-blue-600 mb-2">{stats.technicalTrainings + stats.nonTechnicalTrainings}</p>
            <p className="text-gray-600 font-medium">Total Training Programs</p>
          </div>
          <div className="text-center p-8 bg-purple-50 rounded-xl">
            <p className="text-4xl font-bold text-purple-600 mb-2">{stats.consultingServices}</p>
            <p className="text-gray-600 font-medium">Consulting Services</p>
          </div>
          <div className="text-center p-8 bg-gray-50 rounded-xl">
            <p className="text-4xl font-bold text-gray-600 mb-2">{stats.contacts}</p>
            <p className="text-gray-600 font-medium">Pending Inquiries</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
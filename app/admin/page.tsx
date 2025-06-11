'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

interface DashboardStats {
  totalServices: number;
  totalConsultants: number;
  totalEvents: number;
  totalContacts: number;
  recentContacts: Array<{
    id: string;
    name: string;
    email: string;
    created_at: string;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Fetch counts
        const [
          { count: servicesCount },
          { count: consultantsCount },
          { count: eventsCount },
          { count: contactsCount },
          { data: recentContacts }
        ] = await Promise.all([
          supabase.from('services').select('*', { count: 'exact', head: true }),
          supabase.from('consultants').select('*', { count: 'exact', head: true }),
          supabase.from('training_events').select('*', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
          supabase
            .from('contact_submissions')
            .select('id, name, email, created_at, status')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        setStats({
          totalServices: servicesCount || 0,
          totalConsultants: consultantsCount || 0,
          totalEvents: eventsCount || 0,
          totalContacts: contactsCount || 0,
          recentContacts: recentContacts || []
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Services</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalServices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Consultants</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalConsultants}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalEvents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Contacts</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats?.totalContacts}</p>
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Contact Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recentContacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${contact.status === 'new' ? 'bg-green-100 text-green-800' : 
                        contact.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {contact.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
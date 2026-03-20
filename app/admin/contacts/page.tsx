'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DataTable from '@/app/components/admin/DataTable';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export default function ContactsManagement() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      const response = await fetch('/api/contact-submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const result = await response.json();
      setSubmissions(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: ContactSubmission['status']) {
    try {
      const response = await fetch('/api/contact-submissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id,
          status: newStatus,
          updated_at: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      if(selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? {...prev, status: newStatus} : null);
      }
      await fetchSubmissions();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`/api/contact-submissions?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }
      
      if(selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
      await fetchSubmissions();
    } catch (err: any) {
      setError(err.message);
    }
  }

  const getStatusBadge = (status: ContactSubmission['status']) => {
    const styles = {
      new: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      new: 'New',
      in_progress: 'In Progress',
      completed: 'Completed',
      archived: 'Archived'
    };
    return (
      <span className={`text-sm rounded-full px-3 py-1 font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      label: 'Contact Info',
      sortable: true,
      render: (item: ContactSubmission) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
          {item.phone && <div className="text-sm text-gray-500">{item.phone}</div>}
        </div>
      )
    },
    {
      key: 'message',
      label: 'Message',
      sortable: false,
      render: (item: ContactSubmission) => (
        <div className="text-sm text-gray-900 line-clamp-2 max-w-md">{item.message}</div>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (item: ContactSubmission) => (
        <div className="text-sm text-gray-500">
          {new Date(item.created_at).toLocaleDateString()}
          <div className="text-xs text-gray-400">
            {new Date(item.created_at).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (item: ContactSubmission) => getStatusBadge(item.status)
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'new', label: 'New' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      key: 'created_at',
      label: 'From Date',
      type: 'date' as const
    }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
              <p className="text-gray-600">Manage and respond to customer inquiries and feedback</p>
            </div>
            {submissions.length > 0 && (
              <div className="text-sm text-gray-600">
                Total: <span className="font-semibold">{submissions.length}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <strong className="font-bold">Error:</strong>
            <span className="ml-2">{error}</span>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`${selectedSubmission ? 'lg:w-2/3' : 'w-full'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <DataTable
            data={submissions}
            columns={columns}
            filters={filters}
            searchable={true}
            searchPlaceholder="Search by name, email, phone, or message..."
            pageSize={25}
            loading={loading}
            emptyMessage="No contact submissions found"
            onRowClick={(item) => setSelectedSubmission(item)}
            actions={(item) => (
              <div className="flex items-center gap-2">
                <select
                  value={item.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleStatusChange(item.id, e.target.value as ContactSubmission['status']);
                  }}
                  className={`text-xs rounded-full px-2 py-1 font-medium border-0 cursor-pointer ${
                    item.status === 'new' ? 'bg-green-100 text-green-800' :
                    item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    item.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          />
          </motion.div>
        </div>

        {selectedSubmission && (
          <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 self-start">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-semibold">Submission Details</h2>
                <button 
                  onClick={() => setSelectedSubmission(null)} 
                  className="text-gray-500 hover:text-gray-800 text-2xl leading-none p-1 hover:bg-gray-100 rounded"
                >
                  &times;
                </button>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                <p className="text-sm text-gray-900 mb-1">{selectedSubmission.name}</p>
                <p className="text-sm text-gray-900 mb-1">{selectedSubmission.email}</p>
                {selectedSubmission.phone && <p className="text-sm text-gray-900">{selectedSubmission.phone}</p>}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{selectedSubmission.message}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <select
                  value={selectedSubmission.status}
                  onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value as ContactSubmission['status'])}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
               <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Submission Date</h3>
                <p className="text-sm text-gray-900">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
                <p className="text-sm text-gray-900">{new Date(selectedSubmission.updated_at).toLocaleString()}</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';

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

  function handleView(submission: ContactSubmission) {
    setSelectedSubmission(submission);
  }

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
          <p className="text-gray-600">Manage and respond to customer inquiries and feedback</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong className="font-bold">Error:</strong>
          <span className="ml-2">{error}</span>
        </div>
      )}

      <div className="flex gap-8">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contact Submissions</h3>
                        <p className="text-gray-600">When customers submit contact forms, they will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.map((submission) => (
                    <tr key={submission.id} className={`${selectedSubmission?.id === submission.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                        {submission.phone && (
                          <div className="text-sm text-gray-500">{submission.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{submission.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={submission.status}
                          onChange={(e) => handleStatusChange(submission.id, e.target.value as ContactSubmission['status'])}
                          className={`text-sm rounded-full px-3 py-1 font-medium border-0
                            ${submission.status === 'new' ? 'bg-green-100 text-green-800' :
                              submission.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              submission.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}`}
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleView(submission)}
                          className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 transition-colors mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedSubmission && (
          <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6 self-start">
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
          </div>
        )}
      </div>
    </div>
  );
} 
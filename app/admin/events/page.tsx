'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import DocumentUpload from '@/app/components/DocumentUpload';

interface TrainingEvent {
  id?: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  capacity: number;
  price: number | null;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface ExtractedData {
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  course_contents: string;
  target_audience: string;
  methodology: string;
  certification: string;
  hrdcorp_approval_no: string;
}

export default function EventsManagement() {
  const [events, setEvents] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<TrainingEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('training_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const { error } = await supabase
        .from('training_events')
        .upsert({
          ...editingEvent,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      await fetchEvents();
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('training_events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchEvents();
    } catch (err: any) {
      setError(err.message);
    }
  }

  function handleEdit(event: TrainingEvent) {
    setEditingEvent(event);
    setIsModalOpen(true);
  }

  function handleCreate() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setEditingEvent({
      title: '',
      description: '',
      start_date: tomorrow.toISOString().split('T')[0],
      end_date: tomorrow.toISOString().split('T')[0],
      location: '',
      capacity: 20,
      price: null,
      status: 'upcoming',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsModalOpen(true);
  }

  function handleDataExtracted(data: ExtractedData) {
    if (editingEvent) {
      // Auto-fill the form with extracted data
      setEditingEvent({
        ...editingEvent,
        title: data.title || editingEvent.title,
        description: data.description || editingEvent.description,
        // You can add more fields as needed
      });
    }
  }

  function handleUploadError(error: string) {
    setError(error);
  }

  function getStatusColor(status: TrainingEvent['status']) {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Training Events Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDocumentUpload(!showDocumentUpload)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {showDocumentUpload ? 'Hide' : 'Show'} Document Upload
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add New Event
          </button>
        </div>
      </div>

      {/* Document Upload Section */}
      {showDocumentUpload && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Training Documents</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload Word documents (.docx, .doc) or text files (.txt) to automatically extract training information and fill the form below.
          </p>
          <DocumentUpload 
            onDataExtracted={handleDataExtracted}
            onError={handleUploadError}
          />
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-500">{event.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(event.start_date).toLocaleDateString()}
                    {event.start_date !== event.end_date && (
                      <> - {new Date(event.end_date).toLocaleDateString()}</>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.price ? `$${event.price}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id || '')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingEvent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingEvent.id ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    value={editingEvent.start_date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, start_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    id="end_date"
                    value={editingEvent.end_date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, end_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  id="location"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    value={editingEvent.capacity}
                    onChange={(e) => setEditingEvent({ ...editingEvent, capacity: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (optional)</label>
                  <input
                    type="number"
                    id="price"
                    value={editingEvent.price || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, price: e.target.value ? Number(e.target.value) : null })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  value={editingEvent.status}
                  onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as TrainingEvent['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingEvent.id ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '@/app/components/admin/DataTable';
import { logger } from '@/app/lib/logger';

interface ConsultingService {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number | null;
  objectives: string[];
  service_contents: string;
  target_audience: string;
  methodology: string;
  deliverables: string;
  status: boolean;
  created_at: string;
}

export default function ConsultingServicesAdmin() {
  const [services, setServices] = useState<ConsultingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<ConsultingService | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: true,
    objectives: [''],
    service_contents: '',
    methodology: '',
    duration: '',
    target_audience: '',
    deliverables: '',
    price: null as number | null
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/consulting-services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const result = await response.json();
      setServices(result.data || []);
    } catch (error) {
      logger.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Clean the data by removing empty strings from arrays
      const cleanData = {
        ...formData,
        objectives: formData.objectives.filter(obj => obj.trim() !== '')
      };

      if (editingService) {
        // Update existing service
        const response = await fetch('/api/consulting-services', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...cleanData, id: editingService.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to update service');
        }
      } else {
        // Create new service
        const response = await fetch('/api/consulting-services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanData),
        });

        if (!response.ok) {
          throw new Error('Failed to create service');
        }
      }

      await loadServices();
      setShowForm(false);
      setEditingService(null);
      setFormData({ title: '', description: '', status: true, objectives: [''], service_contents: '', methodology: '', duration: '', target_audience: '', deliverables: '', price: null });
    } catch (error) {
      logger.error('Error saving service:', error);
      alert('Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: ConsultingService) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      status: service.status,
      objectives: service.objectives,
      service_contents: service.service_contents,
      methodology: service.methodology,
      duration: service.duration,
      target_audience: service.target_audience,
      deliverables: service.deliverables,
      price: service.price
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/consulting-services?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      await loadServices();
    } catch (error) {
      logger.error('Error deleting service:', error);
      alert('Error deleting service');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({ title: '', description: '', status: true, objectives: [''], service_contents: '', methodology: '', duration: '', target_audience: '', deliverables: '', price: null });
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
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
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Consulting Services</h1>
              <p className="text-gray-600">Manage professional consulting and advisory services</p>
            </div>
            <button
          onClick={() => setShowForm(true)}
          className="mt-4 lg:mt-0 bg-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm lg:text-base"
        >
          Add New Service
        </button>
          </div>
        </motion.div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-8 mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-6">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2 weeks, 3 months"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (RM)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="e.g., 5000.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Service Objectives */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Service Objectives</h3>
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addObjective}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Objective
                </button>
              </div>
            </div>

            {/* Service Contents */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Service Contents</h3>
              <textarea
                value={formData.service_contents}
                onChange={(e) => setFormData({ ...formData, service_contents: e.target.value })}
                rows={6}
                placeholder="Describe the detailed contents and scope of this service..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Target Audience */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Target Audience</h3>
              <textarea
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                rows={3}
                placeholder="Who is this service designed for?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Methodology */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Methodology</h3>
              <textarea
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                rows={3}
                placeholder="Describe the approach and methodology used..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Deliverables */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Deliverables</h3>
              <textarea
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                rows={3}
                placeholder="What will be delivered to the client?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </form>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DataTable
          data={services}
          columns={[
            {
              key: 'title',
              label: 'Service',
              sortable: true,
              render: (service: ConsultingService) => (
                <div>
                  <div className="font-medium text-gray-900">{service.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1 mt-1 max-w-md">{service.description}</div>
                </div>
              )
            },
            {
              key: 'duration',
              label: 'Duration',
              sortable: true,
              render: (service: ConsultingService) => (
                <span className="text-sm text-gray-700">{service.duration || 'Not specified'}</span>
              )
            },
            {
              key: 'price',
              label: 'Price',
              sortable: true,
              render: (service: ConsultingService) => (
                <span className="text-sm text-gray-700">
                  {service.price ? `RM ${service.price}` : 'Not set'}
                </span>
              )
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              render: (service: ConsultingService) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  service.status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.status ? 'Active' : 'Inactive'}
                </span>
              )
            },
            {
              key: 'created_at',
              label: 'Created',
              sortable: true,
              render: (service: ConsultingService) => (
                <span className="text-sm text-gray-500">
                  {service.created_at ? new Date(service.created_at).toLocaleDateString() : '-'}
                </span>
              )
            }
          ]}
          filters={[
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]
            }
          ]}
          searchable={true}
          searchPlaceholder="Search by title or description..."
          pageSize={25}
          loading={loading}
          emptyMessage="No consulting services found. Click 'Add New Service' to get started."
          actions={(service) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(service);
                }}
                className="text-purple-600 hover:text-purple-800 px-3 py-1 rounded border border-purple-600 hover:bg-purple-50 transition-colors text-xs"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(service.id);
                }}
                className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors text-xs"
              >
                Delete
              </button>
            </div>
          )}
          onRowClick={(service) => handleEdit(service)}
        />
        </motion.div>
      )}
    </div>
  );
} 
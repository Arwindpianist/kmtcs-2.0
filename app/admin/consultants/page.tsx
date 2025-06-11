'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  fetchConsultants, 
  createConsultant, 
  updateConsultant, 
  deleteConsultant,
  uploadConsultantImage,
  deleteConsultantImage,
  type Consultant 
} from '@/app/services/supabaseService';

export default function ConsultantsManagement() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingConsultant, setEditingConsultant] = useState<Consultant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Consultant>>({
    name: '',
    role: 'Senior',
    image_url: null,
    short_bio: '',
    full_bio: '',
    email: '',
    phone: '',
    status: true
  });

  useEffect(() => {
    loadConsultants();
  }, []);

  async function loadConsultants() {
    try {
      setLoading(true);
      const data = await fetchConsultants();
      setConsultants(data);
      setError(null);
    } catch (err) {
      console.error('Error loading consultants:', err);
      setError('Failed to load consultants. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image_url;

      // Handle image upload if there's a new image
      if (imageFile) {
        // Delete old image if it exists
        if (editingConsultant?.image_url) {
          await deleteConsultantImage(editingConsultant.image_url);
        }
        // Upload new image
        imageUrl = await uploadConsultantImage(imageFile);
      }

      const consultantData = {
        ...formData,
        image_url: imageUrl
      };

      if (editingConsultant) {
        await updateConsultant(editingConsultant.id, consultantData);
      } else {
        await createConsultant(consultantData as Omit<Consultant, 'id' | 'created_at' | 'updated_at'>);
      }

      await loadConsultants();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving consultant:', err);
      setError('Failed to save consultant. Please try again later.');
    }
  };

  const handleEdit = (consultant: Consultant) => {
    setEditingConsultant(consultant);
    setFormData({
      name: consultant.name,
      role: consultant.role,
      image_url: consultant.image_url,
      short_bio: consultant.short_bio,
      full_bio: consultant.full_bio,
      email: consultant.email,
      phone: consultant.phone,
      status: consultant.status
    });
    setImagePreview(consultant.image_url);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultant?')) return;
    
    try {
      const consultant = consultants.find(c => c.id === id);
      if (consultant?.image_url) {
        await deleteConsultantImage(consultant.image_url);
      }
      await deleteConsultant(id);
      await loadConsultants();
    } catch (err) {
      console.error('Error deleting consultant:', err);
      setError('Failed to delete consultant. Please try again later.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    setEditingConsultant(null);
    setFormData({
      name: '',
      role: 'Senior',
      image_url: null,
      short_bio: '',
      full_bio: '',
      email: '',
      phone: '',
      status: true
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Consultants</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Consultant
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consultant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {consultants.map((consultant) => (
              <tr key={consultant.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {consultant.image_url && (
                      <img
                        src={consultant.image_url}
                        alt={consultant.name}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{consultant.name}</div>
                      <div className="text-sm text-gray-500">{consultant.short_bio}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {consultant.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{consultant.email}</div>
                  {consultant.phone && <div>{consultant.phone}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    consultant.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {consultant.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(consultant)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(consultant.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingConsultant ? 'Edit Consultant' : 'Add New Consultant'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Consultant['role'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Associate">Associate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Bio *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.short_bio}
                  onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Bio *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.full_bio}
                  onChange={(e) => setFormData({ ...formData, full_bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingConsultant ? 'Update Consultant' : 'Create Consultant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
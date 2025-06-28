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
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Consultant>>({
    name: '',
    role: 'Senior',
    image_url: null,
    short_bio: '',
    full_bio: '',
    academic_qualifications: '',
    professional_certifications: '',
    career_experiences: '',
    status: true
  });
  const [saving, setSaving] = useState(false);

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
      setSaving(true);
      let imageUrl = formData.image_url;

      if (imageFile) {
        if (editingConsultant?.image_url) {
          await deleteConsultantImage(editingConsultant.image_url);
        }
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
      handleCancel();
    } catch (err) {
      console.error('Error saving consultant:', err);
      setError('Failed to save consultant. Please try again later.');
    } finally {
      setSaving(false);
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
      academic_qualifications: consultant.academic_qualifications,
      professional_certifications: consultant.professional_certifications,
      career_experiences: consultant.career_experiences,
      status: consultant.status
    });
    setImagePreview(consultant.image_url);
    setShowForm(true);
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

  const handleCancel = () => {
    setEditingConsultant(null);
    setFormData({
      name: '',
      role: 'Senior',
      image_url: null,
      short_bio: '',
      full_bio: '',
      academic_qualifications: '',
      professional_certifications: '',
      career_experiences: '',
      status: true
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowForm(false);
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Consultants</h1>
          <p className="text-gray-600">Manage expert consultants and trainers for your services</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
        >
          Add New Consultant
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2"> {error}</span>
        </div>
      )}

      {showForm ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold mb-6">{editingConsultant ? 'Edit Consultant' : 'Add New Consultant'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Consultant['role'] })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Associate">Associate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <div className="mt-2 flex items-center space-x-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Bio *
              </label>
              <textarea
                required
                rows={3}
                value={formData.short_bio}
                onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Bio *
              </label>
              <textarea
                required
                rows={6}
                value={formData.full_bio}
                onChange={(e) => setFormData({ ...formData, full_bio: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Qualifications
              </label>
              <textarea
                rows={4}
                value={formData.academic_qualifications || ''}
                onChange={(e) => setFormData({ ...formData, academic_qualifications: e.target.value })}
                placeholder="e.g., E&E Engineering Degree with Honours awarded by Engineering Council, UK (EC Part 2)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Certifications
              </label>
              <textarea
                rows={6}
                value={formData.professional_certifications || ''}
                onChange={(e) => setFormData({ ...formData, professional_certifications: e.target.value })}
                placeholder="e.g., Professional Engineer (P.Eng), Board of Engineers, Malaysia (BEM)&#10;Chartered Engineer (CEng) by the Engineering Council (EC) of UK&#10;Member of the Institution of Engineering and Technology, UK (MIET)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career Experiences
              </label>
              <textarea
                rows={6}
                value={formData.career_experiences || ''}
                onChange={(e) => setFormData({ ...formData, career_experiences: e.target.value })}
                placeholder="e.g., Six Sigma Trainer and Consultant&#10;Senior Staff Engineer at Infineon Technologies Sdn Bhd, Malacca&#10;Staff Process Engineer at Freescale Semiconductor"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="status"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label htmlFor="status" className="ml-3 block text-sm text-gray-700">
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 font-medium"
              >
                {saving ? 'Saving...' : (editingConsultant ? 'Update Consultant' : 'Add Consultant')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-8">
          {consultants.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No Consultants</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Get started by adding your first consultant. This will help showcase your expert team members.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Add Your First Consultant
                </button>
              </div>
            </div>
          ) : (
            consultants.map((consultant) => (
              <div key={consultant.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <img
                      src={consultant.image_url || '/default-avatar.png'}
                      alt={consultant.name}
                      className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {consultant.name}
                        </h3>
                        <p className="text-lg text-gray-600 mb-3">{consultant.role} Consultant</p>
                        <p className="text-gray-600 mb-4 leading-relaxed">{consultant.short_bio}</p>
                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            consultant.status 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {consultant.status ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(consultant)}
                          className="text-yellow-600 hover:text-yellow-800 px-4 py-2 rounded-lg border border-yellow-600 hover:bg-yellow-50 transition-colors font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(consultant.id)}
                          className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {consultant.full_bio && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Full Bio:</h4>
                        <p className="text-gray-600 leading-relaxed">{consultant.full_bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 
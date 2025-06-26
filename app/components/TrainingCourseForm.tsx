'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';

interface TrainingCourse {
  id?: string;
  title: string;
  description: string;
  duration: string;
  price: number | null;
  objectives: string[];
  course_contents: string;
  target_audience: string;
  methodology: string;
  certification: string;
  hrdcorp_approval_no: string;
  service_type: 'technical_training' | 'non_technical_training';
  status: boolean;
}

interface TrainingCourseFormProps {
  initialData?: Partial<TrainingCourse>;
  onSubmit: (data: Omit<TrainingCourse, 'service_type'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function TrainingCourseForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false 
}: TrainingCourseFormProps) {
  const [formData, setFormData] = useState<TrainingCourse>({
    title: '',
    description: '',
    duration: '',
    price: null,
    objectives: [''],
    course_contents: '',
    target_audience: '',
    methodology: '',
    certification: '',
    hrdcorp_approval_no: '',
    service_type: 'technical_training',
    status: true,
    ...initialData
  });

  const [newObjective, setNewObjective] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        objectives: initialData.objectives || ['']
      }));
    }
  }, [initialData]);

  const handleInputChange = (field: keyof TrainingCourse, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      objectives: formData.objectives.filter(obj => obj.trim() !== '')
    };
    
    // Remove service_type from the data being sent to database
    // as the individual training tables don't have this column
    const { service_type, ...dataForDatabase } = cleanData;
    
    onSubmit(dataForDatabase);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              value={formData.service_type}
              onChange={(e) => handleInputChange('service_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="technical_training">Technical Training</option>
              <option value="non_technical_training">Non-Technical Training</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g., 3 days"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => handleInputChange('price', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="e.g., 1500.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HRDCorp Approval Number
            </label>
            <input
              type="text"
              value={formData.hrdcorp_approval_no}
              onChange={(e) => handleInputChange('hrdcorp_approval_no', e.target.value)}
              placeholder="e.g., 10001234"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Learning Objectives</h3>
        <div className="space-y-3">
          {formData.objectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => updateObjective(index, e.target.value)}
                placeholder={`Objective ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex gap-2">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="Add new objective"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addObjective}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Course Contents */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Course Contents</h3>
        <textarea
          value={formData.course_contents}
          onChange={(e) => handleInputChange('course_contents', e.target.value)}
          rows={8}
          placeholder="Enter detailed course contents..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Target Audience */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Target Audience</h3>
        <textarea
          value={formData.target_audience}
          onChange={(e) => handleInputChange('target_audience', e.target.value)}
          rows={3}
          placeholder="Who should attend this training?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Methodology */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Training Methodology</h3>
        <textarea
          value={formData.methodology}
          onChange={(e) => handleInputChange('methodology', e.target.value)}
          rows={3}
          placeholder="Describe the training methodology..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Certification */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Certification</h3>
        <textarea
          value={formData.certification}
          onChange={(e) => handleInputChange('certification', e.target.value)}
          rows={3}
          placeholder="Describe certification details..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="status"
            checked={formData.status}
            onChange={(e) => handleInputChange('status', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
            Active (visible to users)
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Course'}
        </button>
      </div>
    </form>
  );
} 
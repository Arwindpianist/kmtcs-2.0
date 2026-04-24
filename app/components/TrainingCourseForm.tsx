'use client';

import { useState, useEffect } from 'react';

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
  service_type?: 'technical_training' | 'non_technical_training';
  status: boolean;
  brochure_url?: string;
  brochure_path?: string;
  brochure_file_name?: string;
  brochure_file_size?: number;
  brochure_mime_type?: string;
  brochure_updated_at?: string;
  linked_event_ids?: string[];
}

interface TrainingCourseFormProps {
  initialData?: Partial<TrainingCourse>;
  onSubmit: (data: TrainingCourse) => void;
  onCancel: () => void;
  loading?: boolean;
  hideServiceType?: boolean;
  trainingTable?: 'technical_trainings' | 'non_technical_trainings';
}

export default function TrainingCourseForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false,
  hideServiceType = false,
  trainingTable = 'technical_trainings'
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
    ...(hideServiceType ? {} : { service_type: 'technical_training' }),
    status: true,
    linked_event_ids: [],
    ...initialData
  });

  const [newObjective, setNewObjective] = useState('');
  const [availableEvents, setAvailableEvents] = useState<Array<{ id: string; title: string; start_time: string }>>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        objectives: initialData.objectives || [''],
        linked_event_ids: initialData.linked_event_ids || []
      }));
    }
  }, [initialData]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch('/api/admin/calendar-events?status=true');
        if (!response.ok) throw new Error('Failed to load calendar events');
        const result = await response.json();
        setAvailableEvents(result.data || []);
      } catch {
        setAvailableEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleInputChange = (field: keyof TrainingCourse, value: unknown) => {
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
    
    // Remove service_type if it's hidden (for non-technical trainings table)
    if (hideServiceType) {
      const dataWithoutServiceType = { ...cleanData };
      delete (dataWithoutServiceType as Partial<TrainingCourse>).service_type;
      onSubmit(dataWithoutServiceType as TrainingCourse);
    } else {
      onSubmit(cleanData);
    }
  };

  const toggleLinkedEvent = (eventId: string) => {
    setFormData((prev) => {
      const current = prev.linked_event_ids || [];
      const exists = current.includes(eventId);
      return {
        ...prev,
        linked_event_ids: exists ? current.filter((id) => id !== eventId) : [...current, eventId],
      };
    });
  };

  const handleBrochureUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingBrochure(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/admin/upload-training-brochure', {
        method: 'POST',
        body,
      });
      if (!response.ok) {
        throw new Error('Brochure upload failed');
      }
      const payload = await response.json();
      setFormData((prev) => ({
        ...prev,
        brochure_url: payload.url,
        brochure_path: payload.path,
        brochure_file_name: payload.file_name,
        brochure_file_size: payload.file_size,
        brochure_mime_type: payload.mime_type,
        brochure_updated_at: new Date().toISOString(),
      }));
    } catch {
      alert('Failed to upload brochure PDF');
    } finally {
      setUploadingBrochure(false);
    }
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
          
          {!hideServiceType && (
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
          )}

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
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">Brochure PDF</h3>
        <div className="flex flex-col gap-3">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleBrochureUpload(e.target.files?.[0] || null)}
            className="text-sm"
          />
          {uploadingBrochure ? <p className="text-sm text-blue-600">Uploading brochure...</p> : null}
          {formData.brochure_url ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              <div className="font-medium">{formData.brochure_file_name || 'Uploaded brochure'}</div>
              <a href={formData.brochure_url} target="_blank" rel="noopener noreferrer" className="underline">
                Preview brochure
              </a>
              <button
                type="button"
                className="ml-4 text-red-600 underline"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    brochure_url: '',
                    brochure_path: '',
                    brochure_file_name: '',
                    brochure_file_size: undefined,
                    brochure_mime_type: '',
                    brochure_updated_at: new Date().toISOString(),
                  }))
                }
              >
                Remove
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No brochure uploaded yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold">Linked Calendar Events</h3>
        {eventsLoading ? (
          <p className="text-sm text-gray-500">Loading events...</p>
        ) : availableEvents.length === 0 ? (
          <p className="text-sm text-gray-500">No active calendar events available yet.</p>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
            {availableEvents.map((event) => (
              <label key={event.id} className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={(formData.linked_event_ids || []).includes(event.id)}
                  onChange={() => toggleLinkedEvent(event.id)}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium text-gray-900">{event.title}</span>
                  <span className="block text-gray-500">
                    {new Date(event.start_time).toLocaleString('en-GB')}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500">
          Selected events: {(formData.linked_event_ids || []).length}. These links are saved with the training record in {trainingTable}.
        </p>
      </div>

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
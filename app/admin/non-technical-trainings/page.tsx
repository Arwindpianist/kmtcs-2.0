'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/app/lib/supabase';
import TrainingCourseForm from '@/app/components/TrainingCourseForm';
import DataTable from '@/app/components/admin/DataTable';
import { logger } from '@/app/lib/logger';

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
  created_at?: string;
}

export default function NonTechnicalTrainingsAdmin() {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetch('/api/non-technical-trainings');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const result = await response.json();
      setCourses(result.data || []);
    } catch (error) {
      logger.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (courseData: TrainingCourse) => {
    setSaving(true);
    try {
      // Remove service_type field as it doesn't exist in non_technical_trainings table
      const { service_type, ...dataToSave } = courseData;

      if (editingCourse) {
        // Update existing course
        const response = await fetch('/api/non-technical-trainings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...dataToSave, id: editingCourse.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to update course');
        }
      } else {
        // Create new course
        const response = await fetch('/api/non-technical-trainings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSave),
        });

        if (!response.ok) {
          throw new Error('Failed to create course');
        }
      }

      await loadCourses();
      setShowForm(false);
      setEditingCourse(null);
    } catch (error) {
      logger.error('Error saving course:', error);
      alert('Error saving course');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course: TrainingCourse) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`/api/non-technical-trainings?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      await loadCourses();
    } catch (error) {
      logger.error('Error deleting course:', error);
      alert('Error deleting course');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Non-Technical Trainings</h1>
              <p className="text-gray-600">Manage management and soft skills development programs</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 lg:mt-0 bg-green-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm lg:text-base"
            >
              Add New Course
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
            <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <TrainingCourseForm
            initialData={editingCourse ? { ...editingCourse, service_type: 'non_technical_training' } : { service_type: 'non_technical_training' }}
            onSubmit={handleSave}
            onCancel={handleCancel}
            loading={saving}
            hideServiceType={true}
          />
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DataTable
          data={courses}
          columns={[
            {
              key: 'title',
              label: 'Title',
              sortable: true,
              render: (course: TrainingCourse) => (
                <div>
                  <div className="font-medium text-gray-900">{course.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1 mt-1">{course.description}</div>
                </div>
              )
            },
            {
              key: 'duration',
              label: 'Duration',
              sortable: true,
              render: (course: TrainingCourse) => (
                <span className="text-sm text-gray-700">{course.duration || 'Not specified'}</span>
              )
            },
            {
              key: 'price',
              label: 'Price',
              sortable: true,
              render: (course: TrainingCourse) => (
                <span className="text-sm text-gray-700">
                  {course.price ? `RM ${course.price}` : 'Not set'}
                </span>
              )
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              render: (course: TrainingCourse) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {course.status ? 'Active' : 'Inactive'}
                </span>
              )
            },
            {
              key: 'created_at',
              label: 'Created',
              sortable: true,
              render: (course: TrainingCourse) => (
                <span className="text-sm text-gray-500">
                  {course.created_at ? new Date(course.created_at).toLocaleDateString() : '-'}
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
          emptyMessage="No non-technical training courses found. Click 'Add New Course' to get started."
          actions={(course) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(course);
                }}
                className="text-green-600 hover:text-green-800 px-3 py-1 rounded border border-green-600 hover:bg-green-50 transition-colors text-xs"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(course.id || '');
                }}
                className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors text-xs"
              >
                Delete
              </button>
            </div>
          )}
          onRowClick={(course) => handleEdit(course)}
        />
        </motion.div>
      )}
    </div>
  );
} 
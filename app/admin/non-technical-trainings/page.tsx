'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TrainingCourseForm from '@/app/components/TrainingCourseForm';
import DataTable from '@/app/components/admin/DataTable';
import { AdminTablePageSkeleton } from '@/app/components/skeletons/PageSkeletons';
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
  brochure_url?: string;
  brochure_file_name?: string;
  next_event_start?: string | null;
  next_event_title?: string | null;
  linked_event_ids?: string[];
}

function formatCurrency(price: number | null) {
  if (price === null) return 'Quote based';
  return `RM ${price.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
      const dataToSave = { ...courseData };
      delete (dataToSave as Partial<TrainingCourse>).service_type;

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
    return <AdminTablePageSkeleton />;
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
            trainingTable="non_technical_trainings"
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
              label: 'Program',
              sortable: true,
              width: '42%',
              headerClassName: 'text-left',
              cellClassName: 'whitespace-normal break-words',
              render: (course: TrainingCourse) => (
                <div className="space-y-1">
                  <div className="font-semibold text-gray-900 leading-snug">{course.title}</div>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{course.description}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {course.target_audience && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Audience defined
                      </span>
                    )}
                    {course.certification && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        Certificate Available
                      </span>
                    )}
                  </div>
                </div>
              )
            },
            {
              key: 'duration',
              label: 'Schedule',
              sortable: true,
              width: '15%',
              headerClassName: 'text-left',
              cellClassName: 'whitespace-normal',
              render: (course: TrainingCourse) => (
                <span className="text-sm text-gray-700 leading-relaxed">{course.duration || 'Not specified'}</span>
              )
            },
            {
              key: 'price',
              label: 'Price',
              sortable: true,
              width: '12%',
              headerClassName: 'text-left',
              cellClassName: 'whitespace-nowrap',
              render: (course: TrainingCourse) => (
                <span className="text-sm font-medium text-gray-800">{formatCurrency(course.price)}</span>
              )
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              width: '10%',
              headerClassName: 'text-left',
              cellClassName: 'whitespace-nowrap',
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
              key: 'brochure_url',
              label: 'Brochure',
              sortable: false,
              width: '10%',
              headerClassName: 'text-left',
              cellClassName: 'whitespace-nowrap',
              render: (course: TrainingCourse) => (
                course.brochure_url ? (
                  <a
                    href={course.brochure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-xs"
                  >
                    PDF
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">None</span>
                )
              )
            },
            {
              key: 'next_event_start',
              label: 'Next Event',
              sortable: true,
              width: '10%',
              headerClassName: 'text-left',
              cellClassName: 'whitespace-normal',
              render: (course: TrainingCourse) => (
                course.next_event_start ? (
                  <div className="text-xs text-gray-700">
                    <div>{new Date(course.next_event_start).toLocaleDateString('en-GB')}</div>
                    {course.next_event_title ? (
                      <div className="text-gray-500 line-clamp-1">{course.next_event_title}</div>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Not linked</span>
                )
              )
            },
            {
              key: 'created_at',
              label: 'Created',
              sortable: true,
              width: '11%',
              headerClassName: 'text-left',
              cellClassName: 'whitespace-nowrap',
              render: (course: TrainingCourse) => (
                <div className="text-sm text-gray-500">
                  <div>{course.created_at ? new Date(course.created_at).toLocaleDateString('en-GB') : '-'}</div>
                  <div className="text-xs text-gray-400">
                    {course.created_at ? new Date(course.created_at).toLocaleTimeString('en-GB') : ''}
                  </div>
                </div>
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
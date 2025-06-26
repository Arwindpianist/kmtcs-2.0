'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import TrainingCourseForm from '@/app/components/TrainingCourseForm';

interface TrainingCourse {
  id: string;
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
  status: boolean;
  created_at: string;
}

export default function TechnicalTrainingsAdmin() {
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
      const { data, error } = await supabase
        .from('technical_trainings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (courseData: Omit<TrainingCourse, 'service_type'>) => {
    setSaving(true);
    try {
      if (editingCourse) {
        // Update existing course
        const { error } = await supabase
          .from('technical_trainings')
          .update(courseData)
          .eq('id', editingCourse.id);

        if (error) throw error;
      } else {
        // Create new course
        const { error } = await supabase
          .from('technical_trainings')
          .insert(courseData);

        if (error) throw error;
      }

      await loadCourses();
      setShowForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
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
      const { error } = await supabase
        .from('technical_trainings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Technical Trainings</h1>
          <p className="text-gray-600">Manage engineering and technical skill development programs</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Add New Course
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          <TrainingCourseForm
            initialData={editingCourse ? { ...editingCourse, service_type: 'technical_training' } : { service_type: 'technical_training' }}
            onSubmit={handleSave}
            onCancel={handleCancel}
            loading={saving}
            hideServiceType={true}
          />
        </div>
      ) : (
        <div className="grid gap-8">
          {courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No Technical Training Courses</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Get started by adding your first technical training course. This will help showcase your engineering and technical skill development programs.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Your First Course
                </button>
              </div>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{course.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <span className="font-medium">Duration:</span>
                        <span className="ml-2">{course.duration || 'Not specified'}</span>
                      </span>
                      {course.price && (
                        <span className="flex items-center">
                          <span className="font-medium">Price:</span>
                          <span className="ml-2">RM {course.price}</span>
                        </span>
                      )}
                      {course.hrdcorp_approval_no && (
                        <span className="flex items-center">
                          <span className="font-medium">HRDCorp:</span>
                          <span className="ml-2">{course.hrdcorp_approval_no}</span>
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-3 ml-6">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {course.objectives && course.objectives.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Objectives:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      {course.objectives.map((objective, index) => (
                        <li key={index} className="leading-relaxed">{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.target_audience && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Target Audience:</h4>
                    <p className="text-gray-600 leading-relaxed">{course.target_audience}</p>
                  </div>
                )}

                {course.methodology && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Methodology:</h4>
                    <p className="text-gray-600 leading-relaxed">{course.methodology}</p>
                  </div>
                )}

                {course.certification && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Certification:</h4>
                    <p className="text-gray-600 leading-relaxed">{course.certification}</p>
                  </div>
                )}

                {course.course_contents && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Course Contents:</h4>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {course.course_contents}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import AdminHeader from '@/app/components/AdminHeader';
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

  const handleSave = async (courseData: any) => {
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
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Technical Trainings</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Course
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <TrainingCourseForm
              initialData={editingCourse || undefined}
              onSubmit={handleSave}
              onCancel={handleCancel}
              loading={saving}
            />
          </div>
        ) : (
          <div className="grid gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{course.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Duration: {course.duration || 'Not specified'}</span>
                      {course.price && <span>Price: RM {course.price}</span>}
                      {course.hrdcorp_approval_no && (
                        <span>HRDCorp: {course.hrdcorp_approval_no}</span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {course.objectives && course.objectives.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Objectives:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {course.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.target_audience && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Target Audience:</h4>
                    <p className="text-sm text-gray-600">{course.target_audience}</p>
                  </div>
                )}

                {course.methodology && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Methodology:</h4>
                    <p className="text-sm text-gray-600">{course.methodology}</p>
                  </div>
                )}

                {course.certification && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Certification:</h4>
                    <p className="text-sm text-gray-600">{course.certification}</p>
                  </div>
                )}

                {course.course_contents && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Course Contents:</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {course.course_contents}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {courses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No technical training courses found.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Your First Course
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
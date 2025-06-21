'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import type { Metadata } from 'next';

interface NonTechnicalTraining {
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

export const metadata: Metadata = {
  title: 'Non-Technical Trainings - KMTCS',
  description: 'Professional development and soft skills training programs for organizational excellence.',
};

export default function NonTechnicalTrainingsPage() {
  const [trainings, setTrainings] = useState<NonTechnicalTraining[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      const { data, error } = await supabase
        .from('non_technical_trainings')
        .select('*')
        .eq('status', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrainings(data || []);
    } catch (error) {
      console.error('Error loading trainings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Non-Technical Training Programs
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Professional development and soft skills training to enhance workplace effectiveness and leadership
            </p>
          </div>
        </div>
      </div>

      {/* Trainings Grid */}
      <div className="container mx-auto px-4 py-16">
        {trainings.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {trainings.map((training) => (
              <div key={training.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {training.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {training.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {training.duration && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {training.duration}
                      </span>
                    )}
                    {training.price && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        RM {training.price}
                      </span>
                    )}
                    {training.hrdcorp_approval_no && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                        HRDCorp Approved
                      </span>
                    )}
                  </div>

                  {training.target_audience && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-1">Target Audience:</h4>
                      <p className="text-sm text-gray-600">{training.target_audience}</p>
                    </div>
                  )}

                  {training.objectives && training.objectives.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {training.objectives.slice(0, 3).map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {objective}
                          </li>
                        ))}
                        {training.objectives.length > 3 && (
                          <li className="text-green-600 text-sm">
                            +{training.objectives.length - 3} more objectives
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {training.methodology && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-1">Methodology:</h4>
                      <p className="text-sm text-gray-600">{training.methodology}</p>
                    </div>
                  )}

                  {training.certification && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-1">Certification:</h4>
                      <p className="text-sm text-gray-600">{training.certification}</p>
                    </div>
                  )}

                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No non-technical trainings available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for new non-technical training programs.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Develop Your Professional Skills?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us to learn more about our non-technical training programs and how they can benefit your team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/services"
              className="bg-gray-600 text-white px-8 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              View All Services
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 
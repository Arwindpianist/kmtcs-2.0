'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';

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
              <div key={training.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-2">{training.title}</h2>
                  <p className="text-gray-700 mb-4 flex-grow line-clamp-4">{training.description}</p>
                  <div className="mt-auto">
                    <Link href={`/services/non-technical-trainings/${training.id}`} className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Learn More
                    </Link>
                  </div>
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
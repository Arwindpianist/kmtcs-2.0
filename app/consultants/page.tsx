// app/consultants/page.tsx
'use client'; // This page is interactive, so it's a client component

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiX, FiAward, FiBookOpen, FiBriefcase, FiUser } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface Consultant {
  id: string;
  name: string;
  role: string;
  short_bio: string;
  full_bio: string;
  image_url: string | null;
  status: boolean;
  academic_qualifications?: string;
  professional_certifications?: string;
  career_experiences?: string;
}

// Main component for the Consultants page
export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchConsultants = async () => {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .eq('status', true)
        .order('name');
      
      if (error) {
        console.error('Error fetching consultants:', error);
      } else {
        setConsultants(data);
      }
      setLoading(false);
    };

    fetchConsultants();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Our Expert Consultants</h1>
            <p className="mt-4 text-xl text-slate-200">
              Meet our team of highly qualified professionals dedicated to your success.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultants.map(consultant => (
              <ConsultantCard 
                key={consultant.id}
                consultant={consultant}
                onSelect={() => setSelectedConsultant(consultant)}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedConsultant && (
          <ConsultantModal 
            consultant={selectedConsultant}
            onClose={() => setSelectedConsultant(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Card component for a single consultant
function ConsultantCard({ consultant, onSelect }: { consultant: Consultant; onSelect: () => void; }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
      onClick={onSelect}
      whileHover={{ y: -5 }}
    >
      <div className="relative w-32 h-32 mx-auto mb-6">
        <Image
          src={consultant.image_url || '/testimonials/user-stroke-rounded.svg'}
          alt={consultant.name}
          fill
          className="rounded-full object-cover border-4 border-blue-100 shadow-md"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{consultant.name}</h3>
      <p className="text-blue-600 font-semibold text-lg mb-3">{consultant.role}</p>
      <p className="text-gray-600 text-sm leading-relaxed">{consultant.short_bio}</p>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          View Full Profile →
        </button>
      </div>
    </motion.div>
  );
}

// Modal component for detailed view
function ConsultantModal({ consultant, onClose }: { consultant: Consultant; onClose: () => void; }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={consultant.image_url || '/testimonials/user-stroke-rounded.svg'}
                  alt={consultant.name}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{consultant.name}</h2>
                <p className="text-blue-100 text-xl font-semibold">{consultant.role}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-blue-100 hover:text-white transition-colors p-2"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Academic Qualifications */}
          {consultant.academic_qualifications && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FiBookOpen className="text-blue-600 mr-3 text-xl" />
                <h3 className="text-xl font-bold text-gray-900">ACADEMIC QUALIFICATION:</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {consultant.academic_qualifications}
                </p>
              </div>
            </div>
          )}

          {/* Professional Certifications */}
          {consultant.professional_certifications && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FiAward className="text-blue-600 mr-3 text-xl" />
                <h3 className="text-xl font-bold text-gray-900">PROFESSIONAL CERTIFICATION:</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {consultant.professional_certifications}
                </p>
              </div>
            </div>
          )}

          {/* Brief Biodata */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FiUser className="text-blue-600 mr-3 text-xl" />
              <h3 className="text-xl font-bold text-gray-900">BRIEF BIODATA:</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {consultant.full_bio}
              </p>
            </div>
          </div>

          {/* Career Experiences */}
          {consultant.career_experiences && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FiBriefcase className="text-blue-600 mr-3 text-xl" />
                <h3 className="text-xl font-bold text-gray-900">CAREER EXPERIENCES:</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {consultant.career_experiences}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
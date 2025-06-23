// app/consultants/page.tsx
'use client'; // This page is interactive, so it's a client component

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiX } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface Consultant {
  id: string;
  name: string;
  role: string;
  short_bio: string;
  full_bio: string;
  image_url: string | null;
  status: boolean;
  email: string | null;
  phone: string | null;
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
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Our Expert Consultants</h1>
            <p className="mt-4 text-xl text-slate-200">
              Our team of experienced professionals is dedicated to your success.
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
      className="bg-gray-50 rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onSelect}
      whileHover={{ y: -5 }}
    >
      <div className="relative w-32 h-32 mx-auto mb-4">
        <Image
          src={consultant.image_url || '/testimonials/user-stroke-rounded.svg'}
          alt={consultant.name}
          fill
          className="rounded-full object-cover border-4 border-white"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{consultant.name}</h3>
      <p className="text-blue-600 font-semibold">{consultant.role}</p>
      <p className="text-gray-600 mt-2 text-sm">{consultant.short_bio}</p>
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
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <FiX size={24} />
        </button>
        <div className="flex flex-col md:flex-row items-center text-center md:text-left">
          <div className="relative w-40 h-40 md:mr-8 mb-6 md:mb-0 flex-shrink-0">
            <Image
              src={consultant.image_url || '/testimonials/user-stroke-rounded.svg'}
              alt={consultant.name}
              fill
              className="rounded-full object-cover border-4 border-blue-200"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{consultant.name}</h2>
            <p className="text-blue-600 text-lg font-semibold">{consultant.role}</p>
            <div className="flex justify-center md:justify-start space-x-4 mt-4 text-gray-600">
              {consultant.email && (
                <a href={`mailto:${consultant.email}`} className="flex items-center hover:text-blue-600">
                  <FiMail className="mr-2" /> Email
                </a>
              )}
              {consultant.phone && (
                <a href={`tel:${consultant.phone}`} className="flex items-center hover:text-blue-600">
                  <FiPhone className="mr-2" /> Call
                </a>
              )}
            </div>
          </div>
        </div>
        <div 
          className="prose max-w-none mt-8 pt-8 border-t border-gray-200"
          dangerouslySetInnerHTML={{ __html: consultant.full_bio.replace(/\n/g, '<br />') }} 
        />
      </motion.div>
    </motion.div>
  );
}
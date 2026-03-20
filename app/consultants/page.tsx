// app/consultants/page.tsx
'use client'; // This page is interactive, so it's a client component

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiX, FiAward, FiBookOpen, FiBriefcase, FiUser } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { logger } from '@/app/lib/logger';

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
        logger.error('Error fetching consultants:', error);
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
    <Card
      className="text-center cursor-pointer hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      onClick={onSelect}
    >
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex-grow flex flex-col">
          <motion.div
            whileHover={{ y: -5 }}
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image
                src={consultant.image_url || '/default-avatar.svg'}
                alt={consultant.name}
                fill
                className="rounded-full object-cover border-4 border-primary/20 shadow-md"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.svg';
                }}
              />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{consultant.name}</h3>
            <p className="text-primary font-semibold text-lg mb-3">{consultant.role}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{consultant.short_bio}</p>
          </motion.div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="link" className="text-primary font-medium text-sm p-0">
              View Full Profile →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Modal component for detailed view
function ConsultantModal({ consultant, onClose }: { consultant: Consultant; onClose: () => void; }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Card
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 lg:p-8 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={consultant.image_url || '/default-avatar.svg'}
                  alt={consultant.name}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.svg';
                  }}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{consultant.name}</h2>
                <p className="text-blue-100 text-xl font-semibold">{consultant.role}</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-white/20"
            >
              <FiX size={24} />
            </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
          {/* Academic Qualifications */}
          {consultant.academic_qualifications && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
            <div className="mb-8">
              <div className="flex items-center mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <FiBookOpen className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-foreground">ACADEMIC QUALIFICATION</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                  {consultant.academic_qualifications}
                </p>
              </div>
            </div>
            </motion.div>
          )}

          {/* Professional Certifications */}
          {consultant.professional_certifications && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
            <div className="mb-8">
              <div className="flex items-center mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <FiAward className="text-purple-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-foreground">PROFESSIONAL CERTIFICATION</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                  {consultant.professional_certifications}
                </p>
              </div>
            </div>
            </motion.div>
          )}

          {/* Brief Biodata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="mb-8">
            <div className="flex items-center mb-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border-l-4 border-indigo-500">
              <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                <FiUser className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-foreground">BRIEF BIODATA</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                {consultant.full_bio}
              </p>
            </div>
            </div>
          </motion.div>

          {/* Career Experiences */}
          {consultant.career_experiences && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
            <div className="mb-8">
              <div className="flex items-center mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <FiBriefcase className="text-green-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-foreground">CAREER EXPERIENCES</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                  {consultant.career_experiences}
                </p>
              </div>
            </div>
            </motion.div>
          )}
        </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
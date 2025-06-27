// app/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FilterButtons from '@/app/components/FilterButtons';
import BackgroundLines from '../components/BackgroundLines';

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
  service_type: 'technical_training' | 'non_technical_training';
  image_url?: string;
  category?: string;
}

interface ConsultingService {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number | null;
  objectives: string[];
  service_contents: string;
  target_audience: string;
  methodology: string;
  deliverables: string;
  status: boolean;
  created_at: string;
  image_url?: string;
  category?: string;
}

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type');
  const [technicalTrainings, setTechnicalTrainings] = useState<TrainingCourse[]>([]);
  const [nonTechnicalTrainings, setNonTechnicalTrainings] = useState<TrainingCourse[]>([]);
  const [consultingServices, setConsultingServices] = useState<ConsultingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch technical trainings
        const technicalResponse = await fetch('/api/technical-trainings?status=true');
        if (!technicalResponse.ok) {
          throw new Error('Failed to fetch technical trainings');
        }
        const technicalResult = await technicalResponse.json();
        const technicalData = technicalResult.data || [];

        // Fetch non-technical trainings
        const nonTechnicalResponse = await fetch('/api/non-technical-trainings?status=true');
        if (!nonTechnicalResponse.ok) {
          throw new Error('Failed to fetch non-technical trainings');
        }
        const nonTechnicalResult = await nonTechnicalResponse.json();
        const nonTechnicalData = nonTechnicalResult.data || [];

        // Fetch consulting services
        const consultingResponse = await fetch('/api/consulting-services?status=true');
        if (!consultingResponse.ok) {
          throw new Error('Failed to fetch consulting services');
        }
        const consultingResult = await consultingResponse.json();
        const consultingData = consultingResult.data || [];

        // Add category field to each service type
        const technicalWithCategory = technicalData.map((item: any) => ({
          ...item,
          category: 'Technical Training',
          image_url: item.image_url || null
        }));
        
        const nonTechnicalWithCategory = nonTechnicalData.map((item: any) => ({
          ...item,
          category: 'Non-Technical Training',
          image_url: item.image_url || null
        }));
        
        const consultingWithCategory = (consultingData || []).map((item: any) => ({
          ...item,
          category: 'Consulting',
          image_url: item.image_url || null
        }));

        setTechnicalTrainings(technicalWithCategory);
        setNonTechnicalTrainings(nonTechnicalWithCategory);
        setConsultingServices(consultingWithCategory);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filterData = (data: any[], searchTerm: string) => {
    if (!searchTerm) return data;
    return data.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'engineering':
        return 'bg-blue-100 text-blue-800';
      case 'management':
        return 'bg-green-100 text-green-800';
      case 'it':
        return 'bg-purple-100 text-purple-800';
      case 'consulting':
        return 'bg-orange-100 text-orange-800';
      case 'technical training':
        return 'bg-blue-100 text-blue-800';
      case 'non-technical training':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const filteredTechnical = filterData(technicalTrainings, searchTerm);
  const filteredNonTechnical = filterData(nonTechnicalTrainings, searchTerm);
  const filteredConsulting = filterData(consultingServices, searchTerm);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our comprehensive range of training and consulting services designed to elevate your organization's capabilities
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Technical Trainings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Trainings</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Specialized technical training programs designed to enhance your team's technical expertise and capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTechnical.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/services/technical-trainings/${course.id}`}>
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          Technical Training
                        </span>
                        {course.price && (
                          <span className="text-lg font-bold text-blue-600">
                            RM {course.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {course.duration && (
                          <span className="text-sm text-gray-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.duration}
                          </span>
                        )}
                        <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                          Learn More →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {filteredTechnical.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No technical trainings available.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Non-Technical Trainings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Non-Technical Trainings</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional development and soft skills training to enhance leadership, communication, and organizational effectiveness
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNonTechnical.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/services/non-technical-trainings/${course.id}`}>
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          Non-Technical Training
                        </span>
                        {course.price && (
                          <span className="text-lg font-bold text-blue-600">
                            RM {course.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {course.duration && (
                          <span className="text-sm text-gray-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.duration}
                          </span>
                        )}
                        <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                          Learn More →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {filteredNonTechnical.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No non-technical trainings available.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Consulting Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Consulting Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Expert consulting solutions to help your organization optimize processes, improve efficiency, and achieve strategic goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredConsulting.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/services/consulting/${service.id}`}>
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          Consulting
                        </span>
                        {service.price && (
                          <span className="text-lg font-bold text-blue-600">
                            RM {service.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {service.duration && (
                          <span className="text-sm text-gray-500 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {service.duration}
                          </span>
                        )}
                        <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                          Learn More →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {filteredConsulting.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No consulting services available.</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
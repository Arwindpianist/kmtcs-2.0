// app/services/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';
import FilterButtons from '@/app/components/FilterButtons';
import BackgroundLines from '../components/BackgroundLines';
import ServicesOverview from '@/app/components/ServicesOverview';

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
        const { data: technicalData, error: technicalError } = await supabase
          .from('technical_trainings')
          .select('*')
          .eq('status', true)
          .order('created_at', { ascending: false });
        
        if (technicalError) throw technicalError;

        // Fetch non-technical trainings
        const { data: nonTechnicalData, error: nonTechnicalError } = await supabase
          .from('non_technical_trainings')
          .select('*')
          .eq('status', true)
          .order('created_at', { ascending: false });
        
        if (nonTechnicalError) throw nonTechnicalError;

        // Fetch consulting services
        const { data: consultingData, error: consultingError } = await supabase
          .from('consulting_services')
          .select('*')
          .eq('status', true)
          .order('created_at', { ascending: false });
        
        if (consultingError) throw consultingError;

        setTechnicalTrainings(technicalData || []);
        setNonTechnicalTrainings(nonTechnicalData || []);
        setConsultingServices(consultingData || []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
      </div>
    );
  }

  const filteredTechnical = filterData(technicalTrainings, searchTerm);
  const filteredNonTechnical = filterData(nonTechnicalTrainings, searchTerm);
  const filteredConsulting = filterData(consultingServices, searchTerm);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Our Services</h1>
      
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Technical Trainings */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Technical Trainings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnical.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <p className="text-sm text-gray-500 mb-2">Duration: {course.duration || 'Not specified'}</p>
              {course.price && (
                <p className="text-sm text-gray-500 mb-2">Price: RM {course.price}</p>
              )}
              {course.hrdcorp_approval_no && (
                <p className="text-sm text-gray-500 mb-2">HRDCorp: {course.hrdcorp_approval_no}</p>
              )}
              <Link href={`/services/technical-trainings/${course.id}`} className="text-blue-700 hover:underline">View Details</Link>
            </div>
          ))}
          {filteredTechnical.length === 0 && (
            <p className="text-gray-500 col-span-full">No technical trainings available.</p>
          )}
        </div>
      </div>

      {/* Non-Technical Trainings */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Non-Technical Trainings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNonTechnical.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <p className="text-sm text-gray-500 mb-2">Duration: {course.duration || 'Not specified'}</p>
              {course.price && (
                <p className="text-sm text-gray-500 mb-2">Price: RM {course.price}</p>
              )}
              {course.hrdcorp_approval_no && (
                <p className="text-sm text-gray-500 mb-2">HRDCorp: {course.hrdcorp_approval_no}</p>
              )}
              <Link href={`/services/non-technical-trainings/${course.id}`} className="text-blue-700 hover:underline">View Details</Link>
            </div>
          ))}
          {filteredNonTechnical.length === 0 && (
            <p className="text-gray-500 col-span-full">No non-technical trainings available.</p>
          )}
        </div>
      </div>

      {/* Consulting Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Consulting Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsulting.map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-2">{service.description}</p>
              <p className="text-sm text-gray-500 mb-2">Duration: {service.duration || 'Not specified'}</p>
              {service.price && (
                <p className="text-sm text-gray-500 mb-2">Price: RM {service.price}</p>
              )}
              <Link href={`/services/consulting/${service.id}`} className="text-blue-700 hover:underline">View Details</Link>
            </div>
          ))}
          {filteredConsulting.length === 0 && (
            <p className="text-gray-500 col-span-full">No consulting services available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
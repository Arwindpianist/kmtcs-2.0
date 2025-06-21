import { supabase } from '@/app/lib/supabase';
import ServiceCard from '@/app/components/ServiceCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Trainings - KMTCS',
  description: 'Professional technical training programs for industrial and process operations.',
};

export default async function TechnicalTrainingsPage() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('type', 'technical_training')
    .order('title');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Technical Trainings
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive technical training programs designed to enhance your team's expertise 
            in industrial operations, process control, and engineering principles.
          </p>
        </div>

        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No technical training programs available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 
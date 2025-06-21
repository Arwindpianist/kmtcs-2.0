import { supabase } from '@/app/lib/supabase';
import ServiceCard from '@/app/components/ServiceCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Consulting Services - KMTCS',
  description: 'Expert consulting services for industrial operations, process optimization, and business transformation.',
};

export default async function ConsultingPage() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('type', 'consulting')
    .order('title');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Consulting Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert consulting solutions to optimize your operations, enhance efficiency, 
            and drive sustainable business growth through industry best practices.
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
              No consulting services available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 
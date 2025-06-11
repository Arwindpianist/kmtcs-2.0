// app/services/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Service } from '@/app/types/service';
import { getServices } from '@/app/services/supabaseService';
import FilterButtons from '@/app/components/FilterButtons';
import BackgroundLines from '../components/BackgroundLines';
import ServicesOverview from '@/app/components/ServicesOverview';

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type') as Service['service_type'] | null;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        // Only show active services
        setServices(data.filter(service => service.status));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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

  return <ServicesOverview />;
}
// app/services/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Service } from '@/app/types/service';
import { getServices } from '@/app/services/supabaseService';
import { supabase } from '@/app/lib/supabase';
import FilterButtons from '@/app/components/FilterButtons';
import BackgroundLines from '../components/BackgroundLines';
import ServicesOverview from '@/app/components/ServicesOverview';

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type') as Service['service_type'] | null;
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getServices();
        setServices(data.filter(service => service.status));
        // Fetch events from training_events
        const { data: eventsData, error: eventsError } = await supabase
          .from('training_events')
          .select('*')
          .order('start_date', { ascending: true });
        if (eventsError) throw eventsError;
        setEvents(eventsData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Our Services</h1>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Technical Trainings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => s.service_type === 'technical').map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-2">{service.short_description}</p>
              <p className="text-sm text-gray-500 mb-2">Duration: {service.duration}</p>
              <Link href={`/services/${service.id}`} className="text-blue-700 hover:underline">View Details</Link>
            </div>
          ))}
          {services.filter(s => s.service_type === 'technical').length === 0 && (
            <p className="text-gray-500 col-span-full">No technical trainings available.</p>
          )}
        </div>
      </div>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Non-Technical Trainings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => s.service_type === 'non-technical').map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-2">{service.short_description}</p>
              <p className="text-sm text-gray-500 mb-2">Duration: {service.duration}</p>
              <Link href={`/services/${service.id}`} className="text-blue-700 hover:underline">View Details</Link>
            </div>
          ))}
          {services.filter(s => s.service_type === 'non-technical').length === 0 && (
            <p className="text-gray-500 col-span-full">No non-technical trainings available.</p>
          )}
        </div>
      </div>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Consulting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => s.service_type === 'consulting').map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-2">{service.short_description}</p>
              <p className="text-sm text-gray-500 mb-2">Duration: {service.duration}</p>
              <Link href={`/services/${service.id}`} className="text-blue-700 hover:underline">View Details</Link>
            </div>
          ))}
          {services.filter(s => s.service_type === 'consulting').length === 0 && (
            <p className="text-gray-500 col-span-full">No consulting services available.</p>
          )}
        </div>
      </div>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.description}</p>
              <p className="text-sm text-gray-500 mb-2">Start: {event.start_date ? new Date(event.start_date).toLocaleDateString() : ''}</p>
              <p className="text-sm text-gray-500 mb-2">End: {event.end_date ? new Date(event.end_date).toLocaleDateString() : ''}</p>
              <Link href={`/admin/events`} className="text-blue-700 hover:underline">View Event</Link>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-gray-500 col-span-full">No events available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
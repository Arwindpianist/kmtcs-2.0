import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Training Events - KMTCS',
  description: 'Upcoming training events, workshops, and professional development opportunities.',
};

export default async function EventsPage() {
  const { data: events } = await supabase
    .from('training_events')
    .select('*')
    .order('start_date', { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Training Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover upcoming training events, workshops, and professional development 
            opportunities designed to enhance your skills and advance your career.
          </p>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Start:</span> {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'TBD'}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">End:</span> {event.end_date ? new Date(event.end_date).toLocaleDateString() : 'TBD'}
                  </p>
                  {event.location && (
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Location:</span> {event.location}
                    </p>
                  )}
                </div>
                <Link
                  href={`/admin/events`}
                  className="w-full text-center text-blue-700 bg-blue-800/30 backdrop-filter backdrop-blur-lg border border-baby-blue/20 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-800 hover:text-white hover:border-blue/40 transition-all duration-300 inline-block relative z-50 shadow-md hover:shadow-lg"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No training events available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 
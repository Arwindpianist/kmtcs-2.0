// app/components/TrainingCalendar.tsx
'use client';

import { FiCalendar } from 'react-icons/fi';
import Link from 'next/link';

const TrainingCalendar = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 text-center">
        <FiCalendar className="text-5xl text-blue-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Training Calendar
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Stay updated with our upcoming training sessions and events. Contact us to schedule custom training programs for your organization.
        </p>
        <Link 
          href="/contact"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
        >
          Schedule Training
        </Link>
      </div>
    </section>
  );
};

export default TrainingCalendar;

// app/components/TrainingCalendar.tsx
'use client';

import { FiCalendar, FiMail } from 'react-icons/fi';

const TrainingCalendar = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <FiCalendar className="text-5xl text-blue-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Upcoming Trainings</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Our training calendar will be available soon. For now, please contact us for more information about our training schedules.
        </p>
        <a 
          href="mailto:info@kmtcs.com.my"
          className="inline-flex items-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <FiMail className="mr-2" />
          Inquire Now
        </a>
      </div>
    </section>
  );
};

export default TrainingCalendar;

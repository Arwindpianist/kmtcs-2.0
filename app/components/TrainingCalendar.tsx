// app/components/TrainingCalendar.tsx
'use client';

import { FaCalendarAlt } from 'react-icons/fa';

const TrainingCalendar = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col justify-center items-center px-4">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Upcoming Trainings</h2>
        
        <div className="flex justify-center mb-8">
          <button
            disabled
            className="group flex items-center space-x-2 px-6 py-3 bg-gray-400 text-white rounded-full 
              cursor-not-allowed opacity-75"
            title="Training calendar integration coming soon"
          >
            <FaCalendarAlt className="text-xl" />
            <span>View Training Calendar</span>
          </button>
        </div>

        <p className="text-lg text-blue-800">
          Our training calendar will be available soon. For now, please contact us at{' '}
          <a href="mailto:info@kmtcs.com.my" className="text-blue-600 hover:underline">
            info@kmtcs.com.my
          </a>{' '}
          or call us at{' '}
          <a href="tel:+6010-2175360" className="text-blue-600 hover:underline">
            +6010-217 5360
          </a>{' '}
          to inquire about our training schedules.
        </p>
      </div>
    </div>
  );
};

export default TrainingCalendar;

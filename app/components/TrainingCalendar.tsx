// app/components/TrainingCalendar.tsx
'use client';

import { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const TrainingCalendar = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="w-full h-full bg-white flex flex-col justify-center items-center px-4">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Upcoming Trainings</h2>
        
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="group flex items-center space-x-2 px-6 py-3 bg-blue-900 text-white rounded-full 
              hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 
              animate-bounce hover:animate-none"
          >
            <FaCalendarAlt className="text-xl group-hover:animate-wiggle" />
            <span>View Training Calendar</span>
          </button>
        </div>

        {showCalendar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] relative">
              <button
                onClick={() => setShowCalendar(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <iframe
                src="https://calendar.google.com/calendar/embed?src=info%40kmtcs.com.my&ctz=Asia%2FKuala_Lumpur"
                style={{ border: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingCalendar;

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiPaperclip, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  all_day: boolean;
  recurrence?: string;
  created_time: string;
  modified_time: string;
}

interface DayData {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const response = await fetch(`/api/calendar-events?start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data.events || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date): DayData[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: DayData[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate.toDateString() === currentDate.toDateString();
      });
      
      days.push({
        date: currentDate,
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === today.toDateString(),
        events: dayEvents
      });
    }
    
    return days;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const days = getDaysInMonth(currentDate);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 mb-4">
          <FiCalendar className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Calendar Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchEvents}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[120px] p-2 border-r border-b border-gray-100 ${
              !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
            } ${day.isToday ? 'bg-blue-50 border-blue-200' : ''}`}
          >
            <div className={`text-sm font-medium mb-1 ${
              !day.isCurrentMonth ? 'text-gray-400' : 
              day.isToday ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {day.day}
            </div>
            
            <div className="space-y-1">
              {day.events.slice(0, 2).map(event => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedEvent(event)}
                  className="text-xs p-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200 transition-colors truncate"
                  title={event.title}
                >
                  {event.title}
                </motion.div>
              ))}
              {day.events.length > 2 && (
                <div className="text-xs text-gray-500 text-center">
                  +{day.events.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(selectedEvent.start_time)}</span>
                  </div>

                  {!selectedEvent.all_day && (
                    <div className="flex items-center text-gray-600">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span>
                        {formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}
                      </span>
                    </div>
                  )}

                  {selectedEvent.location && (
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-2" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}

                  {selectedEvent.description && (
                    <div className="text-gray-700">
                      <p className="whitespace-pre-wrap">{selectedEvent.description}</p>
                    </div>
                  )}

                  {selectedEvent.attachments && selectedEvent.attachments.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <FiPaperclip className="w-4 h-4 mr-2" />
                        Attachments
                      </h4>
                      <div className="space-y-2">
                        {selectedEvent.attachments.map((attachment, index) => (
                          <a
                            key={index}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-blue-600"
                          >
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
} 
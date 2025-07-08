'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiPaperclip, FiX, FiChevronLeft, FiChevronRight, FiInfo } from 'react-icons/fi';

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

  // Sample events for testing when no real events are available
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Technical Training: React Development',
      description: 'Comprehensive React.js training covering hooks, context, and modern patterns.',
      start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
      location: 'KMTCS Training Center, Kuala Lumpur',
      all_day: false,
      attachments: [
        { name: 'Course Outline.pdf', url: '#', size: 1024 },
        { name: 'Prerequisites.docx', url: '#', size: 512 }
      ],
      created_time: new Date().toISOString(),
      modified_time: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Non-Technical: Leadership Skills',
      description: 'Develop essential leadership and management skills for the modern workplace.',
      start_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 hours later
      location: 'Virtual Training Session',
      all_day: false,
      attachments: [
        { name: 'Leadership Workbook.pdf', url: '#', size: 2048 }
      ],
      created_time: new Date().toISOString(),
      modified_time: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Consulting: Digital Transformation',
      description: 'Expert consultation on digital transformation strategies for your organization.',
      start_time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
      end_time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
      location: 'Client Office',
      all_day: false,
      attachments: [],
      created_time: new Date().toISOString(),
      modified_time: new Date().toISOString()
    },
    {
      id: '4',
      title: 'All-Day Workshop: Project Management',
      description: 'Full-day intensive workshop on project management methodologies and tools.',
      start_time: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
      end_time: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
      location: 'KMTCS Training Center, Kuala Lumpur',
      all_day: true,
      attachments: [
        { name: 'PMBOK Guide.pdf', url: '#', size: 3072 },
        { name: 'Project Templates.zip', url: '#', size: 1536 }
      ],
      created_time: new Date().toISOString(),
      modified_time: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching calendar events...');
      
      // Fetch all events since Zoho API doesn't support date filtering
      const response = await fetch('/api/calendar-events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      console.log('Calendar events response:', data);
      
      // Use sample events if no real events are available
      if (data.events && data.events.length > 0) {
        console.log('Using real events:', data.events.length);
        setEvents(data.events);
      } else {
        console.log('Using sample events - no real events found');
        setEvents(sampleEvents);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load calendar events');
      // Use sample events as fallback
      console.log('Using sample events as fallback due to error');
      setEvents(sampleEvents);
    } finally {
      console.log('Setting loading to false, total events:', events.length);
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
        const currentDateString = currentDate.toDateString();
        const eventDateString = eventDate.toDateString();
        
        return eventDateString === currentDateString;
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
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          
          <h2 className="text-3xl font-bold">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {daysOfWeek.map(day => (
          <div key={day} className="p-2 md:p-4 text-center text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[100px] md:min-h-[140px] p-2 md:p-3 border-r border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              !day.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'
            } ${day.isToday ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200' : ''}`}
          >
            <div className={`text-xs md:text-sm font-semibold mb-1 md:mb-2 ${
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
                  className="text-xs p-1 md:p-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-lg cursor-pointer hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 border border-blue-200/50 shadow-sm hover:shadow-md"
                  title={event.title}
                >
                  <div className="font-medium truncate text-xs">{event.title}</div>
                  {!event.all_day && (
                    <div className="text-blue-600 text-xs mt-1 hidden md:block">
                      {formatTime(event.start_time)}
                    </div>
                  )}
                </motion.div>
              ))}
              {day.events.length > 2 && (
                <div className="text-xs text-gray-500 text-center p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors cursor-pointer">
                  +{day.events.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sample Events Notice */}
      {events.length > 0 && events[0]?.id === '1' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 p-4">
          <div className="flex items-center text-blue-800">
            <FiInfo className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium">
              Showing sample events for demonstration. Connect your Zoho Calendar to see real events.
            </span>
          </div>
        </div>
      )}



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
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
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
                            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-blue-600 border border-gray-200"
                          >
                            <div className="font-medium">{attachment.name}</div>
                            <div className="text-gray-500 text-xs">
                              {(attachment.size / 1024).toFixed(1)} KB
                            </div>
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
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
} 
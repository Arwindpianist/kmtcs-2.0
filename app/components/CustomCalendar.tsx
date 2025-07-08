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
  eventSpans?: { [eventId: string]: { startDay: number, endDay: number, span: number } };
}

export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Add state for day event modal
  const [dayModal, setDayModal] = useState<{date: Date, events: CalendarEvent[]} | null>(null);

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

  // Utility to get all dates between two dates (inclusive)
  function getDatesBetween(start: Date, end: Date) {
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  const getDaysInMonth = (date: Date): DayData[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: DayData[] = [];
    const today = new Date();
    
    // Create a map of events for each day - only assign events to their start day
    const dayEventMap: { [dayIndex: number]: CalendarEvent[] } = {};
    const eventSpans: { [eventId: string]: { startDay: number, endDay: number, span: number } } = {};
    
    events.forEach(event => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      
      // Find the grid positions for the start and end dates of this event
      let startGridDay = -1;
      let endGridDay = -1;
      
      for (let i = 0; i < 42; i++) {
        const gridDate = new Date(startDate);
        gridDate.setDate(startDate.getDate() + i);
        
        if (isSameDate(gridDate, start)) {
          startGridDay = i;
        }
        if (isSameDate(gridDate, end)) {
          endGridDay = i;
        }
      }
      
      // If we found the start day, assign the event only to the start day
      if (startGridDay !== -1) {
        // Calculate the actual number of days the event spans (end exclusive)
        const actualDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const span = endGridDay !== -1 ? endGridDay - startGridDay + 1 : 1;
        eventSpans[event.id] = { startDay: startGridDay, endDay: endGridDay !== -1 ? endGridDay : startGridDay, span: actualDays };
        
        console.log(`Event "${event.title}" span calculation:`, {
          start: start.toDateString(),
          end: end.toDateString(),
          startGridDay,
          endGridDay,
          gridSpan: span,
          actualDays: actualDays,
          daysList: Array.from({length: actualDays}, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d.toDateString();
          })
        });
        
        // Only assign event to the start day
        if (!dayEventMap[startGridDay]) {
          dayEventMap[startGridDay] = [];
        }
        dayEventMap[startGridDay].push(event);
      }
    });

    console.log('Events being processed:', events.length);
    console.log('Days with events:', Object.keys(dayEventMap).length);

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayEvents = dayEventMap[i] || [];
      const isToday = currentDate.toDateString() === today.toDateString();
      
      if (dayEvents.length > 0) {
        console.log(`Day ${i} (${currentDate.toDateString()}) has ${dayEvents.length} events:`, dayEvents.map(e => e.title));
      }
      
      if (isToday) {
        console.log(`Today is day ${i} (${currentDate.toDateString()}) with ${dayEvents.length} events`);
      }
      
      days.push({
        date: currentDate,
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday,
        events: dayEvents,
        eventSpans
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

  // Helper function to compare dates without time components
  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
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
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 md:p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-2 md:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105"
            aria-label="Previous month"
          >
            <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-xl md:text-3xl font-bold text-center">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToToday}
              className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs md:text-sm font-medium transition-colors"
            >
              Today
            </button>
          </div>
          
          <button
            onClick={nextMonth}
            className="p-2 md:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105"
            aria-label="Next month"
          >
            <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
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
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px] p-1 sm:p-2 md:p-3 border-r border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
              !day.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'
            } ${day.isToday ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200' : ''}`}
            style={{ position: 'relative' }}
            onClick={() => {
              if (day.events.length > 0) {
                setDayModal({ date: day.date, events: day.events });
              }
            }}
          >
            <div className={`text-xs md:text-sm font-semibold mb-2 md:mb-3 ${
              !day.isCurrentMonth ? 'text-gray-400' : 
              day.isToday ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {day.day}
              {day.events.length > 0 && (
                <div className={`w-2 h-2 rounded-full mt-1 mx-auto ${
                  day.isToday ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
              )}
            </div>
            
            {/* Events Container */}
            <div className="space-y-1 relative">
              {day.events.slice(0, 2).map((event, idx) => {
                const eventStart = new Date(event.start_time);
                const eventEnd = new Date(event.end_time);
                const isMultiDay = eventStart.toDateString() !== eventEnd.toDateString();
                const isTodayEvent = day.isToday;
                const isEventStartDay = isSameDate(day.date, eventStart);
                const isEventEndDay = isSameDate(day.date, eventEnd);
                const eventSpan = day.eventSpans?.[event.id];
                
                return (
                  <div
                    key={event.id + '-' + idx}
                    className={`border rounded px-2 py-2 cursor-pointer transition-colors text-sm ${
                      isTodayEvent || (isMultiDay && day.date >= eventStart && day.date <= eventEnd)
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400 hover:from-green-200 hover:to-emerald-200 shadow-sm'
                        : 'bg-blue-100 border-blue-300 hover:bg-blue-200'
                    }`}
                    style={{
                      borderRadius: isMultiDay ? 
                        (isEventStartDay ? '8px 0 0 8px' : isEventEndDay ? '0 8px 8px 0' : '0') : 
                        '8px',
                      gridColumn: eventSpan && isMultiDay ? `span ${Math.min(eventSpan.span, 7)}` : 'span 1',
                      width: eventSpan && isMultiDay ? `calc(${Math.min(eventSpan.span, 7)}00% + ${(Math.min(eventSpan.span, 7) - 1) * 4}px)` : '100%',
                      position: eventSpan && isMultiDay ? 'absolute' : 'relative',
                      left: eventSpan && isMultiDay ? '0' : 'auto',
                      right: eventSpan && isMultiDay ? '0' : 'auto',
                      zIndex: eventSpan && isMultiDay ? 10 : 1,
                    }}
                    title={`${event.title}${isMultiDay ? ` (${eventSpan?.span || 1} days)` : ''}${isTodayEvent ? ' (Today)' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                  >
                    <div className={`font-medium leading-tight ${
                      isTodayEvent || (isMultiDay && day.date >= eventStart && day.date <= eventEnd) ? 'text-green-800' : 'text-blue-800'
                    }`}>
                      {isEventStartDay ? (
                        <div>
                          <div className="font-semibold text-xs md:text-sm">
                            {event.title.split(':')[0]}
                          </div>
                          {isMultiDay && (
                            <div className={`text-xs mt-1 ${
                              isTodayEvent || (isMultiDay && day.date >= eventStart && day.date <= eventEnd) ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {eventSpan?.span || 1} day{(eventSpan?.span || 1) !== 1 ? 's' : ''}
                            </div>
                          )}
                          {!event.all_day && (
                            <div className="text-xs text-gray-600 mt-1">
                              {formatTime(event.start_time)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          ...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Show indicator for additional events */}
              {day.events.length > 2 && (
                <div 
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition-colors text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDayModal({ date: day.date, events: day.events });
                  }}
                >
                  +{day.events.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-6 mt-6 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-green-200 border border-green-400"></span>
          <span className="text-sm text-gray-700">Ongoing</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-blue-200 border border-blue-400"></span>
          <span className="text-sm text-gray-700">Upcoming</span>
        </div>
      </div>


      {/* Sample Events Notice */}
      {events.length > 0 && events[0]?.id === '1' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 p-3 md:p-4">
          <div className="flex items-center text-blue-800">
            <FiInfo className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
            <span className="text-xs md:text-sm font-medium">
              Showing sample events for demonstration. Connect your Zoho Calendar to see real events.
            </span>
          </div>
        </div>
      )}

      {/* Day Events Modal */}
      <AnimatePresence>
        {dayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setDayModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Events for {dayModal.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {dayModal.events.length} event{dayModal.events.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setDayModal(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {dayModal.events.map((event, index) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setDayModal(null);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            {/* Date Range */}
                            <div className="flex items-center">
                              <FiCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
                              <div>
                                {isSameDate(new Date(event.start_time), new Date(event.end_time)) ? (
                                  <span>{formatDate(event.start_time)}</span>
                                ) : (
                                  <div>
                                    <div>From: {formatDate(event.start_time)}</div>
                                    <div>To: {formatDate(event.end_time)}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            {!event.all_day && (
                              <div className="flex items-center">
                                <FiClock className="w-4 h-4 mr-2 flex-shrink-0" />
                                <div>
                                  {isSameDate(new Date(event.start_time), new Date(event.end_time)) ? (
                                    <span>
                                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                    </span>
                                  ) : (
                                    <div>
                                      <div>Start: {formatTime(event.start_time)}</div>
                                      <div>End: {formatTime(event.end_time)}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center">
                                <FiMapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.description && (
                              <p className="text-gray-700 overflow-hidden text-ellipsis display-webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">{event.description}</p>
                            )}
                          </div>
                        </div>
                        {event.attachments && event.attachments.length > 0 && (
                          <div className="ml-4 flex-shrink-0">
                            <FiPaperclip className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  {/* Date Range */}
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    <div>
                      {isSameDate(new Date(selectedEvent.start_time), new Date(selectedEvent.end_time)) ? (
                        <span>{formatDate(selectedEvent.start_time)}</span>
                      ) : (
                        <div>
                          <div className="font-medium">From: {formatDate(selectedEvent.start_time)}</div>
                          <div className="font-medium">To: {formatDate(selectedEvent.end_time)}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Duration: {Math.ceil((new Date(selectedEvent.end_time).getTime() - new Date(selectedEvent.start_time).getTime()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Range */}
                  {!selectedEvent.all_day && (
                    <div className="flex items-center text-gray-600">
                      <FiClock className="w-4 h-4 mr-2" />
                      <div>
                        {isSameDate(new Date(selectedEvent.start_time), new Date(selectedEvent.end_time)) ? (
                          <span>
                            {formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}
                          </span>
                        ) : (
                          <div>
                            <div>Start: {formatTime(selectedEvent.start_time)}</div>
                            <div>End: {formatTime(selectedEvent.end_time)}</div>
                          </div>
                        )}
                      </div>
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

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Loading calendar events...</p>
          </div>
        </div>
      )}
    </div>
  );
} 
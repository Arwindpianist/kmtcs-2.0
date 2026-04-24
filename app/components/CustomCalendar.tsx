'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiPaperclip, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  duration?: string;
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
  training_snapshot?: {
    title?: string;
    description?: string;
    duration?: string;
    objectives?: string[];
    course_contents?: string;
    target_audience?: string;
    methodology?: string;
    certification?: string;
    hrdcorp_approval_no?: string;
  };
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
  const [brochurePreviewError, setBrochurePreviewError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Add state for day event modal
  const [dayModal, setDayModal] = useState<{date: Date, events: CalendarEvent[]} | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  useEffect(() => {
    setBrochurePreviewError(false);
  }, [selectedEvent?.id]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/calendar-events', { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      // Only use real events from API, never show sample/demo events
      if (data.events && data.events.length > 0) {
        setEvents(data.events);
      } else {
        // Empty calendar - show empty state
        setEvents([]);
      }
      
      setError(null);
    } catch {
      // On error, show empty state instead of sample events
      setError('Failed to load calendar events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date): DayData[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: DayData[] = [];
    const today = new Date();
    
    // Create a map of events for each day and include full multi-day spans.
    const dayEventMap: { [dayIndex: number]: CalendarEvent[] } = {};
    
    events.forEach(event => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);

      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      for (let i = 0; i < 42; i++) {
        const gridDate = new Date(startDate);
        gridDate.setDate(startDate.getDate() + i);

        const gridDay = new Date(gridDate.getFullYear(), gridDate.getMonth(), gridDate.getDate());
        const inRange = gridDay >= startDay && gridDay <= endDay;

        if (inRange) {
          if (!dayEventMap[i]) {
            dayEventMap[i] = [];
          }
          dayEventMap[i].push(event);
        }
      }
    });


    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayEvents = dayEventMap[i] || [];
      const isToday = currentDate.toDateString() === today.toDateString();
      
      
      days.push({
        date: currentDate,
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday,
        events: dayEvents,
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
  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((event) => new Date(event.end_time) >= new Date())
        .sort((firstEvent, secondEvent) => new Date(firstEvent.start_time).getTime() - new Date(secondEvent.start_time).getTime())
        .slice(0, 6),
    [events]
  );

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
    <div className="w-full max-w-7xl mx-auto bg-white rounded-xl border border-slate-200 overflow-hidden relative">
      <div className="border-b border-slate-200 bg-slate-50 p-4 md:p-5">
        <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2">Upcoming Sessions</h3>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingEvents.map((event) => (
              <button
                key={`upcoming-${event.id}`}
                type="button"
                onClick={() => setSelectedEvent(event)}
                className="text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{event.title}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {formatDate(event.start_time)}
                </p>
                {event.location ? <p className="text-xs text-gray-500 line-clamp-1">{event.location}</p> : null}
                {(event.duration || event.training_snapshot?.duration) ? (
                  <span className="inline-flex mt-2 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                    {event.duration || event.training_snapshot?.duration}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No upcoming sessions published yet.</p>
        )}
      </div>

      {/* Calendar Header */}
      <div className="bg-[#0f172a] text-white p-2 md:p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-1 md:p-2 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105"
            aria-label="Previous month"
          >
            <FiChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-base md:text-xl font-semibold text-center">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToToday}
              className="mt-1 px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs md:text-sm font-medium transition-colors"
            >
              Today
            </button>
          </div>
          <button
            onClick={nextMonth}
            className="p-1 md:p-2 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105"
            aria-label="Next month"
          >
            <FiChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
        {daysOfWeek.map(day => (
          <div key={day} className="p-1 md:p-2 text-center text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200">
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[62px] sm:min-h-[82px] md:min-h-[96px] lg:min-h-[106px] p-0.5 sm:p-1 md:p-2 border-r border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
              !day.isCurrentMonth ? 'bg-slate-50/60' : 'bg-white'
            } ${day.isToday ? 'bg-slate-100 border-slate-300 ring-1 ring-slate-300' : ''}`}
            style={{ position: 'relative' }}
            onClick={() => {
              if (day.events.length > 0) {
                setDayModal({ date: day.date, events: day.events });
              }
            }}
          >
            <div className={`text-[11px] md:text-xs font-semibold mb-1 md:mb-2 ${
              !day.isCurrentMonth ? 'text-gray-400' : 
              day.isToday ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {day.day}
              {day.events.length > 0 && (
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mt-0.5 mx-auto ${
                  day.isToday ? 'bg-slate-700' : 'bg-slate-500'
                }`}></div>
              )}
            </div>
            {/* Events Container */}
            <div className="space-y-0.5 relative">
              {day.events.slice(0, 2).map((event, idx) => {
                const eventStart = new Date(event.start_time);
                const eventEnd = new Date(event.end_time);
                const isMultiDay = eventStart.toDateString() !== eventEnd.toDateString();
                const isTodayEvent = day.isToday;
                const isEventStartDay = isSameDate(day.date, eventStart);
                const isEventEndDay = isSameDate(day.date, eventEnd);
                return (
                  <div
                    key={event.id + '-' + idx}
                    className={`border rounded px-1.5 py-0.5 md:px-2 md:py-1 cursor-pointer transition-colors text-[10px] md:text-xs ${
                      isTodayEvent || (isMultiDay && day.date >= eventStart && day.date <= eventEnd)
                        ? 'bg-slate-200 border-slate-400 hover:bg-slate-300 shadow-sm'
                        : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                    }`}
                    style={{
                      borderRadius: isMultiDay ? 
                        (isEventStartDay ? '8px 0 0 8px' : isEventEndDay ? '0 8px 8px 0' : '0') : 
                        '8px',
                      zIndex: isMultiDay ? 10 : 1,
                      height: '1.7em',
                      overflow: 'hidden',
                    }}
                    title={`${event.title}${isMultiDay ? ` (${Math.max(1, Math.ceil((eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60 * 24)) + 1)} days)` : ''}${isTodayEvent ? ' (Today)' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                  >
                    <div className={`font-medium leading-tight ${
                      isTodayEvent || (isMultiDay && day.date >= eventStart && day.date <= eventEnd) ? 'text-slate-900' : 'text-slate-800'
                    }`}>
                      {isEventStartDay ? (
                        <div>
                          <div className="font-semibold text-[10px] md:text-xs">
                            {event.title.split(':')[0]}
                          </div>
                          {isMultiDay && (
                            <div className={`text-[10px] md:text-xs mt-0.5 ${
                              isTodayEvent || (isMultiDay && day.date >= eventStart && day.date <= eventEnd) ? 'text-slate-700' : 'text-slate-600'
                            }`}>
                              {Math.max(1, Math.ceil((eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60 * 24)) + 1)} day{Math.max(1, Math.ceil((eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60 * 24)) + 1) !== 1 ? 's' : ''}
                            </div>
                          )}
                          {!event.all_day && (
                            <div className="text-[10px] md:text-xs text-gray-600 mt-0.5">
                              {formatTime(event.start_time)}
                            </div>
                          )}
                          {(event.duration || event.training_snapshot?.duration) ? (
                            <div className="text-[10px] md:text-xs text-slate-700 mt-0.5">
                              {event.duration || event.training_snapshot?.duration}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
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
                  className="bg-slate-100 text-slate-700 text-[10px] md:text-xs px-1.5 py-0.5 rounded-full cursor-pointer hover:bg-slate-200 transition-colors text-center"
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
      <div className="flex flex-wrap justify-center items-center gap-4 mt-4 mb-2 text-xs md:text-sm px-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 md:w-4 md:h-4 rounded bg-slate-300 border border-slate-500"></span>
          <span className="text-gray-700">Ongoing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 md:w-4 md:h-4 rounded bg-slate-200 border border-slate-400"></span>
          <span className="text-gray-700">Upcoming</span>
        </div>
      </div>


      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <div className="bg-slate-50 border-t border-slate-200 p-6 md:p-8 text-center">
          <div className="flex flex-col items-center text-gray-700">
            <FiCalendar className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              No Upcoming Public Training Sessions
            </h3>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mb-4">
              There are currently no upcoming public training sessions scheduled. Please contact us for private or on-demand training programs tailored to your organization&apos;s needs.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      )}

      {/* Day Events Modal */}
      <AnimatePresence>
        {dayModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setDayModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div
                className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      Events for {dayModal.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-gray-600 mt-0.5 md:mt-1 text-xs md:text-sm">
                      {dayModal.events.length} event{dayModal.events.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setDayModal(null)}
                    className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <div className="space-y-2 md:space-y-4">
                  {dayModal.events.map((event) => (
                    <div
                      key={event.id}
                      className="border border-slate-200 rounded-xl p-2 md:p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setDayModal(null);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">{event.title}</h4>
                          <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                            {/* Date Range */}
                            <div className="flex items-center">
                              <FiCalendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
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
                                <FiClock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
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
                                <FiMapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.description && (
                              <p className="text-gray-700 overflow-hidden text-ellipsis display-webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">{event.description}</p>
                            )}
                            {(event.duration || event.training_snapshot?.duration) ? (
                              <p className="text-xs text-slate-700 font-medium">
                                Duration: {event.duration || event.training_snapshot?.duration}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {event.attachments && event.attachments.length > 0 && (
                          <div className="ml-2 md:ml-4 flex-shrink-0">
                            <FiPaperclip className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
              <div className="p-4 md:p-6">
                <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-4 md:px-5 md:py-5 mb-4 md:mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-blue-200 font-semibold">Training Event</p>
                      <h3 className="mt-1 text-lg md:text-2xl font-bold text-white">{selectedEvent.title}</h3>
                    </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1.5 md:p-2 text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                  >
                    <FiX className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4 lg:col-span-4">
                    <div className="space-y-2 md:space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-3 md:p-4 h-fit">
                  {/* Date Range */}
                  <div className="flex items-center text-gray-600 text-xs md:text-sm">
                    <FiCalendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    <div>
                      {isSameDate(new Date(selectedEvent.start_time), new Date(selectedEvent.end_time)) ? (
                        <span>{formatDate(selectedEvent.start_time)}</span>
                      ) : (
                        <div>
                          <div className="font-medium">From: {formatDate(selectedEvent.start_time)}</div>
                          <div className="font-medium">To: {formatDate(selectedEvent.end_time)}</div>
                          <div className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">
                            Duration: {Math.ceil((new Date(selectedEvent.end_time).getTime() - new Date(selectedEvent.start_time).getTime()) / (1000 * 60 * 60 * 24))} days
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Time Range */}
                  {!selectedEvent.all_day && (
                    <div className="flex items-center text-gray-600 text-xs md:text-sm">
                      <FiClock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
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
                    <div className="flex items-center text-gray-600 text-xs md:text-sm">
                      <FiMapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  {(selectedEvent.duration || selectedEvent.training_snapshot?.duration) && (
                    <div className="text-gray-600 text-xs md:text-sm">
                      <span className="font-medium">Duration: </span>
                      <span>{selectedEvent.duration || selectedEvent.training_snapshot?.duration}</span>
                    </div>
                  )}
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3 md:p-4 bg-white">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-xs md:text-sm">
                        <FiPaperclip className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Brochure
                      </h4>
                      {selectedEvent.attachments && selectedEvent.attachments.length > 0 ? (
                        <div className="space-y-3">
                          {!brochurePreviewError ? (
                            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                              <iframe
                                src={selectedEvent.attachments[0].url}
                                title={selectedEvent.attachments[0].name}
                                className="w-full h-[260px] md:h-[320px]"
                                onError={() => setBrochurePreviewError(true)}
                              />
                            </div>
                          ) : (
                            <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-6 text-center">
                              <p className="text-sm font-medium text-amber-800">Unable to preview this brochure inline.</p>
                              <p className="text-xs text-amber-700 mt-1">Use Open or Download to access the file directly.</p>
                            </div>
                          )}
                          <div className="space-y-2">
                            {selectedEvent.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="block p-2 bg-gray-50 rounded-lg text-xs md:text-sm border border-gray-200"
                              >
                                <div className="font-medium text-slate-900 line-clamp-1">{attachment.name}</div>
                                <div className="text-gray-500 text-[10px] md:text-xs mb-2">
                                  {(attachment.size / 1024).toFixed(1)} KB
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-md bg-slate-900 px-2 py-1 text-[11px] text-white hover:bg-slate-800"
                                  >
                                    Open
                                  </a>
                                  <a
                                    href={attachment.url}
                                    download={attachment.name}
                                    className="inline-flex items-center rounded-md border border-slate-500 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100"
                                  >
                                    Download
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500">
                          No brochure attached for this event.
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4 lg:col-span-8">
                  {selectedEvent.description && (
                    <div className="rounded-xl border border-slate-200 p-3 md:p-4 text-gray-700 text-xs md:text-sm bg-white">
                      <h4 className="font-semibold text-slate-900 mb-2">Overview</h4>
                      <p className="whitespace-pre-wrap">{selectedEvent.description}</p>
                    </div>
                  )}
                  {selectedEvent.training_snapshot && (
                    <div className="space-y-2 md:space-y-3 rounded-xl border border-slate-200 p-3 md:p-4 bg-white">
                      <h4 className="font-semibold text-slate-900">Training Details</h4>
                      {selectedEvent.training_snapshot.objectives && selectedEvent.training_snapshot.objectives.length > 0 ? (
                        <div className="text-xs md:text-sm">
                          <h5 className="font-semibold text-gray-900 mb-1">Learning Objectives</h5>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {selectedEvent.training_snapshot.objectives.map((objective, objectiveIndex) => (
                              <li key={`${selectedEvent.id}-objective-${objectiveIndex}`}>{objective}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {selectedEvent.training_snapshot.course_contents ? (
                        <div className="text-xs md:text-sm">
                          <h5 className="font-semibold text-gray-900 mb-1">Course Contents</h5>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {selectedEvent.training_snapshot.course_contents}
                          </p>
                        </div>
                      ) : null}
                      {selectedEvent.training_snapshot.target_audience ? (
                        <div className="text-xs md:text-sm">
                          <h5 className="font-semibold text-gray-900 mb-1">Target Audience</h5>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {selectedEvent.training_snapshot.target_audience}
                          </p>
                        </div>
                      ) : null}
                      {selectedEvent.training_snapshot.methodology ? (
                        <div className="text-xs md:text-sm">
                          <h5 className="font-semibold text-gray-900 mb-1">Methodology</h5>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {selectedEvent.training_snapshot.methodology}
                          </p>
                        </div>
                      ) : null}
                      {selectedEvent.training_snapshot.certification ? (
                        <div className="text-xs md:text-sm">
                          <h5 className="font-semibold text-gray-900 mb-1">Certification</h5>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {selectedEvent.training_snapshot.certification}
                          </p>
                        </div>
                      ) : null}
                      {selectedEvent.training_snapshot.hrdcorp_approval_no ? (
                        <div className="text-xs md:text-sm">
                          <h5 className="font-semibold text-gray-900 mb-1">HRDCorp Approval No</h5>
                          <p className="text-gray-700">{selectedEvent.training_snapshot.hrdcorp_approval_no}</p>
                        </div>
                      ) : null}
                    </div>
                  )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Close
                  </button>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Enquire About This Training
                  </a>
                </div>
              </div>
              </div>
            </motion.div>
          </div>
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
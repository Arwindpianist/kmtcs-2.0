'use client';

import SEOHead from '@/app/components/SEOHead';
import CustomCalendar from '@/app/components/CustomCalendar';
import Image from 'next/image';

export default function CalendarPageClient() {
  return (
    <>
      <SEOHead 
        title="Training Calendar - KMTCS"
        description="View our upcoming training sessions and events. Stay updated with KMTCS training programs and schedule custom training for your organization."
        keywords={["training calendar", "KMTCS events", "training sessions", "professional development", "Malaysia training"]}
        image="/KMTCS-NEW-LOGO.svg"
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50 to-blue-100 py-12 md:py-14">
          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-4">
                <Image
                  src="/KMTCS-NEW-LOGO.svg"
                  alt="KMTCS"
                  width={170}
                  height={60}
                  className="h-10 md:h-12 w-auto"
                />
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
                Training Calendar
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Upcoming KMTCS programs, dates, venues, and brochures.
              </p>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Custom Calendar */}
              <div className="bg-card rounded-2xl shadow-sm border border-border/70 p-4 md:p-6 mb-8">
                <div className="w-full">
                  <CustomCalendar />
                </div>
              </div>

              {/* Calendar Options */}
              <div className="grid lg:grid-cols-2 gap-5 md:gap-6">
                {/* Subscribe to Calendar */}
                <div className="bg-card rounded-2xl shadow-sm border border-border/70 p-5 md:p-6">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground">
                        Subscribe to Calendar
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                    Add KMTCS sessions to your personal calendar.
                  </p>
                  
                  <div className="space-y-4">
                    <a 
                      href="/api/calendar-feed" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-base font-medium"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Download iCal Feed
                    </a>
                  </div>
                </div>

                {/* Contact for Custom Training */}
                <div className="bg-card rounded-2xl shadow-sm border border-border/70 p-5 md:p-6">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground">
                        Contact for Custom Training
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                    Need an in-house program for your team?
                  </p>
                  
                  <div className="space-y-4">
                    <a 
                      href="/contact" 
                      className="inline-flex items-center justify-center w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-base font-medium"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Contact Us for Custom Training
                    </a>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 
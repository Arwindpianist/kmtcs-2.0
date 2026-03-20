'use client';

import SEOHead from '@/app/components/SEOHead';
import CustomCalendar from '@/app/components/CustomCalendar';

export default function CalendarPageClient() {
  return (
    <>
      <SEOHead 
        title="Training Calendar - KMTCS"
        description="View our upcoming training sessions and events. Stay updated with KMTCS training programs and schedule custom training for your organization."
        keywords={["training calendar", "KMTCS events", "training sessions", "professional development", "Malaysia training"]}
        image="/KMTCS-NEW-LOGO.svg"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-12 md:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Training Calendar
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
                Stay updated with our upcoming training sessions and events. Subscribe to our calendar and never miss an opportunity for professional development.
              </p>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Custom Calendar */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8 mb-8 md:mb-12">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    KMTCS Training Programs
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    View our upcoming training sessions and events
                  </p>
                </div>
                <div className="w-full">
                  <CustomCalendar />
                </div>
              </div>

              {/* Calendar Options */}
              <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
                {/* Subscribe to Calendar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        Subscribe to Calendar
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        Add to your personal calendar
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                    Add our training calendar to your personal calendar app to stay updated with all events and never miss an opportunity for professional development.
                  </p>
                  
                  <div className="space-y-4">
                    <a 
                      href="https://calendar.zoho.com/ical/zz08011230d99b0256d22c53abcdf1239f92f7762d7288f381bf49812a9e491d0e343c1c8ed6ec5f7bc97b430beaa4a0b95af1d45e/mailto" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-base font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add to Calendar
                    </a>
                  </div>
                </div>

                {/* Contact for Custom Training */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        Contact for Custom Training
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        Get in touch for tailored solutions
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                    Need custom training programs tailored specifically for your organization? Contact us to discuss your requirements and get a personalized solution.
                  </p>
                  
                  <div className="space-y-4">
                    <a 
                      href="/contact" 
                      className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-base font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Contact Us for Custom Training
                    </a>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        We'll get back to you within 24 hours
                      </p>
                    </div>
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
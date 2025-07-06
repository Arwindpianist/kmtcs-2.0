'use client';

import SEOHead from '@/app/components/SEOHead';

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
              
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm md:text-base">
                <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="font-medium">📅 Public Access</span>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="font-medium">🔗 Share Calendar</span>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="font-medium">📋 Event Details</span>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="font-medium">📱 iCal Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Calendar Embed */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8 mb-8 md:mb-12">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    KMTCS Training Programs
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    View our upcoming training sessions and events
                  </p>
                </div>
                <div className="flex justify-center">
                  <iframe 
                    src="https://calendar.zoho.com/zc/ui/embed/#calendar=zz08011230d99b0256d22c53abcdf1239f92f7762d7288f381bf49812a9e491d0e343c1c8ed6ec5f7bc97b430beaa4a0b95af1d45e&title=Training%20Programs&type=1&language=en&timezone=Asia%2FSingapore&showTitle=1&showTimezone=1&view=month&showDetail=0&theme=1&eventColorType=light" 
                    title="Training Programs"
                    width="100%" 
                    height="600" 
                    frameBorder="0" 
                    scrolling="no"
                    className="rounded-xl shadow-lg"
                  />
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📅 iCal URL
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text" 
                          value="https://calendar.zoho.com/ical/zz08011230d99b0256d22c53abcdf1239f92f7762d7288f381bf49812a9e491d0e343c1c8ed6ec5f7bc97b430beaa4a0b95af1d45e" 
                          readOnly 
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText('https://calendar.zoho.com/ical/zz08011230d99b0256d22c53abcdf1239f92f7762d7288f381bf49812a9e491d0e343c1c8ed6ec5f7bc97b430beaa4a0b95af1d45e');
                            // Show feedback
                            const button = event?.target as HTMLButtonElement;
                            if (button) {
                              const originalText = button.textContent;
                              button.textContent = 'Copied!';
                              button.classList.add('bg-green-600');
                              setTimeout(() => {
                                button.textContent = originalText;
                                button.classList.remove('bg-green-600');
                              }, 2000);
                            }
                          }}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href="https://calendar.zoho.com/ical/zz08011230d99b0256d22c53abcdf1239f92f7762d7288f381bf49812a9e491d0e343c1c8ed6ec5f7bc97b430beaa4a0b95af1d45e/mailto" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add to Zoho Calendar
                      </a>
                    </div>
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

              {/* Additional Information */}
              <div className="mt-8 md:mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
                <div className="flex items-center mb-6 md:mb-8">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Calendar Information
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Technical details and integration options
                    </p>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Calendar Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="text-gray-500 text-sm w-24 flex-shrink-0">ID:</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 break-all">
                          zz08011230d99b0256d22c53abcdf1239f92f7762d7288f381bf49812a9e491d0e343c1c8ed6ec5f7bc97b430beaa4a0b95af1d45e
                        </code>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-500 text-sm w-24 flex-shrink-0">UID:</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                          f4c3dda451a2448fb8f12e629a46f533
                        </code>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm w-24 flex-shrink-0">Timezone:</span>
                        <span className="text-gray-700">Asia/Singapore</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm w-24 flex-shrink-0">Language:</span>
                        <span className="text-gray-700">English</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Integration Options
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">CalDAV URL for calendar sync</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Web API for appointment scheduling</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Embed code for website integration</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Public access - share with anyone</span>
                      </div>
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
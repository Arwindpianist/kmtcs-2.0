'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BackgroundLines from '../components/BackgroundLines'
import { fetchConsultants, type Consultant } from '@/app/services/supabaseService'

export default function Consultants() {
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)

  useEffect(() => {
    const loadConsultants = async () => {
      try {
        const data = await fetchConsultants()
        // Only show active consultants
        setConsultants(data.filter(c => c.status))
      } catch (err) {
        console.error('Error loading consultants:', err)
        setError('Failed to load consultants. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadConsultants()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-baby-blue py-20">
        <BackgroundLines />
        <div className="container mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-blue-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/30 rounded-lg p-6">
                  <div className="w-32 h-32 bg-blue-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-blue-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-blue-200 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="h-4 bg-blue-200 rounded w-full mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-baby-blue py-20">
        <BackgroundLines />
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center text-red-600 py-4">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <BackgroundLines />
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8 md:mb-12">
          Our Consultants
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {consultants.map((consultant) => (
            <motion.div 
              key={consultant.id} 
              className="bg-white/30 backdrop-blur-sm rounded-lg p-6 hover:bg-white/40 transition-colors cursor-pointer"
              onClick={() => setSelectedConsultant(consultant)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4">
                {consultant.image_url ? (
                  <Image
                    src={consultant.image_url}
                    alt={consultant.name}
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-md"
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 160px"
                    priority={consultant.id === consultants[0]?.id}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center">
                    <span className="text-4xl text-blue-600">
                      {consultant.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-blue-900 text-center mb-2">
                {consultant.name}
              </h2>
              <p className="text-blue-800 text-center mb-3 md:mb-4 font-medium text-sm md:text-base">
                {consultant.role}
              </p>
              <p className="text-blue-800 text-center text-xs md:text-sm">
                {consultant.short_bio}
              </p>
              <p className="block mt-4 bg-white/30 text-blue-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border border-baby-blue/20 px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white transition-colors text-center">
                Click to view full profile
              </p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedConsultant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 pt-20 md:pt-24"
              onClick={() => setSelectedConsultant(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white rounded-lg p-6 md:p-8 w-full max-w-4xl lg:w-11/12 mx-auto max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex flex-col md:flex-row items-center mb-6">
                  <div className="relative w-40 h-40 md:w-48 md:h-48 mb-4 md:mb-0 md:mr-8">
                    {selectedConsultant.image_url ? (
                      <Image
                        src={selectedConsultant.image_url}
                        alt={selectedConsultant.name}
                        fill
                        className="rounded-full object-cover border-4 border-blue-300 shadow-lg"
                        sizes="(max-width: 768px) 160px, 192px"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center">
                        <span className="text-6xl text-blue-600">
                          {selectedConsultant.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-blue-900">
                      {selectedConsultant.name}
                    </h2>
                    <p className="text-blue-800 font-medium text-base md:text-lg">
                      {selectedConsultant.role}
                    </p>
                    {selectedConsultant.email && (
                      <p className="text-blue-600 text-sm mt-2">
                        <a href={`mailto:${selectedConsultant.email}`} className="hover:underline">
                          {selectedConsultant.email}
                        </a>
                      </p>
                    )}
                    {selectedConsultant.phone && (
                      <p className="text-blue-600 text-sm">
                        <a href={`tel:${selectedConsultant.phone}`} className="hover:underline">
                          {selectedConsultant.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none text-blue-800 text-sm md:text-base">
                  <div dangerouslySetInnerHTML={{ 
                    __html: selectedConsultant.full_bio.replace(/\n/g, '<br />') 
                  }} />
                </div>

                <button
                  className="mt-6 md:mt-8 bg-blue-900 text-white px-5 py-2 md:px-6 md:py-2 rounded-full hover:bg-blue-800 transition-colors text-sm md:text-base"
                  onClick={() => setSelectedConsultant(null)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
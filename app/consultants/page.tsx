'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BackgroundLines from '../components/BackgroundLines'

// Consultant images
import BimalRaj from './bimal-raj.jpg'
import Gopala from './gopala-krishnan.jpg'
import Shuras from './shuras-vasu.jpg'
import Muralitharan from './muralitharan.jpg'
import Latha from './latha.jpg'
import Joseph from './joseph.jpg'
import LokeMunKit from './loke.jpg'
import Venkat from './venkat.jpg'
import Rathinam from './rathinam.jpg'
import Prabagaran from './praba.jpg'

interface Consultant {
  id: number
  name: string
  role: string
  image: any
  shortBio: string
  bioSlug: string
}

interface BioContent {
  content: string
  isLoading: boolean
  error?: string
}

const consultants: Consultant[] = [
  { 
    id: 1, 
    name: 'IR BIMAL RAJ', 
    role: 'Six Sigma Consultant',
    image: BimalRaj,
    shortBio: 'Expert in process optimization and industrial engineering with over 25 years of experience.',
    bioSlug: 'ir-bimal-raj'
  },
  {
    id: 2,
    name: 'GOPALA KRISHNAN V PONNUSAMY',
    role: 'OSH and Operations Excellence Consultant',
    image: Gopala,
    shortBio: 'Quality management and operational excellence expert with extensive industry experience.',
    bioSlug: 'gopala-krishnan'
  },
  {
    id: 3,
    name: 'SHURAS VASU',
    role: 'Lean & Six Sigma Consultant',
    image: Shuras,
    shortBio: 'Lean manufacturing and continuous improvement specialist with proven track record.',
    bioSlug: 'shuras-vasu'
  },
  {
    id: 4,
    name: 'R. MURALITHARAN R. RAJAMANICKAM',
    role: 'Quality and OSH Consultant',
    image: Muralitharan,
    shortBio: 'Project management and process optimization expert with diverse industry experience.',
    bioSlug: 'muralitharan'
  },
  {
    id: 5,
    name: 'LATHA MUTHUSAMY',
    role: 'Quality & Security Consultant',
    image: Latha,
    shortBio: 'Organizational development and change management specialist.',
    bioSlug: 'latha-muthusamy'
  },
  {
    id: 6,
    name: 'DR. JOSEPH CLARENCE EMMANUEL MICHAEL',
    role: 'Mechanical Consultant',
    image: Joseph,
    shortBio: 'Expert in technical training and engineering solutions with academic background.',
    bioSlug: 'joseph-michael'
  },
  {
    id: 7,
    name: 'Ts LOKE MUN KIT',
    role: 'Construction & ADR Consultant',
    image: LokeMunKit,
    shortBio: 'Digital transformation and technology integration specialist.',
    bioSlug: 'loke-mun-kit'
  },
  {
    id: 8,
    name: 'DR. N. VENKATARAMAN',
    role: 'Environmental & Sustainability Consultant',
    image: Venkat,
    shortBio: 'Specialist in integrated management systems and process safety with over 30 years of experience.',
    bioSlug: 'venkataraman'
  },
  {
    id: 9,
    name: 'RATHINAM RENGASAMY',
    role: 'Rotating Equipment’s, HX and Boilers Consultant',
    image: Rathinam,
    shortBio: 'Pioneer in renewable energy power plant operations with over 30 years of experience.',
    bioSlug: 'rathinam-rengasamy'
  },
  {
    id: 10,
    name: 'PRABAGARAN MUNIANDY',
    role: 'OSH Consultant',
    image: Prabagaran,
    shortBio: 'Expert in occupational safety, risk management, and railway operations with over 30 years of experience.',
    bioSlug: 'prabagaran-muniandy'
  }
]

export default function Consultants() {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  const [bioContent, setBioContent] = useState<BioContent>({ 
    content: '', 
    isLoading: false 
  })

  const loadBio = async (slug: string) => {
    setBioContent(prev => ({ ...prev, isLoading: true, error: undefined }))
    try {
      const response = await fetch(`/const-bio/${slug}.txt`)
      if (!response.ok) throw new Error('Biography not found')
      const content = await response.text()
      setBioContent({ content, isLoading: false })
    } catch (error) {
      console.error('Error loading bio:', error)
      setBioContent({ 
        content: 'Biography currently unavailable', 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load biography' 
      })
    }
  }

  useEffect(() => {
    if (selectedConsultant) {
      loadBio(selectedConsultant.bioSlug)
    }
  }, [selectedConsultant])

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
              className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedConsultant(consultant)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4">
                <Image
                  src={consultant.image}
                  alt={consultant.name}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-md"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={consultant.id <= 3}
                />
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-blue-900 text-center mb-2">
                {consultant.name}
              </h2>
              <p className="text-blue-800 text-center mb-3 md:mb-4 font-medium text-sm md:text-base">
                {consultant.role}
              </p>
              <p className="text-blue-800 text-center text-xs md:text-sm">
                {consultant.shortBio}
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
                    <Image
                      src={selectedConsultant.image}
                      alt={selectedConsultant.name}
                      fill
                      className="rounded-full object-cover border-4 border-blue-300 shadow-lg"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-blue-900">
                      {selectedConsultant.name}
                    </h2>
                    <p className="text-blue-800 font-medium text-base md:text-lg">
                      {selectedConsultant.role}
                    </p>
                  </div>
                </div>

                <div className="prose max-w-none text-blue-800 text-sm md:text-base">
                  {bioContent.isLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ 
                      __html: bioContent.content.replace(/\n/g, '<br />') 
                    }} />
                  )}
                  {bioContent.error && (
                    <p className="text-red-500 mt-4">{bioContent.error}</p>
                  )}
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
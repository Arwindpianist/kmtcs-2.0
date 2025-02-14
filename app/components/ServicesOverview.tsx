'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchServices } from '@/app/services/googleSheetService'
import type { Service } from '@/app/types/service'

export default function ServicesOverview() {
  const [randomServices, setRandomServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await fetchServices()
        // Shuffle services and select 4
        const shuffled = [...services].sort(() => 0.5 - Math.random())
        setRandomServices(shuffled.slice(0, 4))
      } catch (error) {
        console.error('Failed to fetch services:', error)
        setRandomServices([])
      } finally {
        setIsLoading(false)
      }
    }
    loadServices()
  }, [])

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Our Services</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-baby-blue bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {randomServices.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-blue-300 via-sky-300 to-teal-200/50 border-r-2 border-blue-300 relative z-50 rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-blue-900 mb-4">{service.title}</h3>
                <p className="text-blue-800 mb-4 line-clamp-2">{service.shortDescription}</p>
                <Link href={`/services/${service.id}`} className="text-blue-900 font-semibold hover:underline">
                  Learn More
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/services" className="bg-baby-blue/10 backdrop-filter border-blue-300 backdrop-blur-lg border text-blue-800 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-800 hover:text-white hover:border-blue/40 transition-all duration-300 inline-block relative z-50 shadow-md hover:shadow-lg">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

interface ServiceItem {
  id: string
  title: string
  description: string
  price: number | null
  duration?: string
  category: string
  image_url?: string
  serviceType: 'technical-training' | 'non-technical-training' | 'consulting'
}

export default function ServicesOverview() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadServices() {
      try {
        // Fetch technical trainings
        const { data: technicalTrainings, error: techError } = await supabase
          .from('technical_trainings')
          .select('id, title, description, price, duration, category, image_url')
          .eq('status', true)
          .limit(3)

        if (techError) throw techError

        // Fetch non-technical trainings
        const { data: nonTechnicalTrainings, error: nonTechError } = await supabase
          .from('non_technical_trainings')
          .select('id, title, description, price, duration, category, image_url')
          .eq('status', true)
          .limit(3)

        if (nonTechError) throw nonTechError

        // Fetch consulting services
        const { data: consultingServices, error: consultingError } = await supabase
          .from('consulting_services')
          .select('id, title, description, price, category, image_url')
          .eq('status', true)
          .limit(3)

        if (consultingError) throw consultingError

        // Combine and format all services
        const allServices: ServiceItem[] = [
          ...(technicalTrainings || []).map(item => ({
            ...item,
            serviceType: 'technical-training' as const
          })),
          ...(nonTechnicalTrainings || []).map(item => ({
            ...item,
            serviceType: 'non-technical-training' as const
          })),
          ...(consultingServices || []).map(item => ({
            ...item,
            serviceType: 'consulting' as const
          }))
        ]

        // Shuffle and take first 6 for variety
        const shuffled = allServices.sort(() => 0.5 - Math.random())
        setServices(shuffled.slice(0, 6))
      } catch (err: any) {
        console.error('Error loading services:', err)
        setError('Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  const getServiceUrl = (service: ServiceItem) => {
    switch (service.serviceType) {
      case 'technical-training':
        return `/services/technical-trainings/${service.id}`
      case 'non-technical-training':
        return `/services/non-technical-trainings/${service.id}`
      case 'consulting':
        return `/services/consulting/${service.id}`
      default:
        return '#'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'engineering':
        return 'bg-blue-100 text-blue-800'
      case 'management':
        return 'bg-green-100 text-green-800'
      case 'it':
        return 'bg-purple-100 text-purple-800'
      case 'consulting':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of training and consulting services designed to elevate your organization's capabilities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={getServiceUrl(service)}>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {service.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(service.category)}`}>
                        {service.category}
                      </span>
                      {service.price && (
                        <span className="text-lg font-bold text-blue-600">
                          RM {service.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {service.duration && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.duration}
                        </span>
                      )}
                      <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                        Learn More →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View All Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
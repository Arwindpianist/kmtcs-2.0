'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface ServiceItem {
  id: string
  title: string
  description: string
  price: number | null
  duration?: string
  category: string
  serviceType: 'technical-training' | 'non-technical-training' | 'consulting'
}

export default function ServicesOverview({ services }: { services: ServiceItem[] }) {
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
      case 'technical training':
        return 'bg-blue-100 text-blue-800'
      case 'non-technical training':
        return 'bg-green-100 text-green-800'
      case 'consulting':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Our Services
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Discover our comprehensive range of training and consulting services designed to elevate your organization's capabilities.
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
                <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col border border-theme">
                  <div className="p-6 flex-grow">
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
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-secondary mb-4 line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                  <div className="p-6 bg-background-secondary">
                    <div className="flex items-center justify-between">
                      {service.duration && (
                        <span className="text-sm text-secondary flex items-center">
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
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
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
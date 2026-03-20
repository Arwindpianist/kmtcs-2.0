'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'

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
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Our Services
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto">
            Discover our comprehensive range of training and consulting services designed to elevate your organization's capabilities.
          </p>
          </motion.div>
        </div>

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
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1 h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className={getCategoryColor(service.category)}>
                        {service.category}
                      </Badge>
                      {service.price && (
                        <span className="text-lg font-bold text-primary">
                          RM {service.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors break-words">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 break-words">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-0">
                    <div className="flex items-center justify-between w-full">
                      {service.duration && (
                        <span className="text-sm text-muted-foreground flex items-center break-words">
                          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.duration}
                        </span>
                      )}
                      <span className="text-primary font-semibold group-hover:text-primary/80 transition-colors flex items-center">
                        Learn More <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl">
            <Link href="/services">
              View All Services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
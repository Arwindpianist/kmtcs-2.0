'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Service } from '../types'

const services: Service[] = [
  {
    id: 1,
    title: 'Engineering Consulting',
    description: 'Comprehensive engineering solutions to optimize your processes and systems.',
    price: 2500,
    priceId: 'price_engineering_consulting',
    details: [
      'Process optimization and automation',
      'Technical risk assessment',
      'Quality control systems',
      'Engineering documentation',
      'Compliance and safety audits'
    ],
    benefits: [
      'Improved operational efficiency',
      'Reduced technical risks',
      'Enhanced quality standards',
      'Better regulatory compliance'
    ]
  },
  {
    id: 2,
    title: 'Management Consulting',
    description: 'Strategic management solutions to drive organizational success.',
    price: 3000,
    priceId: 'price_management_consulting',
    details: [
      'Strategic planning',
      'Change management',
      'Performance optimization',
      'Leadership development',
      'Process improvement'
    ]
  },
  // Add more services...
]

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.05 }}
              className="bg-baby-blue bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4">{service.title}</h3>
              <p className="text-blue-800 mb-4">{service.description}</p>
              <p className="text-blue-900 font-semibold mb-4">
                Starting from ${service.price}
              </p>
              {service.details && (
                <ul className="list-disc list-inside text-blue-800 mb-4">
                  {service.details.slice(0, 3).map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
              <div className="flex justify-between items-center mt-4">
                <Link 
                  href={`/services/${service.id}`}
                  className="text-blue-900 font-semibold hover:underline"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


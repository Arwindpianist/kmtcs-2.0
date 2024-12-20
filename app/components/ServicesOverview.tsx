'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const services = [
  { id: 1, title: 'Engineering Consulting', description: 'Optimize your engineering processes and systems.' },
  { id: 2, title: 'Management Consulting', description: 'Improve organizational effectiveness and efficiency.' },
  { id: 3, title: 'IT Consulting', description: 'Leverage technology to drive business growth.' },
  { id: 4, title: 'Training Programs', description: 'Enhance your team\'s skills and capabilities.' },
]

export default function ServicesOverview() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.05 }}
              className="bg-baby-blue bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4">{service.title}</h3>
              <p className="text-blue-800 mb-4">{service.description}</p>
              <Link href={`/services/${service.id}`} className="text-blue-900 font-semibold hover:underline">
                Learn More
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/services" className="bg-blue-900 text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-blue-800 transition duration-300">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}


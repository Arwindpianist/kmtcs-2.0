'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { trainings, nonTechnicalTrainings } from '../data/trainings'
import type { Training } from '../data/trainings'
import { consultingServices } from '../data/consulting'
import type { ConsultingService } from '../data/consulting'

type ServiceCategory = 'all' | 'technical' | 'non-technical' | 'consulting';

interface ServiceWithType extends ConsultingService {
  type: 'consulting';
}

interface TrainingWithType extends Training {
  type: 'training';
}

type ServiceItem = ServiceWithType | TrainingWithType;

export default function Services() {
  const [activeTab, setActiveTab] = useState<ServiceCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = (): ServiceItem[] => {
    let filtered = [
      ...trainings.map(t => ({ ...t, type: 'training' as const })),
      ...nonTechnicalTrainings.map(t => ({ ...t, type: 'training' as const })),
      ...consultingServices.map(c => ({ ...c, type: 'consulting' as const }))
    ]
    
    if (activeTab === 'technical') {
      filtered = trainings.map(t => ({ ...t, type: 'training' as const }))
    } else if (activeTab === 'non-technical') {
      filtered = nonTechnicalTrainings.map(t => ({ ...t, type: 'training' as const }))
    } else if (activeTab === 'consulting') {
      filtered = consultingServices.map(c => ({ ...c, type: 'consulting' as const }))
    }

    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Our Services</h1>
        
        {/* Search and Filter Controls */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full p-2 rounded-lg border border-blue-300 mb-4"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'all' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveTab('consulting')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'consulting' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'
              }`}
            >
              Consulting
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'technical' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'
              }`}
            >
              Technical Training
            </button>
            <button
              onClick={() => setActiveTab('non-technical')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'non-technical' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'
              }`}
            >
              Non-Technical Training
            </button>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices().map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
            >
              <div className="bg-blue-900 text-white text-sm rounded-full px-3 py-1 inline-block mb-4">
                {service.category}
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">{service.title}</h3>
              <p className="text-blue-800 mb-4">{service.description}</p>
              
              {service.type === 'training' && (
                <div className="flex justify-between items-center text-blue-800 mb-4">
                  <span>Duration: {service.content.duration}</span>
                  <span>RM {service.content.price}</span>
                </div>
              )}
              
              <Link 
                href={`/services/${service.type}/${service.id}`}
                className="block text-center bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredServices().length === 0 && (
          <p className="text-center text-blue-800 mt-8">
            No services found matching your search criteria.
          </p>
        )}
      </div>
    </div>
  )
}


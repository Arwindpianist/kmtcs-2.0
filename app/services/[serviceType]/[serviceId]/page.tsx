'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import type { Training } from '../../../data/trainings'
import type { ConsultingService } from '../../../data/consulting'
import { consultingServices } from '../../../data/consulting'
import { trainings, nonTechnicalTrainings } from '../../../data/trainings'


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type ServiceType = Training | ConsultingService

function isTraining(service: ServiceType): service is Training {
  return 'content' in service;
}

function isConsulting(service: ServiceType): service is ConsultingService {
  return 'details' in service;
}

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState<ServiceType | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('Current params:', params);
    
    if (params.serviceType === 'training') {
      const allTrainings = [...trainings, ...nonTechnicalTrainings]
      const found = allTrainings.find(t => t.id === Number(params.serviceId))
      console.log('Found training:', found)
      setService(found || null)
    } else if (params.serviceType === 'consulting') {
      const found = consultingServices.find(c => c.id === params.serviceId)
      console.log('Found consulting:', found)
      setService(found || null)
    }
  }, [params])

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const stripe = await stripePromise

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service?.id,
          serviceType: params.serviceType,
          priceId: service?.priceId,
          title: service?.title,
          price: isTraining(service) ? service.content.price : service.price
        }),
      })

      const { sessionId } = await response.json()
      const result = await stripe?.redirectToCheckout({ sessionId })

      if (result?.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to initiate checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-baby-blue py-20">
        <div className="container mx-auto px-6">
          <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-8">Service Not Found</h1>
            <Link href="/services" className="text-blue-900 hover:underline">
              ← Back to Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <div className="container mx-auto px-6">
        <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-8">
          <div className="mb-8">
            <span className="bg-blue-900 text-white text-sm rounded-full px-3 py-1 inline-block mb-4">
              {service.category}
            </span>
            <h1 className="text-4xl font-bold text-blue-900 mb-4">{service.title}</h1>
            <p className="text-lg text-blue-800">{service.description}</p>
          </div>

          {isTraining(service) && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Course Details</h2>
              <div className="space-y-4">
                <p className="text-blue-800"><span className="font-semibold">Introduction:</span> {service.content.introduction}</p>
                <p className="text-blue-800"><span className="font-semibold">Duration:</span> {service.content.duration}</p>
                {/* <p className="text-blue-800"><span className="font-semibold">Price:</span> RM {service.content.price}</p> */}
                {service.content.objectives && (
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">Objectives</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {service.content.objectives.map((objective, index) => (
                        <li key={index} className="text-blue-800">{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {isConsulting(service) && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Service Details</h2>
              <ul className="list-disc list-inside space-y-2">
                {service.details.map((detail, index) => (
                  <li key={index} className="text-blue-800">{detail}</li>
                ))}
              </ul>
              {/* <p className="text-blue-800 mt-4"><span className="font-semibold">Price:</span> RM {service.price}</p> */}
            </div>
          )}

          <div className="flex justify-between items-center mt-8 border-t pt-8">
            <Link href="/services" className="text-blue-900 hover:underline">
              ← Back to Services
            </Link>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`px-6 py-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : `Enroll Now`}
               {/* - RM ${isTraining(service) ? 
                service.content.price : service.price} */}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
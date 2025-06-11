// app/services/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import DOMPurify from 'dompurify'
import { getServiceById } from '@/app/services/supabaseService'
import type { Service } from '@/app/types/service'

export default function ServiceDetail() {
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadService() {
      try {
        const data = await getServiceById(params.id as string)
        setService(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadService()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-baby-blue py-20 text-center text-blue-900">
        Loading service details...
      </div>
    )
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
            <Link href="/services" className="text-blue-900 hover:underline">
              ← Back to Services
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-blue-900 mb-4">{service.title}</h1>
          <div className="flex items-center space-x-4 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {service.service_type}
            </span>
            <span className="text-gray-600">{service.duration}</span>
            {service.price && (
              <span className="text-blue-900 font-semibold">
                RM {service.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(service.full_description || '') 
            }} />
          </div>

          <div className="mt-8">
            <button
              disabled
              className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed opacity-75"
              title="Enquiry functionality coming soon"
            >
              Enquire About This Service
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
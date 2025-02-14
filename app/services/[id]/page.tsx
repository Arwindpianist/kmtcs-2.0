// app/services/[id]/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import DOMPurify from 'dompurify'
import { fetchServices } from '@/app/services/googleSheetService'
import type { Service } from '@/app/types/service'

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch service metadata
        const services = await fetchServices()
        const foundService = services.find(s => s.id === params.id)

        if (!foundService) {
          console.error('Service not found:', params.id)
          return
        }

        setService(foundService)

        // Fetch Google Doc content
        const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
        if (!API_KEY) throw new Error('Missing Google API Key')

        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${foundService.id}/export?mimeType=text/html&key=${API_KEY}`
        )

        if (!response.ok) throw new Error('Failed to fetch document')
        
        const html = await response.text()
        const cleanHtml = DOMPurify.sanitize(html, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
          ALLOWED_ATTR: []
        })

        setContent(cleanHtml)
      } catch (error) {
        console.error('Error loading service:', error)
        setContent('<p>Service details currently unavailable</p>')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const googleFormUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL!
    const serviceDetails = service ? `
      Service: ${service.title}
      Type: ${service.type}
      Duration: ${service.duration}
    ` : ''

    const urlParams = new URLSearchParams({
      'entry.2092238618': formData.name,
      'entry.479301265': formData.company,
      'entry.1556369182': formData.email,
      'entry.151379549': formData.phone,
      'entry.1202816508': serviceDetails
    })

    window.open(`${googleFormUrl}?usp=pp_url&${urlParams.toString()}`, '_blank')
    setShowForm(false)
  }

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
            <span className="bg-blue-900 text-white text-sm rounded-full px-3 py-1 inline-block mb-4">
              {service.type}
            </span>
            <h1 className="text-4xl font-bold text-blue-900 mb-4">{service.title}</h1>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {showForm && (
            <div className="bg-slate-500 bg-opacity-20 flex items-top justify-center p-4 z-50">
              <div className="bg-white shadow-lg backdrop-filter backdrop-blur-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Your Contact Information</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 ps-2 block w-full rounded-md bg-blue-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="mt-1 ps-2 block w-full rounded-md bg-blue-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1 ps-2 block w-full rounded-md bg-blue-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 ps-2 block w-full rounded-md bg-blue-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-blue-900 hover:text-blue-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8 border-t pt-8">
            <Link href="/services" className="text-blue-900 hover:underline">
              ← Back to Services
            </Link>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors"
            >
              Enquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
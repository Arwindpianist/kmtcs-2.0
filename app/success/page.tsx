'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SessionData {
  serviceType: string
  serviceId: string
  title: string
  price: number
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setSession(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching session:', err)
          setLoading(false)
        })
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-baby-blue py-20">
        <div className="container mx-auto px-6">
          <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="text-blue-900 mt-4">Loading payment details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <div className="container mx-auto px-6">
        <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Payment Successful!</h1>
            <p className="text-blue-800">Thank you for your purchase.</p>
          </div>

          {session && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Order Details</h2>
              <div className="space-y-3">
                <p className="text-blue-800">
                  <span className="font-medium">Service:</span> {session.title}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Amount Paid:</span> RM {session.price}
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Next Steps</h2>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                Check your email for a confirmation and further instructions
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Training schedule and details will be sent within 24 hours
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                For any questions, contact our support team
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Link 
              href="/services" 
              className="inline-block bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition-colors"
            >
              Browse More Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Success() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
} 
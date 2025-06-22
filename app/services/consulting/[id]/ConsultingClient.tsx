'use client';

import { useState } from 'react';
import { createEnquiry } from '@/app/services/supabaseService';

interface ConsultingService {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  status: boolean;
}

export default function ConsultingClient({ service }: { service: ConsultingService }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    status: 'new' as const
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const inquiryMessage = `
        Consulting Inquiry: ${service.title}
        ---------------------------------
        ${formData.message}
      `;

      await createEnquiry({
        ...formData,
        message: inquiryMessage,
        status: 'new'
      });
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        status: 'new'
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    if (!service.price) return;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: service.title,
          description: service.description,
          price: service.price,
          serviceId: service.id,
          serviceType: 'consulting'
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (status === 'success') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Message Sent Successfully!</h2>
          <p className="text-green-700 mb-6">Thank you for your inquiry. We will get back to you soon.</p>
          <button
            onClick={() => setStatus('idle')}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                Consulting
              </span>
              {service.price && (
                <span className="text-2xl font-bold text-blue-600">
                  RM {service.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {service.title}
            </h1>
            
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              {service.price && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">RM {service.price.toFixed(2)}</h3>
                  <button 
                    onClick={handlePayment}
                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.price ? 'Have a Question?' : 'Request a Quote'}
                </h3>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Phone (Optional)"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Company (Optional)"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Message"
                  />
                </div>
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {errorMessage}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`w-full bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors ${
                    status === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
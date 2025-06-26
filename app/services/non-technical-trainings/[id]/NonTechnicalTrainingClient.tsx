'use client';

import { useState } from 'react';
import { createEnquiry } from '@/app/services/supabaseService';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  price: number | null;
  duration: string;
  category: string;
  target_audience: string;
  prerequisites: string;
  course_outline: string;
  objectives: string[];
  course_contents: string;
  methodology: string;
  certification: string;
  hrdcorp_approval_no: string;
  status: boolean;
  image_url?: string;
}

export default function NonTechnicalTrainingClient({ course }: { course: TrainingCourse }) {
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
        Training Inquiry: ${course.title}
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
    if (!course.price) return;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: course.title,
          description: course.description,
          price: course.price,
          serviceId: course.id,
          serviceType: 'non-technical-training'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setStatus('error');
      setErrorMessage('Payment system is currently unavailable. Please contact us directly.');
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
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                Non-Technical Training
              </span>
              {course.price && (
                <span className="text-2xl font-bold text-blue-600">
                  RM {course.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {course.title}
            </h1>
            
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              {course.duration && (
                <div className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full">
                  Duration: {course.duration}
                </div>
              )}
              {course.hrdcorp_approval_no && (
                <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                  HRDCorp Claimable
                </div>
              )}
              {course.certification && (
                <div className="bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-2 rounded-full">
                  Certification Included
                </div>
              )}
            </div>

            {course.objectives && course.objectives.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Course Objectives</h3>
                <div className="bg-green-50 p-6 rounded-lg">
                  <ul className="space-y-3">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-3 mt-1">•</span>
                        <span className="text-gray-700 leading-relaxed">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {course.target_audience && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Target Audience</h3>
                  <p className="text-gray-700 leading-relaxed">{course.target_audience}</p>
                </div>
              )}
              {course.prerequisites && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">Prerequisites</h3>
                  <p className="text-gray-700 leading-relaxed">{course.prerequisites}</p>
                </div>
              )}
            </div>

            {course.course_contents && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Course Contents</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {course.course_contents}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {course.course_outline && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Course Outline</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="prose prose-gray max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: course.course_outline }} />
                  </div>
                </div>
              </div>
            )}

            {course.methodology && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Training Methodology</h3>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{course.methodology}</p>
                </div>
              </div>
            )}

            {course.certification && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Certification</h3>
                <div className="bg-green-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{course.certification}</p>
                </div>
              </div>
            )}

            {course.hrdcorp_approval_no && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">HRDCorp Approval</h3>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    This course is HRDCorp claimable. Approval Number: <strong>{course.hrdcorp_approval_no}</strong>
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg">
              {course.price && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">RM {course.price.toFixed(2)}</h3>
                  <button 
                    onClick={handlePayment}
                    className="w-full bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
                  >
                    Enroll Now
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {course.price ? 'Have a Question?' : 'Request a Quote'}
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
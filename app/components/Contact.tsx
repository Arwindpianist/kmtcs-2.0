'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeYAVbow2an0OZnqb0Ag8jhl3DydkJ6UcLw2bVSrDGlqLkn6A/viewform'

    const urlParams = new URLSearchParams({
      'entry.2092238618': formData.name,
      'entry.1556369182': formData.email,
      'entry.479301265': formData.company,
      'entry.602836413': formData.message
    })

    window.open(`${googleFormUrl}?usp=pp_url&${urlParams.toString()}`, '_blank')
    
    setFormData({
      name: '',
      email: '',
      company: '',
      message: ''
    })
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Contact Us</h2>
        <div className="max-w-md mx-auto bg-baby-blue bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-blue-900 mb-2">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-blue-900 mb-2">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="company" className="block text-blue-900 mb-2">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-blue-900 mb-2">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition duration-300"
            >
              Send Message
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  )
}


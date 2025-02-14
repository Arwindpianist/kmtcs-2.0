'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BackgroundLines from '../components/BackgroundLines';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get Google Form URL from environment variables
    const googleFormUrl = process.env.NEXT_PUBLIC_CONTACT_FORM_URL!;
    
    // Map form data to Google Form entry IDs
    const urlParams = new URLSearchParams({
      'entry.2092238618': formData.name,       // Replace with actual entry ID for name
      'entry.1556369182': formData.email,      // Replace with email entry ID
      'entry.479301265': formData.company,    // Replace with company entry ID
      'entry.602836413': formData.message     // Replace with message entry ID
    });

    // Open pre-filled form in new tab
    window.open(`${googleFormUrl}?usp=pp_url&${urlParams.toString()}`, '_blank');
    
    // Optional: Clear form after submission
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <BackgroundLines />
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">Contact Us</h1>
        
        <div className="max-w-2xl mx-auto bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-blue-900 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-blue-900 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="company" className="block text-blue-900 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-blue-900 mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-baby-blue/30 backdrop-filter backdrop-blur-lg border border-baby-blue/20 text-blue-800 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-800 hover:text-white hover:border-blue/40 transition-all duration-300 inline-block relative z-50 shadow-md hover:shadow-lg"
            >
              Send Message
            </motion.button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-blue-800 mb-6">
            Email: info@kmtcs.com.my<br />
            +6010-217 5360 (Mobile/WhatsApp)<br />
            Address: D5­-10-­3A EVERGREEN PARK SCOT PINE,<br />
            PERSIARAN SL 1, BANDAR SUNGAI LONG,<br />
            43000 KAJANG, SELANGOR MALAYSIA.
          </p>
        </div>
      </div>
    </div>
  );
}
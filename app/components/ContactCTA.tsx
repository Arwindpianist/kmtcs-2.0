'use client';

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

const ContactCTA = () => {
  return (
    <motion.section 
      className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Business?
        </h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8">
          Contact us today to learn how KMTCS can help you achieve significant and lasting improvements in your organization's operational performance.
        </p>
        <Link href="/contact" className="inline-flex items-center bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
          Get in Touch <FiArrowRight className="ml-2" />
        </Link>
      </div>
    </motion.section>
  )
}

export default ContactCTA


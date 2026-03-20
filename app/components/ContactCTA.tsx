'use client';

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { Button } from '@/app/components/ui/button'

const ContactCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-blue-50 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Contact us today to learn how KMTCS can help you achieve significant and lasting improvements in your organization's operational performance.
          </p>
        <Button 
          asChild 
          variant="secondary"
          size="lg"
          className="bg-white text-primary hover:bg-gray-50 shadow-2xl text-lg px-10 py-6"
        >
          <Link href="/contact">
            Get in Touch <FiArrowRight className="ml-3 w-5 h-5" />
          </Link>
        </Button>
        </div>
      </motion.div>
    </section>
  )
}

export default ContactCTA


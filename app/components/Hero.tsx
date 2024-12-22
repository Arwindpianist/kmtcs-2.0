'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-b from-baby-blue to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl px-4"
      >
        <h1 className="text-3xl md:text-6xl font-bold text-blue-900 mb-4">
          Welcome to KM Training & Consulting Services (KMTCS)
        </h1>
        <p className="text-xl md:text-2xl text-blue-800 mb-8">
          Engineering, Management, and IT Consulting & Training for Private and Public Enterprises
        </p>
        <p className="text-lg text-blue-700 mb-8">
          We guide, coach, and train our clients to make significant and lasting improvements in operations performance through scientific thinking and data-driven decision-making.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/services" className="bg-blue-900 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition duration-300">
            Explore Our Services
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}


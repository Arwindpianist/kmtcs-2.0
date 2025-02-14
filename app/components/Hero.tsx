'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const certifications = [
  'hrd-claimable.svg',
  'mof.svg',
  'sme.svg',
  'ssm.svg',
  'hrd-registered.svg',
]

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl w-full"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-4 px-2 leading-tight">
          Welcome to KM Training & Consulting Services (KMTCS)
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-blue-800 mb-6 sm:mb-8 mx-auto max-w-3xl px-4 sm:px-0 leading-relaxed">
          Engineering, Management, and IT Consulting & Training for Private and Public Enterprises. 
          We are an accredited Training Provider registered with the SSM, HRDCorp, SMECorp and 
          Ministry of Finance (MoF).
        </p>

        {/* Certifications */}
        <motion.div 
          className="flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {certifications.map((cert, index) => (
            <motion.img
              key={cert}
              src={`/kmtcs-certs/${cert}`}
              alt={cert.replace('.svg', '')}
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 p-1.5 sm:p-2"
              animate={{
                y: [-2, 2, -2],
              }}
              transition={{
                duration: 2 + index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            />
          ))}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 sm:mt-6"
        >
          <Link 
            href="/services" 
            className="bg-baby-blue/30 backdrop-filter backdrop-blur-lg border border-baby-blue/20 text-blue-800 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-800 hover:text-white hover:border-blue/40 transition-all duration-300 inline-block relative z-50 shadow-md hover:shadow-lg"
          >
            Explore Our Services
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
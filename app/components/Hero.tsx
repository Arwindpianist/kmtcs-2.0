'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import BackgroundLines from './BackgroundLines'
import Image from 'next/image'

const certifications = [
  { name: 'HRD Corp Registered', logo: '/kmtcs-certs/hrd-registered.svg' },
  { name: 'HRD Corp Claimable', logo: '/kmtcs-certs/hrd-claimable.svg' },
  { name: 'MOF', logo: '/kmtcs-certs/mof.svg' },
  { name: 'SME', logo: '/kmtcs-certs/sme.svg' },
  { name: 'SSM', logo: '/kmtcs-certs/ssm.svg' },
]

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-blue-100 py-32 text-center overflow-hidden">
      <BackgroundLines />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="text-blue-600">KM Training &amp; Consulting Services</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for Engineering, Management, and IT training. We are an accredited provider registered with SSM, MOF, and HRDCorp.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          <Link 
            href="/services"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Explore Our Services
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <h3 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4">
            Our Certifications
          </h3>
          <div className="flex justify-center items-center space-x-8">
            {certifications.map(cert => (
              <div key={cert.name} className="relative h-16 w-32 grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={cert.logo}
                  alt={cert.name}
                  fill
                  className="object-contain"
                  title={cert.name}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
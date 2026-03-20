'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import BackgroundLines from './BackgroundLines'
import Image from 'next/image'
import { Button } from '@/app/components/ui/button'

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
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
            Welcome to <span className="text-blue-600">KM Training &amp; Consulting Services</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
            Your trusted partner for Engineering, Management, and IT training. We are an accredited provider registered with SSM, MOF, and HRDCorp.
          </p>
        </motion.div>
        
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button 
              asChild
              size="lg"
              className="text-lg md:text-xl px-10 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Link href="/services">
                Explore Our Services
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
      </div>
    </section>
  )
}

export default Hero
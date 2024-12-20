'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Hero from './components/Hero'
import ServicesOverview from './components/ServicesOverview'
import AboutPreview from './components/AboutPreview'
import ContactCTA from './components/ContactCTA'
import TrainingCalendar from './components/TrainingCalendar'

export default function Home() {
  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [aboutRef, aboutInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div className="min-h-screen">
      <Hero />
      <motion.div
        ref={servicesRef}
        initial={{ opacity: 0, y: 50 }}
        animate={servicesInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <ServicesOverview />
      </motion.div>
      <motion.div
        ref={aboutRef}
        initial={{ opacity: 0, y: 50 }}
        animate={aboutInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <AboutPreview />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TrainingCalendar />
      </motion.div>
      <motion.div
        ref={contactRef}
        initial={{ opacity: 0, y: 50 }}
        animate={contactInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <ContactCTA />
      </motion.div>
    </div>
  )
}


'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Hero from './components/Hero'
import ServicesOverview from './components/ServicesOverview'
import AboutPreview from './components/AboutPreview'
import ContactCTA from './components/ContactCTA'
import TrainingCalendar from './components/TrainingCalendar'
import Client from './components/Client'
import ClientCarousel from './components/ClientCarousel'
import Testimonials from './components/Testimonials'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BackgroundLines from './components/BackgroundLines';
import { useEffect } from 'react';

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

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    // Add smooth scrolling behavior to html element
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <main className="no-scrollbar">
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <BackgroundLines />
        <Hero />
      </section>
      
      <motion.section
        ref={servicesRef}
        initial={{ opacity: 0, y: 50 }}
        animate={servicesInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="min-h-screen w-full flex items-center justify-center"
      >
        <ServicesOverview />
      </motion.section>

      <motion.section
        ref={aboutRef}
        initial={{ opacity: 0, y: 50 }}
        animate={aboutInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="min-h-screen w-full flex items-center justify-center"
      >
        <AboutPreview />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen w-full flex items-center justify-center"
      >
        <TrainingCalendar />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen w-full flex items-center justify-center"
      >
        <Client />
      </motion.section>

      <motion.section
        ref={testimonialsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="min-h-screen w-full flex items-center justify-center"
      >
        <Testimonials />
      </motion.section>

      <motion.section
        ref={contactRef}
        initial={{ opacity: 0, y: 50 }}
        animate={contactInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="min-h-screen w-full flex items-center justify-center"
      >
        <ContactCTA />
      </motion.section>
    </main>
  )
}


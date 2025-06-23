// app/page.tsx (Server Component)
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Hero from './components/Hero'
import ServicesOverview from './components/ServicesOverview'
import AboutPreview from './components/AboutPreview'
import ClientCarousel from './components/ClientCarousel'
import Testimonials from './components/Testimonials'
import TrainingCalendar from './components/TrainingCalendar'
import ContactCTA from './components/ContactCTA'

// Re-export the ServiceItem type for clarity, or define it in a shared types file
export interface ServiceItem {
  id: string
  title: string
  description: string
  price: number | null
  duration?: string
  category: string
  serviceType: 'technical-training' | 'non-technical-training' | 'consulting'
}

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch all services data in parallel
  const [
    { data: technicalTrainings },
    { data: nonTechnicalTrainings },
    { data: consultingServices }
  ] = await Promise.all([
    supabase.from('technical_trainings').select('id, title, description, price, duration').eq('status', true).limit(3),
    supabase.from('non_technical_trainings').select('id, title, description, price, duration').eq('status', true).limit(3),
    supabase.from('consulting_services').select('id, title, description, price').eq('status', true).limit(3)
  ]);

  // Combine and format the services
  const allServices: ServiceItem[] = [
    ...(technicalTrainings || []).map(item => ({
      ...item,
      category: 'Technical Training',
      serviceType: 'technical-training' as const
    })),
    ...(nonTechnicalTrainings || []).map(item => ({
      ...item,
      category: 'Non-Technical Training',
      serviceType: 'non-technical-training' as const
    })),
    ...(consultingServices || []).map(item => ({
      ...item,
      category: 'Consulting',
      serviceType: 'consulting' as const
    }))
  ]

  // Shuffle and select a subset to display
  const shuffledServices = allServices.sort(() => 0.5 - Math.random()).slice(0, 6)

  return (
    <main>
      <Hero />
      <ServicesOverview services={shuffledServices} />
      <AboutPreview />
      <ClientCarousel />
      <Testimonials />
      <TrainingCalendar />
      <ContactCTA />
    </main>
  )
}


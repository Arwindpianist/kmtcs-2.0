// app/page.tsx (Server Component)
import type { Metadata } from 'next'
import Hero from './components/Hero'
import ServicesOverview from './components/ServicesOverview'
import AboutPreview from './components/AboutPreview'
import ClientCarousel from './components/ClientCarousel'
import Testimonials from './components/Testimonials'
import TrainingCalendar from './components/TrainingCalendar'
import ContactCTA from './components/ContactCTA'

export const metadata: Metadata = {
  title: 'KMTCS - Leading Training & Consulting Services in Malaysia',
  description: 'KMTCS is Malaysia\'s premier training and consulting services provider with over 30 years of experience. Accredited by SSM, HRDCorp, SMECorp, and Ministry of Finance (MoF). Expert training in engineering, management, and IT for corporate and government sectors.',
  keywords: [
    'training services Malaysia',
    'consulting services Malaysia',
    'corporate training',
    'engineering training',
    'management training',
    'IT training',
    'HRDCorp training provider',
    'SMECorp registered',
    'Ministry of Finance accredited',
    'professional development Malaysia',
    'business consulting Malaysia',
    'SA0571127-K',
    '30 years experience'
  ],
  openGraph: {
    title: 'KMTCS - Leading Training & Consulting Services in Malaysia',
    description: 'Premier training and consulting services provider in Malaysia with over 30 years of experience. Accredited by SSM, HRDCorp, SMECorp, and Ministry of Finance (MoF).',
    url: 'https://www.kmtcs.com.my',
    siteName: 'KMTCS',
    images: [
      {
        url: '/KMTCS-NEW-LOGO.svg',
        width: 1200,
        height: 630,
        alt: 'KMTCS - Training & Consulting Services',
      },
    ],
    locale: 'en_MY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KMTCS - Leading Training & Consulting Services in Malaysia',
    description: 'Premier training and consulting services provider in Malaysia with over 30 years of experience. Accredited by SSM, HRDCorp, SMECorp, and Ministry of Finance (MoF).',
    images: ['/KMTCS-NEW-LOGO.svg'],
  },
  alternates: {
    canonical: 'https://www.kmtcs.com.my',
  },
  other: {
    'geo.region': 'MY',
    'geo.placename': 'Malaysia',
    'geo.position': '3.1390;101.6869',
    'ICBM': '3.1390, 101.6869',
  },
}

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

async function fetchServices() {
  try {
    console.log('Fetching services for home page...');
    
    // Get the base URL for API calls
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Fetch all services data using API routes with absolute URLs
    const [technicalResponse, nonTechnicalResponse, consultingResponse] = await Promise.all([
      fetch(`${baseUrl}/api/technical-trainings?status=true&limit=3`),
      fetch(`${baseUrl}/api/non-technical-trainings?status=true&limit=3`),
      fetch(`${baseUrl}/api/consulting-services?status=true&limit=3`)
    ]);

    // Check if responses are ok
    if (!technicalResponse.ok) {
      console.error('Technical trainings API error:', technicalResponse.status, technicalResponse.statusText);
    }
    if (!nonTechnicalResponse.ok) {
      console.error('Non-technical trainings API error:', nonTechnicalResponse.status, nonTechnicalResponse.statusText);
    }
    if (!consultingResponse.ok) {
      console.error('Consulting services API error:', consultingResponse.status, consultingResponse.statusText);
    }

    const technicalData = await technicalResponse.json();
    const nonTechnicalData = await nonTechnicalResponse.json();
    const consultingData = await consultingResponse.json();

    console.log('Technical trainings:', technicalData.data?.length || 0);
    console.log('Non-technical trainings:', nonTechnicalData.data?.length || 0);
    console.log('Consulting services:', consultingData.data?.length || 0);

    // Log any errors from the API responses
    if (technicalData.error) console.error('Technical trainings error:', technicalData.error);
    if (nonTechnicalData.error) console.error('Non-technical trainings error:', nonTechnicalData.error);
    if (consultingData.error) console.error('Consulting services error:', consultingData.error);

    // Combine and format the services
    const allServices: ServiceItem[] = [
      ...(technicalData.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        duration: item.duration || '',
        category: 'Technical Training',
        serviceType: 'technical-training' as const
      })),
      ...(nonTechnicalData.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        duration: item.duration || '',
        category: 'Non-Technical Training',
        serviceType: 'non-technical-training' as const
      })),
      ...(consultingData.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        duration: item.duration || '',
        category: 'Consulting',
        serviceType: 'consulting' as const
      }))
    ];

    console.log('Total services found:', allServices.length);
    return allServices;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function Home() {
  // Fetch services using API routes
  const allServices = await fetchServices();

  // Log the raw data for debugging
  console.log('Raw services data:', JSON.stringify(allServices, null, 2));

  // Shuffle and select a subset to display
  const shuffledServices = allServices.sort(() => 0.5 - Math.random()).slice(0, 6)

  console.log('Services being passed to component:', shuffledServices.length);
  console.log('Sample service:', shuffledServices[0]);

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


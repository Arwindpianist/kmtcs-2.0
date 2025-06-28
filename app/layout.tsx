// app/layout.tsx (Server Component)
import './globals.css'
import { Inter } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from 'next'
import LayoutWrapper from './components/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'KMTCS - KM Training & Consulting Services | Malaysia',
    template: '%s | KMTCS'
  },
  description:
    'KMTCS is Malaysia\'s premier training and consulting services provider with over 30 years of experience. Accredited by SSM, HRDCorp, SMECorp, and Ministry of Finance (MoF). Expert training in engineering, management, and IT for corporate and government sectors.',
  keywords: [
    'training services Malaysia',
    'consulting services Malaysia',
    'engineering training',
    'management training',
    'IT training Malaysia',
    'HRDCorp training provider',
    'SMECorp registered',
    'Ministry of Finance accredited',
    'professional development',
    'corporate training',
    'technical training',
    'non-technical training',
    'business consulting',
    'Malaysia training company',
    'KMTCS',
    'KM Training & Consulting Services',
    'SA0571127-K',
    'Kajang training',
    'Selangor consulting',
    'Malaysia corporate training'
  ],
  authors: [{ name: 'KMTCS' }],
  creator: 'KMTCS',
  publisher: 'KMTCS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.kmtcs.com.my'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://www.kmtcs.com.my',
    siteName: 'KMTCS - KM Training & Consulting Services',
    title: 'KMTCS - Leading Training & Consulting Services in Malaysia',
    description: 'Premier training and consulting services provider in Malaysia with over 30 years of experience. Accredited by SSM, HRDCorp, SMECorp, and Ministry of Finance (MoF).',
    images: [
      {
        url: '/KMTCS-NEW-LOGO.svg',
        width: 1200,
        height: 630,
        alt: 'KMTCS Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KMTCS - Leading Training & Consulting Services in Malaysia',
    description: 'Premier training and consulting services provider in Malaysia with over 30 years of experience. Accredited by SSM, HRDCorp, SMECorp, and Ministry of Finance (MoF).',
    images: ['/KMTCS-NEW-LOGO.svg'],
    creator: '@kmtcs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual Google verification code
    yandex: 'your-yandex-verification-code', // Replace with actual Yandex verification code
    yahoo: 'your-yahoo-verification-code', // Replace with actual Yahoo verification code
  },
  other: {
    // Enhanced GEO targeting
    'geo.region': 'MY-10', // Malaysia - Selangor
    'geo.placename': 'Kajang, Selangor, Malaysia',
    'geo.position': '3.1390;101.6869', // Kuala Lumpur area coordinates
    'ICBM': '3.1390, 101.6869',
    'geo.country': 'MY',
    'geo.state': 'Selangor',
    'geo.city': 'Kajang',
    'geo.postalcode': '43000',
    
    // Regional targeting
    'region': 'MY-10',
    'country': 'MY',
    'state': 'Selangor',
    'city': 'Kajang',
    'postal-code': '43000',
    
    // Business location
    'business:location': 'D5-10-3A Evergreen Park Scot Pine, Persiaran SL 1, Bandar Sungai Long, 43000 Kajang, Selangor, Malaysia',
    'business:phone': '+60-12-212-5360',
    'business:email': 'info@kmtcs.com.my',
    'business:registration': 'SA0571127-K',
    'business:myco-id': '202103259999',
    
    // Dublin Core metadata
    'DC.title': 'KMTCS - KM Training & Consulting Services',
    'DC.creator': 'KMTCS',
    'DC.subject': 'Training and Consulting Services',
    'DC.description': 'Expert training and consulting services in engineering, management, and IT',
    'DC.publisher': 'KMTCS',
    'DC.contributor': 'KMTCS',
    'DC.date': '2025',
    'DC.type': 'Text',
    'DC.format': 'text/html',
    'DC.identifier': 'https://www.kmtcs.com.my',
    'DC.language': 'en-MY',
    'DC.coverage': 'Malaysia, Selangor, Kajang',
    'DC.rights': 'Copyright © 2025 KMTCS. All rights reserved.',
    
    // Additional GEO targeting
    'place:location': 'Kajang, Selangor, Malaysia',
    'place:coordinates': '3.1390, 101.6869',
    'place:timezone': 'Asia/Kuala_Lumpur',
    'place:currency': 'MYR',
    'place:language': 'en-MY',
  },
  icons: {
    icon: [
      {
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
        url: '/favicon.svg'
      },
      {
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
        url: '/favicon.svg'
      }
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-MY">
      <head>
        {/* Enhanced GEO targeting meta tags */}
        <meta name="geo.region" content="MY-10" />
        <meta name="geo.placename" content="Kajang, Selangor, Malaysia" />
        <meta name="geo.position" content="3.1390;101.6869" />
        <meta name="ICBM" content="3.1390, 101.6869" />
        <meta name="geo.country" content="MY" />
        <meta name="geo.state" content="Selangor" />
        <meta name="geo.city" content="Kajang" />
        <meta name="geo.postalcode" content="43000" />
        
        {/* Regional targeting */}
        <meta name="region" content="MY-10" />
        <meta name="country" content="MY" />
        <meta name="state" content="Selangor" />
        <meta name="city" content="Kajang" />
        <meta name="postal-code" content="43000" />
        
        {/* Business location */}
        <meta name="business:location" content="D5-10-3A Evergreen Park Scot Pine, Persiaran SL 1, Bandar Sungai Long, 43000 Kajang, Selangor, Malaysia" />
        <meta name="business:phone" content="+60-12-212-5360" />
        <meta name="business:email" content="info@kmtcs.com.my" />
        <meta name="business:registration" content="SA0571127-K" />
        <meta name="business:myco-id" content="202103259999" />
        
        {/* Place metadata */}
        <meta name="place:location" content="Kajang, Selangor, Malaysia" />
        <meta name="place:coordinates" content="3.1390, 101.6869" />
        <meta name="place:timezone" content="Asia/Kuala_Lumpur" />
        <meta name="place:currency" content="MYR" />
        <meta name="place:language" content="en-MY" />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "KMTCS - KM Training & Consulting Services",
              "url": "https://www.kmtcs.com.my",
              "logo": "https://www.kmtcs.com.my/KMTCS-NEW-LOGO.svg",
              "description": "Leading provider of engineering, management, and IT consulting and training services with over 30 years of experience. Accredited by SSM, HRDCorp, SMECorp, and Ministry of Finance (MoF).",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "D5-10-3A Evergreen Park Scot Pine, Persiaran SL 1, Bandar Sungai Long",
                "addressLocality": "Kajang",
                "addressRegion": "Selangor",
                "postalCode": "43000",
                "addressCountry": "MY"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "telephone": "+60-12-212-5360",
                "email": "info@kmtcs.com.my",
                "availableLanguage": ["English", "Malay"]
              },
              "sameAs": [
                "https://www.linkedin.com/company/kmtcs",
                "https://www.facebook.com/kmtcs"
              ],
              "foundingDate": "1994",
              "areaServed": "MY",
              "serviceArea": {
                "@type": "Country",
                "name": "Malaysia"
              },
              "taxID": "SA0571127-K",
              "leiCode": "202103259999"
            })
          }}
        />
        
        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "KMTCS - KM Training & Consulting Services",
              "image": "https://www.kmtcs.com.my/KMTCS-NEW-LOGO.svg",
              "description": "Accredited Training Provider offering expert training and consulting services in engineering, management, and IT with over 30 years of experience.",
              "url": "https://www.kmtcs.com.my",
              "telephone": "+60-12-212-5360",
              "email": "info@kmtcs.com.my",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "D5-10-3A Evergreen Park Scot Pine, Persiaran SL 1, Bandar Sungai Long",
                "addressLocality": "Kajang",
                "addressRegion": "Selangor",
                "postalCode": "43000",
                "addressCountry": "MY"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 3.1390,
                "longitude": 101.6869
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday", 
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              "priceRange": "$$",
              "currenciesAccepted": "MYR",
              "paymentAccepted": "Cash, Credit Card, Bank Transfer",
              "taxID": "SA0571127-K",
              "leiCode": "202103259999",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Training Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Technical Training"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Non-Technical Training"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Consulting Services"
                    }
                  }
                ]
              }
            })
          }}
        />

        {/* Structured Data for Place */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Place",
              "name": "KMTCS Office",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "D5-10-3A Evergreen Park Scot Pine, Persiaran SL 1, Bandar Sungai Long",
                "addressLocality": "Kajang",
                "addressRegion": "Selangor",
                "postalCode": "43000",
                "addressCountry": "MY"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 3.1390,
                "longitude": 101.6869
              },
              "containedInPlace": {
                "@type": "Place",
                "name": "Kajang",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Kajang",
                  "addressRegion": "Selangor",
                  "addressCountry": "MY"
                }
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}

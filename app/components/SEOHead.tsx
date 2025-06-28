'use client'

import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'service'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  structuredData?: any
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image = '/KMTCS-NEW-LOGO.svg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'KMTCS',
  section,
  tags = [],
  structuredData
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title if provided
    if (title) {
      document.title = title
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description)
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords && keywords.length > 0) {
      metaKeywords.setAttribute('content', keywords.join(', '))
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle && title) {
      ogTitle.setAttribute('content', title)
    }

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription && description) {
      ogDescription.setAttribute('content', description)
    }

    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage && image) {
      ogImage.setAttribute('content', `https://www.kmtcs.com.my${image}`)
    }

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl && url) {
      ogUrl.setAttribute('content', url)
    }

    const ogType = document.querySelector('meta[property="og:type"]')
    if (ogType) {
      ogType.setAttribute('content', type)
    }

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle && title) {
      twitterTitle.setAttribute('content', title)
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription && description) {
      twitterDescription.setAttribute('content', description)
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]')
    if (twitterImage && image) {
      twitterImage.setAttribute('content', `https://www.kmtcs.com.my${image}`)
    }

    // Add structured data if provided
    if (structuredData) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(structuredData)
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [title, description, keywords, image, url, type, structuredData])

  return null
}

// Predefined structured data templates
export const structuredDataTemplates = {
  service: (data: {
    name: string
    description: string
    url: string
    image?: string
    provider: string
    areaServed: string
    category: string
  }) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "image": data.image || "https://www.kmtcs.com.my/KMTCS-NEW-LOGO.svg",
    "provider": {
      "@type": "Organization",
      "name": data.provider,
      "url": "https://www.kmtcs.com.my"
    },
    "areaServed": {
      "@type": "Country",
      "name": data.areaServed
    },
    "category": data.category,
    "serviceType": "Training and Consulting"
  }),

  article: (data: {
    title: string
    description: string
    url: string
    image?: string
    author: string
    publishedTime: string
    modifiedTime?: string
    section?: string
    tags?: string[]
  }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "image": data.image || "https://www.kmtcs.com.my/KMTCS-NEW-LOGO.svg",
    "url": data.url,
    "author": {
      "@type": "Organization",
      "name": data.author,
      "url": "https://www.kmtcs.com.my"
    },
    "publisher": {
      "@type": "Organization",
      "name": "KMTCS",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.kmtcs.com.my/KMTCS-NEW-LOGO.svg"
      }
    },
    "datePublished": data.publishedTime,
    "dateModified": data.modifiedTime || data.publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url
    },
    "articleSection": data.section,
    "keywords": data.tags?.join(', ')
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),

  faq: (questions: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  })
} 
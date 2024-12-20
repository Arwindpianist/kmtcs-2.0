'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Article } from '../types/article'

export default function News() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => setArticles(data))
  }, [])

  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">Latest News & Training Programs</h1>
        <div className="space-y-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-blue-900">{article.title}</h2>
                {article.content.hrdCorpNo && (
                  <span className="bg-blue-900 text-white text-sm px-3 py-1 rounded-full">
                    HRDCorp Claimable
                  </span>
                )}
              </div>
              <p className="text-blue-800 mb-4">{article.description}</p>
              {article.content.duration && (
                <p className="text-blue-700 mb-4">
                  Duration: {article.content.duration}
                </p>
              )}
              <Link 
                href={`/training/${article.id}`} 
                className="text-blue-900 font-semibold hover:underline inline-flex items-center"
              >
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


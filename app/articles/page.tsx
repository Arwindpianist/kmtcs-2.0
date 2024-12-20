"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import type { Article } from '@/app/types/article';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">Articles</h1>
        <div className="space-y-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-900">{article.title}</h2>
              <p className="text-blue-800 mt-2">{article.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
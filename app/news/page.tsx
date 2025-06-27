'use client';

import { motion } from 'framer-motion';
import NewsCard from '@/app/components/NewsCard';
import BackgroundLines from '../components/BackgroundLines';
import { allNews } from '@/app/lib/newsService';

export default function NewsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-blue-100 py-32 text-center overflow-hidden">
        <BackgroundLines />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Latest <span className="text-blue-600">News & Updates</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed with the latest news, industry updates, and insights from HRDCorp and other relevant authorities
            </p>
          </motion.div>
        </div>
      </section>

      {/* News List Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              HRDCorp News & Announcements
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              {allNews.length} latest articles from HRDCorp
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {allNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <NewsCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

const AboutPreview = () => {
  return (
    <motion.section 
      className="py-20 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="prose lg:prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About KMTCS</h2>
            <p className="text-gray-600">
              KM Training and Consulting Services (KMTCS) is a leading provider of engineering, management, and IT consulting and training services. We serve a diverse range of clients from private and public enterprises, helping them achieve significant and lasting improvements in their operational performance.
            </p>
            <p className="text-gray-600">
              Our approach is rooted in scientific thinking and data-driven decision-making. We specialize in providing our clients with the knowledge and tools to optimize their processes and drive sustainable growth.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                Learn More About Us <FiArrowRight className="ml-2" />
            </Link>
          </div>
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-lg text-gray-800">Our Mission</h4>
              <p className="text-gray-600 mt-2">To empower organizations through expert-led training and innovative consulting, fostering a culture of continuous improvement and operational excellence.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-lg text-gray-800">Our Vision</h4>
              <p className="text-gray-600 mt-2">To be the region's most trusted partner for transformative business solutions, recognized for our commitment to quality, integrity, and client success.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutPreview;
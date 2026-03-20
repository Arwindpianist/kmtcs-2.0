'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

const AboutPreview = () => {
  return (
    <section className="py-20 bg-background-primary">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
      >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="prose lg:prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-foreground mb-4">About KMTCS</h2>
            <p className="text-muted-foreground break-words leading-relaxed">
              KM Training and Consulting Services (KMTCS) is a leading provider of engineering, management, and IT consulting and training services. We serve a diverse range of clients from private and public enterprises, helping them achieve significant and lasting improvements in their operational performance.
            </p>
            <p className="text-muted-foreground break-words leading-relaxed mt-4">
              Our approach is rooted in scientific thinking and data-driven decision-making. We specialize in providing our clients with the knowledge and tools to optimize their processes and drive sustainable growth.
            </p>
            <Button asChild variant="link" className="mt-6 text-lg" size="lg">
              <Link href="/about">
                Learn More About Us
                <FiArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-6">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed break-words">
                  To empower organizations through expert-led training and innovative consulting, fostering a culture of continuous improvement and operational excellence.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl break-words">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed break-words">
                  To be the region's most trusted partner for transformative business solutions, recognized for our commitment to quality, integrity, and client success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </motion.div>
    </section>
  );
};

export default AboutPreview;
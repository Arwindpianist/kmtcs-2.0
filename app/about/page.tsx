'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiZap, FiHeart, FiUsers, FiAward } from 'react-icons/fi';
import ContactCTA from '../components/ContactCTA';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

// Section for the main "About Us" content
function AboutSection() {
  return (
    <section className="bg-background py-14 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            Pioneering Growth Through Knowledge and Innovation
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
              KM Training and Consulting Services (KMTCS) is a leading provider of engineering, management, and IT consulting and training services. We serve a diverse range of private and public enterprises, helping them achieve significant and lasting improvements in their operations performance.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Our approach is rooted in scientific thinking and data-driven decision-making. We guide, coach, and train our clients to leverage modern tools and application software to optimize their processes and drive sustainable growth.
            </p>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

// Section for Mission and Values
function MissionAndValues() {
  const values = [
    { icon: <FiAward />, title: 'Excellence', description: 'We strive for the highest standards in all our services.' },
    { icon: <FiZap />, title: 'Innovation', description: 'We embrace new ideas and technologies to stay ahead of the curve.' },
    { icon: <FiHeart />, title: 'Integrity', description: 'We conduct our business with honesty and transparency.' },
    { icon: <FiUsers />, title: 'Collaboration', description: 'We work closely with our clients to achieve their goals.' },
  ];

  return (
    <section className="bg-muted/50 py-14 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-10 lg:gap-16 md:grid-cols-2 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <Card className="h-full border-2 transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <FiTarget className="text-primary" size={28} />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed break-words">
                  To empower organizations with the knowledge, skills, and tools they need to excel in today's competitive business environment. We are committed to delivering high-quality consulting and training services that drive measurable results and long-term success for our clients.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
              {values.map((value, index) => (
                <div key={value.title} className="h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-2 transition-all hover:border-primary/20 hover:shadow-md">
                      <CardContent className="p-5 sm:p-6 h-full">
                        <div className="flex items-start gap-4">
                          <div className="text-primary text-3xl mt-1 flex-shrink-0">{value.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-foreground mb-2">{value.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed break-words">{value.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Section for "Why Choose Us"
function WhyChooseUs() {
  return (
    <section className="bg-background py-14 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose KMTCS?</h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            With over 30 years of experience, we've formed a firm distinctively equipped to support our training and consulting projects. This holistic focus of the KMTCS produces excellent services for our customers and clients. Our associates and consultants have assisted various companies and enterprises to complete their projects and achieve/exceed targeted improvements.
          </p>
        </motion.div>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3 items-stretch">
          {[
            { title: 'Innovate', desc: 'We innovate our training programs to suit your needs, incorporating the latest knowledge in the respective field.' },
            { title: 'Grow', desc: 'We help you develop a passion for learning. As you use new skills and knowledge, your purpose and career will grow.' },
            { title: 'Transform', desc: 'We transform your people to grow with the organization through well-crafted, innovative training programs.' }
          ].map((item, index) => (
            <div key={item.title} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full border-2 text-center transition-all hover:border-primary/20 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-primary mb-3">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    <p className="text-muted-foreground leading-relaxed break-words">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-muted/30 border-b border-border/60 py-14 sm:py-16 lg:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">About KMTCS</h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="mt-4 text-lg text-muted-foreground">
              Your Trusted Partner in Professional Growth
            </p>
          </motion.div>
        </motion.div>
      </section>

      <AboutSection />
      <MissionAndValues />
      <WhyChooseUs />
      <ContactCTA />
    </div>
  );
}

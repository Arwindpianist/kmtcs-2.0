'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiSend } from 'react-icons/fi';
import { createEnquiry } from '@/app/services/enquiryService';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { logger } from '@/app/lib/logger';

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    status: 'new' as const,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      await createEnquiry({ ...formData, status: 'new' });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '', status: 'new' });
    } catch (error) {
      logger.error('Error submitting enquiry:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="relative border-b border-border/60 bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 bg-white/80">Contact KMTCS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Let&apos;s discuss your training goals</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Send us your requirements and our team will get back with the right training or consulting proposal.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs text-blue-700">
                Typical response time: within 1 business day
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2 border-border/70 shadow-sm bg-white">
            <CardContent className="p-6 space-y-8">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">Talk to our team</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us what you need and we will help map the right training or consulting track.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</p>
                  <a href="mailto:info@kmtcs.com.my" className="mt-2 inline-flex items-center gap-2 text-foreground hover:text-primary">
                    <FiMail className="h-4 w-4" /> info@kmtcs.com.my
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</p>
                  <a href="tel:+60102175360" className="mt-2 inline-flex items-center gap-2 text-foreground hover:text-primary">
                    <FiPhone className="h-4 w-4" /> +6010-217 5360
                  </a>
                </div>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-sm text-muted-foreground">
                  For urgent enquiries, call us directly and mention your preferred training timeline.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-border/70 shadow-sm">
            <CardContent className="p-6 md:p-8">
              {status === 'success' ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5">
                  <h2 className="text-xl font-semibold text-foreground">Message sent successfully</h2>
                  <p className="mt-1 text-muted-foreground">Thank you for contacting us. We will get back to you soon.</p>
                  <Button className="mt-4" onClick={() => setStatus('idle')}>Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-foreground">Send us your requirements</h3>
                    <p className="text-sm text-muted-foreground">Fields marked with * are required.</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-200"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium text-foreground">Company</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        autoComplete="organization"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Enter your company name"
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share your goals, preferred topics, and timeline..."
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-200"
                    />
                  </div>

                  {status === 'error' ? (
                    <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {errorMessage}
                    </p>
                  ) : null}

                  <Button type="submit" disabled={status === 'submitting'} className="w-full bg-blue-600 hover:bg-blue-700">
                    {status === 'submitting' ? 'Sending...' : (
                      <>
                        <FiSend className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

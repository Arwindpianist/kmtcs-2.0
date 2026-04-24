'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { PublicListingPageSkeleton } from '@/app/components/skeletons/PageSkeletons';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number | null;
}

interface ConsultingService {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number | null;
}

function ServiceSection({
  title,
  subtitle,
  categoryLabel,
  hrefBase,
  items,
}: {
  title: string;
  subtitle: string;
  categoryLabel: string;
  hrefBase: string;
  items: Array<TrainingCourse | ConsultingService>;
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground max-w-3xl">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
          >
            <Card className="h-full border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="p-5 h-full flex flex-col">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Badge variant="secondary">{categoryLabel}</Badge>
                  {item.price ? <p className="text-sm font-semibold text-primary">RM {item.price.toFixed(2)}</p> : null}
                </div>
                <h3 className="text-lg font-semibold text-foreground leading-snug">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.duration || 'Duration upon request'}</span>
                  <Button asChild size="sm">
                    <Link href={`${hrefBase}/${item.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-muted-foreground">No items found for this section.</CardContent>
        </Card>
      ) : null}
    </section>
  );
}

export default function ServicesPage() {
  const [technicalTrainings, setTechnicalTrainings] = useState<TrainingCourse[]>([]);
  const [nonTechnicalTrainings, setNonTechnicalTrainings] = useState<TrainingCourse[]>([]);
  const [consultingServices, setConsultingServices] = useState<ConsultingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [technicalResponse, nonTechnicalResponse, consultingResponse] = await Promise.all([
          fetch('/api/technical-trainings?status=true'),
          fetch('/api/non-technical-trainings?status=true'),
          fetch('/api/consulting-services?status=true'),
        ]);

        if (!technicalResponse.ok || !nonTechnicalResponse.ok || !consultingResponse.ok) {
          throw new Error('Failed to fetch services');
        }

        const technicalResult = await technicalResponse.json();
        const nonTechnicalResult = await nonTechnicalResponse.json();
        const consultingResult = await consultingResponse.json();

        setTechnicalTrainings(technicalResult.data || []);
        setNonTechnicalTrainings(nonTechnicalResult.data || []);
        setConsultingServices(consultingResult.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filterData = (data: Array<TrainingCourse | ConsultingService>, term: string) => {
    if (!term) return data;
    return data.filter((item) => item.title.toLowerCase().includes(term.toLowerCase()) || item.description.toLowerCase().includes(term.toLowerCase()));
  };

  const filteredTechnical = useMemo(() => filterData(technicalTrainings, searchTerm), [technicalTrainings, searchTerm]);
  const filteredNonTechnical = useMemo(() => filterData(nonTechnicalTrainings, searchTerm), [nonTechnicalTrainings, searchTerm]);
  const filteredConsulting = useMemo(() => filterData(consultingServices, searchTerm), [consultingServices, searchTerm]);
  const total = filteredTechnical.length + filteredNonTechnical.length + filteredConsulting.length;

  if (loading) return <PublicListingPageSkeleton />;

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-lg w-full">
          <CardContent className="py-8 text-center">
            <p className="text-destructive font-semibold">Unable to load services</p>
            <p className="text-muted-foreground mt-2">{error}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Badge variant="outline" className="mb-4">KMTCS Service Catalogue</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Training and Consulting Services</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover our active service offerings and find the right programme for your team.
              </p>
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{total} result{total === 1 ? '' : 's'} shown</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 space-y-12">
        <ServiceSection
          title="Technical Trainings"
          subtitle="Specialized technical programs for engineering, systems, and operational capability building."
          categoryLabel="Technical Training"
          hrefBase="/services/technical-trainings"
          items={filteredTechnical}
        />
        <ServiceSection
          title="Non-Technical Trainings"
          subtitle="Leadership, communication, and professional development programmes for high-performing teams."
          categoryLabel="Non-Technical Training"
          hrefBase="/services/non-technical-trainings"
          items={filteredNonTechnical}
        />
        <ServiceSection
          title="Consulting Services"
          subtitle="Expert advisory engagements to improve process quality, productivity, and business outcomes."
          categoryLabel="Consulting"
          hrefBase="/services/consulting"
          items={filteredConsulting}
        />
      </section>
    </main>
  );
}
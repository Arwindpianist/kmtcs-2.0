// app/components/TrainingCalendar.tsx
'use client';

import { FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

const TrainingCalendar = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 text-center">
        <FiCalendar className="text-5xl text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Training Calendar
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Stay updated with our upcoming training sessions and events. View our calendar to see scheduled programs and contact us to schedule custom training programs for your organization.
        </p>
        <Button asChild size="lg" className="shadow-md">
          <Link href="/calendar">
            View Calendar
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default TrainingCalendar;

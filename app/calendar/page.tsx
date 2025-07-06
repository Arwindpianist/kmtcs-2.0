import type { Metadata } from 'next';
import SEOHead from '@/app/components/SEOHead';
import CalendarPageClient from './CalendarPageClient';

export const metadata: Metadata = {
  title: 'Training Calendar - KMTCS',
  description: 'View our upcoming training sessions and events. Stay updated with KMTCS training programs and schedule custom training for your organization.',
  keywords: 'training calendar, KMTCS events, training sessions, professional development, Malaysia training',
};

export default function CalendarPage() {
  return <CalendarPageClient />;
} 
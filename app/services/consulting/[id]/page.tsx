import { createSupabaseServerClient } from '@/app/lib/supabase-server';
import { notFound } from 'next/navigation';
import ConsultingClient from './ConsultingClient';

interface ConsultingService {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  status: boolean;
  objectives: string[];
  deliverables: string[];
  methodology: string;
  duration: string;
  target_audience: string;
  benefits: string[];
  image_url?: string;
}

async function getService(id: string): Promise<ConsultingService | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('consulting_services')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  // Ensure arrays are properly initialized
  const service: ConsultingService = {
    ...data,
    objectives: Array.isArray(data.objectives) ? data.objectives : [],
    deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
    benefits: Array.isArray(data.benefits) ? data.benefits : [],
    category: data.category || 'General'
  };

  return service;
}

export default async function ConsultingServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return <ConsultingClient service={service} />;
} 
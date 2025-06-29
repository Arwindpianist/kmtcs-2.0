import { createSupabaseServerClient } from '@/app/lib/supabase-server';
import { notFound } from 'next/navigation';
import ConsultingClient from './ConsultingClient';

interface ConsultingService {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number | null;
  objectives: string[];
  service_contents: string;
  target_audience: string;
  methodology: string;
  deliverables: string;
  status: boolean;
  created_at: string;
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
    deliverables: Array.isArray(data.deliverables) ? data.deliverables : []
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
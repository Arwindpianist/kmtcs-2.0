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
  return data;
}

export default async function ConsultingServicePage({ params }: { params: { id: string } }) {
  const service = await getService(params.id);

  if (!service) {
    notFound();
  }

  return <ConsultingClient service={service} />;
} 
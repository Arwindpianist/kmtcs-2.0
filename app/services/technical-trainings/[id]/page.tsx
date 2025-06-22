import { createSupabaseServerClient } from '@/app/lib/supabase-server';
import { notFound } from 'next/navigation';
import TechnicalTrainingClient from './TechnicalTrainingClient';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  price: number | null;
  duration: string;
  category: string;
  target_audience: string;
  prerequisites: string;
  course_outline: string;
  status: boolean;
  image_url?: string;
}

async function getCourse(id: string): Promise<TrainingCourse | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('technical_trainings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function TechnicalTrainingPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  return <TechnicalTrainingClient course={course} />;
} 
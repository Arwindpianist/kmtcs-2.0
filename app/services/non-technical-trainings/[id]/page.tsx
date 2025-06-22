import { createSupabaseServerClient } from '@/app/lib/supabase-server';
import { notFound } from 'next/navigation';
import NonTechnicalTrainingClient from './NonTechnicalTrainingClient';

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
  image_url: string;
}

async function getCourse(id: string): Promise<TrainingCourse | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('non_technical_trainings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export default async function NonTechnicalTrainingPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  return <NonTechnicalTrainingClient course={course} />;
} 
import { getCatalogRecordById } from '@/app/lib/db/catalogRepository';
import { notFound } from 'next/navigation';
import TechnicalTrainingClient from './TechnicalTrainingClient';

interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  price: number | null;
  duration: string;
  target_audience: string;
  objectives: string[];
  course_contents: string;
  methodology: string;
  certification: string;
  hrdcorp_approval_no: string;
  status: boolean;
}

async function getCourse(id: string): Promise<TrainingCourse | null> {
  const { data, error } = await getCatalogRecordById('technical_trainings', id);

  if (error || !data) {
    return null;
  }
  return data as unknown as TrainingCourse;
}

export default async function TechnicalTrainingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return <TechnicalTrainingClient course={course} />;
} 
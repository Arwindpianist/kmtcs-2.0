import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { trainings, nonTechnicalTrainings } from '@/app/data/trainings';
import { consultingServices } from '@/app/data/consulting';

export const GET = async (
  _request: NextRequest,
  { params }: { params: { serviceType: string; serviceId: string } }
) => {
  try {
    const { serviceType, serviceId } = params;

    let service = null;

    if (serviceType === 'training') {
      const allTrainings = [...trainings, ...nonTechnicalTrainings];
      service = allTrainings.find((t) => t.id.toString() === serviceId) || null;
    } else if (serviceType === 'consulting') {
      service = consultingServices.find((c) => c.id.toString() === serviceId) || null;
    }

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
};

// Optional: Static parameters generation
export async function generateStaticParams() {
  try {
    const trainingParams = [...trainings, ...nonTechnicalTrainings].map((training) => ({
      serviceType: 'training',
      serviceId: training.id.toString(),
    }));

    const consultingParams = consultingServices.map((service) => ({
      serviceType: 'consulting',
      serviceId: service.id.toString(),
    }));

    return [...trainingParams, ...consultingParams];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

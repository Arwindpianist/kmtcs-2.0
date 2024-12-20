import { notFound } from 'next/navigation';
import Link from 'next/link';
import { trainings, nonTechnicalTrainings, type Training } from '@/app/data/trainings';
import { consultingServices, type ConsultingService } from '@/app/data/consulting';

// Type Definitions
type ServiceType = Training | ConsultingService;

function isTraining(service: ServiceType): service is Training {
  return service && 'content' in service;
}

function isConsulting(service: ServiceType): service is ConsultingService {
  return service && 'details' in service;
}

type Props = {
  params: {
    serviceType: string;
    serviceId: string;
  };
};

export default function ServiceDetailPage({ params }: Props) {
  const { serviceType, serviceId } = params;

  let service: ServiceType | null = null;

  if (serviceType === 'training') {
    const allTrainings = [...trainings, ...nonTechnicalTrainings];
    service = allTrainings.find((t) => t.id === Number(serviceId)) || null;
  } else if (serviceType === 'consulting') {
    service = consultingServices.find((c) => c.id === serviceId) || null;
  }

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <div className="container mx-auto px-6">
        <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-8">
          <div className="mb-8">
            <span className="bg-blue-900 text-white text-sm rounded-full px-3 py-1 inline-block mb-4">
              {service.category}
            </span>
            <h1 className="text-4xl font-bold text-blue-900 mb-4">{service.title}</h1>
            <p className="text-lg text-blue-800">{service.description}</p>
          </div>

          {isTraining(service) && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Course Details</h2>
              <p className="text-blue-800">
                <span className="font-semibold">Duration:</span> {service.content.duration}
              </p>
              <p className="text-blue-800">
                <span className="font-semibold">Price:</span> RM {service.content.price}
              </p>
              {service.content.objectives && (
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Objectives</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {service.content.objectives.map((objective, index) => (
                      <li key={index} className="text-blue-800">{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {isConsulting(service) && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">Service Details</h2>
              <ul className="list-disc list-inside space-y-2">
                {service.details.map((detail, index) => (
                  <li key={index} className="text-blue-800">{detail}</li>
                ))}
              </ul>
              <p className="text-blue-800 mt-4">
                <span className="font-semibold">Price:</span> RM {service.price}
              </p>
            </div>
          )}

          <div className="mt-8">
            <Link href="/services" className="text-blue-900 hover:underline">
              ← Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamic Params
export async function generateStaticParams() {
  const trainingParams = [...trainings, ...nonTechnicalTrainings]
    .filter((training) => training.id)
    .map((training) => ({
      serviceType: 'training',
      serviceId: training.id.toString(),
    }));

  const consultingParams = consultingServices
    .filter((service) => service.id)
    .map((service) => ({
      serviceType: 'consulting',
      serviceId: service.id.toString(),
    }));

  console.log('Static Params:', [...trainingParams, ...consultingParams]); // Debugging
  return [...trainingParams, ...consultingParams];
}

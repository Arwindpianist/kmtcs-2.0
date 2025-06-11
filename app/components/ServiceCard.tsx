// components/ServiceCard.tsx
import Link from 'next/link';
import type { Service } from '@/app/types/service';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-gradient-to-br from-teal-100 via-neutral-50 to-sky-100 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{service.short_description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold">Duration: {service.duration}</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {service.service_type}
        </span>
      </div>
      <Link
        href={`/services/${service.service_type}/${service.id}`}
        className="w-full text-center text-blue-700 bg-blue-800/30 backdrop-filter backdrop-blur-lg border border-baby-blue/20 px-6 py-2 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-800 hover:text-white hover:border-blue/40 transition-all duration-300 inline-block relative z-50 shadow-md hover:shadow-lg"
      >
        View Details
      </Link>
    </div>
  );
}
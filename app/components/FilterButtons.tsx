// components/FilterButtons.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ServiceType } from '@/app/types/service';

const SERVICE_TYPES: ServiceType[] = ['consulting', 'technical', 'non-technical'];

interface FilterButtonsProps {
  selectedType: ServiceType | null;
}

export default function FilterButtons({ selectedType }: FilterButtonsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (type: ServiceType | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    return params.toString();
  };

  const getDisplayName = (type: ServiceType) => {
    switch (type) {
      case 'non-technical':
        return 'Non-Technical';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link
        href={`${pathname}?${createQueryString(null)}`}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedType
            ? 'bg-blue-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </Link>
      {SERVICE_TYPES.map((type) => (
        <Link
          key={type}
          href={`${pathname}?${createQueryString(type)}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedType === type
              ? 'bg-blue-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {getDisplayName(type)}
        </Link>
      ))}
    </div>
  );
}
// components/FilterButtons.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const SERVICE_TYPES = ['Technical', 'Non-Technical', 'Consulting'] as const;

interface FilterButtonsProps {
  selectedType: string | null;
}

export default function FilterButtons({ selectedType }: FilterButtonsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (type: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    return params.toString();
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Link
        href={`${pathname}?${createQueryString(null)}`}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          !selectedType
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </Link>
      {SERVICE_TYPES.map((type) => (
        <Link
          key={type}
          href={`${pathname}?${createQueryString(type)}`}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedType === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {type}
        </Link>
      ))}
    </div>
  );
}
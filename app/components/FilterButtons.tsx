// components/FilterButtons.tsx
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function FilterButtons({ 
  types,
  selectedType 
}: { 
  types: string[];
  selectedType: string;
}) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (type: string) => {
    const params = new URLSearchParams();
    if (type !== 'All') params.set('type', type);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {types.map(type => (
        <button
          key={type}
          onClick={() => handleFilter(type)}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedType === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
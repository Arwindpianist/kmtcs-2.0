// components/NewsCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { NewsItem } from '@/app/lib/newsService';
import { newsSources } from '@/app/lib/newsService';

export default function NewsCard({ item }: { item: NewsItem }) {
  const sourceInfo = newsSources[item.source];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      training: 'Training',
      policy: 'Policy'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-theme overflow-hidden group">
      {item.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-secondary font-medium">
            {formatDate(item.date)}
          </span>
          <div className="flex gap-2">
            <span className={`text-xs ${sourceInfo.textColor} ${sourceInfo.bgColor} px-3 py-1 rounded-full font-medium`}>
              {sourceInfo.name}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
              {getCategoryLabel(item.category)}
          </span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {item.title}
        </h3>
        
        <p className="text-secondary text-sm mb-6 line-clamp-3 flex-1">
          {item.summary}
        </p>
      
        <div className="mt-auto">
        <Link
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group/link"
        >
            Read More
            <svg className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        </div>
      </div>
    </div>
  );
}
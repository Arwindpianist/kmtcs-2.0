// components/NewsCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface NewsItem {
  title: string;
  link: string;
  date: string;
  summary: string;
  image?: string;
}

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {item.image && (
        <div className="relative h-48 w-full">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-blue-600 font-medium">
            {item.date}
          </span>
          <span className="text-xs bg-blue-900 text-white px-2 py-1 rounded-full">
            Official News
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
          {item.title}
        </h2>
        
        <p className="text-blue-800 text-sm mb-4 line-clamp-3">
          {item.summary}
        </p>
      </div>
      
      <div className="border-t border-white/30 mt-auto">
        <Link
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 hover:bg-white/20 transition-colors"
        >
          <span className="text-blue-900 font-medium">Read Full Article</span>
          <ArrowTopRightOnSquareIcon className="w-5 h-5 text-blue-900 ml-2" />
        </Link>
      </div>
    </div>
  );
}
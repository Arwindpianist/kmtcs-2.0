import Link from 'next/link';
import Image from 'next/image';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import type { NewsItem } from '@/app/lib/newsService';
import { newsSources } from '@/app/lib/newsService';

interface FeaturedNewsProps {
  news: NewsItem[];
}

export default function FeaturedNews({ news }: FeaturedNewsProps) {
  if (news.length === 0) return null;

  const featuredNews = news.slice(0, 3); // Show top 3 high-priority news

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
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured News
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the most important developments in human capital development and training initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredNews.map((item, index) => {
            const sourceInfo = newsSources[item.source];
            
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                {item.image && (
                  <div className={`relative overflow-hidden ${index === 0 ? 'h-64' : 'h-48'}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`text-xs ${sourceInfo.textColor} ${sourceInfo.bgColor} px-3 py-1 rounded-full font-medium`}>
                        {sourceInfo.name}
                      </span>
                      <span className="text-xs bg-white/90 text-gray-700 px-3 py-1 rounded-full font-medium">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 font-medium">
                      {formatDate(item.date)}
                    </span>
                    <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                      High Priority
                    </span>
                  </div>
                  
                  <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${
                    index === 0 ? 'text-2xl' : 'text-xl'
                  }`}>
                    {item.title}
                  </h3>
                  
                  <p className={`text-gray-600 mb-6 line-clamp-3 ${
                    index === 0 ? 'text-base' : 'text-sm'
                  }`}>
                    {item.summary}
                  </p>
                  
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 group-hover:shadow-md"
                  >
                    <span className="font-medium">Read Full Article</span>
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 
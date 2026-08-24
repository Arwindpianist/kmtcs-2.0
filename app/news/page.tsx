import type { Metadata } from 'next';
import { listNews } from '@/app/lib/db/newsRepository';
import NewsPageClient from './NewsPageClient';

export const metadata: Metadata = {
  title: 'News',
  description:
    'Latest company news and updates from KM Training & Consulting Services (KMTCS) in Malaysia.',
  alternates: {
    canonical: 'https://www.kmtcs.com.my/news',
  },
};

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const posts = await listNews({ status: 'true' });
  return <NewsPageClient posts={posts} />;
}

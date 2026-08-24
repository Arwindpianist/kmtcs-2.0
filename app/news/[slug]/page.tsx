import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsBySlug } from '@/app/lib/db/newsRepository';
import NewsDetailClient from '../NewsDetailClient';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug, true);
  if (!post) {
    return { title: 'News' };
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      url: `https://www.kmtcs.com.my/news/${post.slug}`,
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, alt: post.title }]
        : undefined,
    },
    alternates: {
      canonical: `https://www.kmtcs.com.my/news/${post.slug}`,
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug, true);

  if (!post) {
    notFound();
  }

  return <NewsDetailClient post={post} />;
}

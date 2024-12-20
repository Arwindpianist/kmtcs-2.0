export const dynamic = 'force-dynamic'; // Ensure the route is always dynamically rendered

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { articles } from '@/app/data/articles'; // Ensure this file exists and is correctly structured

export const GET = async (
  _request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const article = articles.find((a) => a.id.toString() === id) || null;

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
};

// Remove or comment out the `generateStaticParams` function to skip static generation entirely
// export async function generateStaticParams() {
//   try {
//     return articles.map((article) => ({
//       id: article.id.toString(),
//     }));
//   } catch (error) {
//     console.error('Error generating static params for articles:', error);
//     return [];
//   }
// }

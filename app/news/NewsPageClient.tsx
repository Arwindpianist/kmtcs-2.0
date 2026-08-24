'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import type { NewsRecord } from '@/app/lib/db/newsRepository';
import ContactCTA from '@/app/components/ContactCTA';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NewsPageClient({ posts }: { posts: NewsRecord[] }) {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container mx-auto px-4 py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Badge variant="outline" className="mb-4">
                KMTCS Updates
              </Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                News &amp; Updates
              </h1>
              <p className="text-lg text-muted-foreground">
                Company announcements, training highlights, and consulting insights from KM Training &amp;
                Consulting Services.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-14">
        {posts.length === 0 ? (
          <Card className="border-dashed max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-3">No news published yet</h2>
              <p className="text-muted-foreground leading-relaxed">
                Check back soon for the latest updates from KMTCS.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <Card className="h-full border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
                  {post.cover_image_url ? (
                    <div className="aspect-[16/10] overflow-hidden bg-muted border-b border-border/60">
                      <img
                        src={post.cover_image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-muted/50 border-b border-border/60" />
                  )}
                  <CardContent className="p-5 h-full flex flex-col">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Badge variant="secondary">News</Badge>
                      <time className="text-xs text-muted-foreground">{formatDate(post.published_at)}</time>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground leading-snug">
                      <Link href={`/news/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                      {post.summary}
                    </p>
                    <div className="mt-5 flex items-center justify-end">
                      <Button asChild size="sm">
                        <Link href={`/news/${post.slug}`}>Read more</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <ContactCTA />
    </main>
  );
}

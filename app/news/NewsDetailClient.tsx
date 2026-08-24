'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import ContactCTA from '@/app/components/ContactCTA';
import type { NewsContentBlock, NewsRecord } from '@/app/lib/db/newsRepository';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function NewsBlocks({ blocks }: { blocks: NewsContentBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <motion.div
              key={`heading-${index}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="text-2xl font-bold text-foreground leading-tight">{block.text}</h2>
            </motion.div>
          );
        }

        if (block.type === 'paragraph') {
          return (
            <motion.div
              key={`paragraph-${index}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
            >
              <div className="rounded-lg bg-muted/40 border border-border/60 p-5 sm:p-6">
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {block.text}
                </p>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.figure
            key={`image-${index}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="space-y-3"
          >
            <div className="overflow-hidden rounded-lg border border-border/70 bg-muted">
              <img
                src={block.url}
                alt={block.caption || ''}
                className="w-full h-auto object-cover"
              />
            </div>
            {block.caption ? (
              <figcaption className="text-sm text-muted-foreground text-center">
                {block.caption}
              </figcaption>
            ) : null}
          </motion.figure>
        );
      })}
    </div>
  );
}

export default function NewsDetailClient({ post }: { post: NewsRecord }) {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-muted/30">
        <div className="container mx-auto px-4 py-14 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Badge variant="outline" className="mb-4">
                News
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-muted-foreground">
                Published {formatDate(post.published_at)}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/news">← Back to News</Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-border/70 shadow-sm overflow-hidden">
              {post.cover_image_url ? (
                <div className="aspect-[21/9] max-h-[360px] overflow-hidden bg-muted border-b border-border/60">
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}

              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="mb-8 pb-8 border-b border-border/60">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="secondary">Company Update</Badge>
                    <time className="text-sm text-muted-foreground">
                      {formatDate(post.published_at)}
                    </time>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{post.summary}</p>
                </div>

                <NewsBlocks blocks={post.content_blocks} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}

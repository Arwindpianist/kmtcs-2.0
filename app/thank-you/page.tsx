import Link from 'next/link';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto border-border/70 shadow-sm">
          <CardContent className="p-10">
            <Badge variant="outline" className="mb-4">KMTCS</Badge>
            <h1 className="text-3xl font-bold text-foreground mb-3">Thank you for your enquiry</h1>
            <p className="text-muted-foreground mb-6">
              Your message has been submitted successfully and our team will contact you shortly.
            </p>
            <Button asChild>
              <Link href="/">Back to homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

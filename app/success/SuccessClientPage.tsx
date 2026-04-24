'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Stripe from 'stripe';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

interface Session extends Stripe.Checkout.Session {}

export default function SuccessClientPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/get-payment-details?session_id=${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch payment details');
        const sessionData = await res.json();
        setSession(sessionData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) return null;

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto border-destructive/30">
        <CardContent className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Payment Verification Failed</h1>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">No Session Found</h1>
          <p className="text-muted-foreground">If you completed payment, check your email for confirmation.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border-border/70 shadow-sm">
      <CardContent className="p-8 text-center">
        <Badge variant="outline" className="mb-4">Payment Success</Badge>
        <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. A confirmation email has been sent to {session.customer_details?.email}.
        </p>
        <div className="text-left bg-muted/40 p-4 rounded-md space-y-1">
          <p><strong>Amount Paid:</strong> MYR {(session.amount_total! / 100).toFixed(2)}</p>
          <p><strong>Transaction ID:</strong> {session.id}</p>
        </div>
        <Button asChild className="mt-8">
          <Link href="/">Back to Homepage</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

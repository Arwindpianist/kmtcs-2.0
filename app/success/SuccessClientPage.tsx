'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Stripe from 'stripe';

interface Session extends Stripe.Checkout.Session {
  // Add any custom properties if you extend the session object
}

export default function SuccessClientPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      const fetchSession = async () => {
        try {
          const res = await fetch(`/api/get-payment-details?session_id=${sessionId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch payment details');
          }
          const sessionData = await res.json();
          setSession(sessionData);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSession();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return null; // The loading state will be handled by the Suspense fallback
  }

  return (
    <>
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
          <p>{error}</p>
        </div>
      ) : session ? (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. A confirmation email has been sent to {session.customer_details?.email}.
          </p>
          <div className="text-left bg-gray-50 p-4 rounded-md">
            <p><strong>Amount Paid:</strong> MYR {(session.amount_total! / 100).toFixed(2)}</p>
            <p><strong>Transaction ID:</strong> {session.id}</p>
          </div>
          <Link href="/" className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
            Back to Homepage
          </Link>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md">
           <h1 className="text-2xl font-bold mb-2">No Session Found</h1>
           <p>If you have completed a payment, please check your email for a confirmation.</p>
        </div>
      )}
    </>
  );
} 
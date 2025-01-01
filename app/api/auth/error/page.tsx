// app/error.tsx
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage after 5 seconds (or you can customize it)
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100">
      <h1 className="text-4xl font-bold text-red-800">Oops! Something went wrong</h1>
      <p className="mt-4 text-lg text-gray-700">We encountered an error. Please try again later.</p>
      <p className="mt-6 text-sm text-gray-600">Redirecting you to the homepage...</p>
    </div>
  );
}

'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const allowedEmail = 'info@kmtcs.com.my'; // The allowed email address
  const redirectUrl = '/admin/dashboard'; // Where to redirect after successful login

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user?.email === allowedEmail) {
        router.push(redirectUrl);
      } else {
        setError('You are not authorized to access this app.');
      }
    }
  }, [session, status]);

  // Handle the login process
  const handleLogin = async () => {
    const res = await signIn('google', { redirect: false });
    if (res?.error) {
      setError('Login failed. Please try again.');
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

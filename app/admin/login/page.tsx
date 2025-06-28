'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_USERS = [
  {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL_1,
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD_1,
    name: process.env.NEXT_PUBLIC_ADMIN_NAME_1,
  },
  {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL_2,
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD_2,
    name: process.env.NEXT_PUBLIC_ADMIN_NAME_2,
  },
];

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [envDebug, setEnvDebug] = useState('');

  useEffect(() => {
    setIsClient(true);
    // If already logged in, redirect to /admin
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('admin_session');
      if (session) {
        router.push('/admin');
      }
    }
    // Debug: check if env variables are set
    const missing = ADMIN_USERS.filter(u => !u.email || !u.password).length > 0;
    if (missing) {
      setEnvDebug('One or more admin credentials are missing from environment variables.');
    } else {
      setEnvDebug('');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check credentials
    const user = ADMIN_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      // Save session in localStorage
      localStorage.setItem(
        'admin_session',
        JSON.stringify({ email: user.email, name: user.name })
      );
      router.push('/admin');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {envDebug && (
        <div className="fixed top-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded text-sm max-w-md z-50">
          <strong>Debug:</strong> {envDebug}
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Login
          </h2>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
          <p className="text-sm text-gray-500 mt-2">Only authorized administrators can access this area</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-8 shadow-sm border border-gray-200 rounded-xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                <strong className="font-medium">Error:</strong>
                <span className="ml-2">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
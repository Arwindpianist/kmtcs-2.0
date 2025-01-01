// app/admin/dashboard/page.tsx
'use client'

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

declare module "next-auth" {
    interface Session {
      accessToken: string; // Add accessToken to the Session type
    }
  }

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push('/admin/login'); // Redirect to login if not logged in
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome, Admin!</h1>
        <p className="text-center mb-4">You are logged in as {session.user?.email}</p>
        <p className="text-center mb-4">Access Token: {session.accessToken}</p>
        <button
          onClick={() => signOut()}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-700"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

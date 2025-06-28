'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Current Session</h2>
        {session ? (
          <div className="space-y-2">
            <p><strong>Session ID:</strong> {session.access_token?.substring(0, 20)}...</p>
            <p><strong>Expires:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-red-600">No active session</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">User Information</h2>
        {user ? (
          <div className="space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
            <p><strong>Last Sign In:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
          </div>
        ) : (
          <p className="text-red-600">No user logged in</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Admin Access Check</h2>
        {user ? (
          <div>
            {['NEXT_PUBLIC_ADMIN_EMAIL_1', 'NEXT_PUBLIC_ADMIN_EMAIL_2'].includes(user.email) ? (
              <p className="text-green-600">✅ User has admin access</p>
            ) : (
              <p className="text-red-600">❌ User does not have admin access</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Admin emails: {process.env.NEXT_PUBLIC_ADMIN_EMAIL_1}, {process.env.NEXT_PUBLIC_ADMIN_EMAIL_2}
            </p>
          </div>
        ) : (
          <p className="text-red-600">No user to check</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
} 
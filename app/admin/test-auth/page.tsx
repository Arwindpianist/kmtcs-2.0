'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { AdminAuthService } from '@/app/lib/adminAuth';

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults(null);

    try {
      const results = {
        timestamp: new Date().toISOString(),
        session: null,
        adminCheck: null,
        apiTest: null,
        tableTest: null,
        environment: null
      };

      // Test 1: Check current session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        results.session = {
          exists: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
          metadata: session?.user?.user_metadata
        };
      } catch (error) {
        results.session = { error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test 2: Check admin status
      try {
        const isAdmin = await AdminAuthService.isAdmin();
        results.adminCheck = { isAdmin };
      } catch (error) {
        results.adminCheck = { error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test 3: Test API endpoint
      try {
        const response = await fetch('/api/test-admin-auth');
        const apiResult = await response.json();
        results.apiTest = apiResult;
      } catch (error) {
        results.apiTest = { error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test 4: Test database tables
      try {
        const response = await fetch('/api/test-admin-tables');
        const tableResult = await response.json();
        results.tableTest = tableResult;
      } catch (error) {
        results.tableTest = { error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test 5: Check environment variables (client-side)
      results.environment = {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      };

      setTestResults(results);
    } catch (error) {
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    AdminAuthService.clearCache();
    alert('Cache cleared');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Authorization Test</h1>
        <p className="text-gray-600 mb-6">
          This page helps diagnose authorization issues after domain migration.
        </p>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={runTests}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Running Tests...' : 'Run Tests'}
          </button>
          
          <button
            onClick={clearCache}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Clear Cache
          </button>
          
          <button
            onClick={checkSession}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Refresh Session
          </button>
        </div>
      </div>

      {/* Current Session Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Session</h2>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}

      {/* Troubleshooting Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">Troubleshooting Tips</h3>
        <ul className="text-yellow-700 space-y-2">
          <li>• Check if Supabase project settings include the new domain (kmtcs.com.my)</li>
          <li>• Verify environment variables are correctly set for the new domain</li>
          <li>• Clear browser cache and cookies for the old domain</li>
          <li>• Check if the users table exists and contains admin users</li>
          <li>• Verify RLS policies allow access to the users table</li>
        </ul>
      </div>
    </div>
  );
} 
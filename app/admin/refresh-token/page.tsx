'use client';

import { useState } from 'react';
import { FiRefreshCw, FiCheck, FiX, FiInfo } from 'react-icons/fi';

export default function RefreshTokenPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-calendar');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Refresh OAuth Token</h1>
            <p className="text-gray-600 mb-4">
              This will refresh your Zoho OAuth token to ensure it has the correct permissions for the production domain.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <FiInfo className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Current Issue:</p>
                  <p>Your OAuth token is invalid (401 error). This usually means:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>The token has expired</li>
                    <li>The token doesn't have the correct scope for calendar access</li>
                    <li>The token was generated for a different domain</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Steps to Fix:</h2>
              <ol className="list-decimal list-inside mt-2 text-sm text-gray-600 space-y-1">
                <li>Ensure your environment variables are set correctly</li>
                <li>Click "Refresh Token" to get a fresh token</li>
                <li>Check that the token has the correct scope</li>
                <li>Test the calendar connection</li>
              </ol>
            </div>
            <button
              onClick={refreshToken}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Token'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-red-800">
                <FiX className="w-5 h-5 mr-2" />
                <span className="font-medium">Error: {error}</span>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Token Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Token Status</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Token Refresh:</span>
                    <span className={`ml-2 ${result.debug?.tokenRefresh?.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.debug?.tokenRefresh?.success ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Has Access Token:</span>
                    <span className={`ml-2 ${result.debug?.tokenRefresh?.hasAccessToken ? 'text-green-600' : 'text-red-600'}`}>
                      {result.debug?.tokenRefresh?.hasAccessToken ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                    </span>
                  </div>
                </div>
                {result.debug?.tokenRefresh?.error && (
                  <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                    <p className="text-red-800 text-sm font-medium">Token Error:</p>
                    <p className="text-red-700 text-sm">{result.debug.tokenRefresh.error}</p>
                  </div>
                )}
              </div>

              {/* Calendar API Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Calendar API Status</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">API Success:</span>
                    <span className={`ml-2 ${result.debug?.calendarApi?.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.debug?.calendarApi?.success ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Calendar UID:</span>
                    <span className="ml-2 text-gray-600">{result.debug?.calendarApi?.calendarUid}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">GET Response:</span>
                    <span className={`ml-2 ${result.debug?.calendarApi?.getResponseStatus === 200 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.debug?.calendarApi?.getResponseStatus || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">POST Response:</span>
                    <span className={`ml-2 ${result.debug?.calendarApi?.postResponseStatus === 200 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.debug?.calendarApi?.postResponseStatus || 'N/A'}
                    </span>
                  </div>
                </div>
                {result.debug?.calendarApi?.error && (
                  <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                    <p className="text-red-800 text-sm font-medium">API Error:</p>
                    <p className="text-red-700 text-sm">{result.debug.calendarApi.error}</p>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Recommendations</h3>
                <div className="text-sm text-yellow-800 space-y-2">
                  {!result.debug?.tokenRefresh?.success && (
                    <p>• <strong>Token refresh failed:</strong> Check your ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN environment variables</p>
                  )}
                  {result.debug?.calendarApi?.getResponseStatus === 401 && (
                    <p>• <strong>Invalid OAuth token:</strong> The token doesn't have the correct permissions. You may need to re-authorize with the correct scope</p>
                  )}
                  {result.debug?.calendarApi?.getResponseStatus === 404 && (
                    <p>• <strong>Calendar not found:</strong> The calendar UID may be incorrect. Check your ZOHO_CALENDAR_UID environment variable</p>
                  )}
                  {result.debug?.calendarApi?.success && (
                    <p>• <strong>Success!</strong> Your calendar connection is working. Check the calendar page to see your events.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
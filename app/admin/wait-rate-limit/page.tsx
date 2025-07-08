'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiRefreshCw, FiCheck, FiX, FiInfo } from 'react-icons/fi';

export default function WaitRateLimitPage() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isWaiting, setIsWaiting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWaiting && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsWaiting(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWaiting, timeLeft]);

  const startWaiting = () => {
    setIsWaiting(true);
    setTimeLeft(300); // Reset to 5 minutes
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const testConnection = async () => {
    setError(null);
    
    try {
      const response = await fetch('/api/test-calendar');
      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Zoho Rate Limit Recovery</h1>
            <p className="text-gray-600 mb-4">
              You've hit Zoho's rate limit. This page helps you wait for the limit to reset and test the connection.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <FiInfo className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-2">Rate Limit Issue:</p>
                  <p>Zoho has temporarily blocked requests due to too many API calls. This usually resets after 5-10 minutes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timer Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <FiClock className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-blue-900">Wait Timer</h2>
              </div>
              
              {isWaiting ? (
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-4">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-blue-700 mb-4">
                    Waiting for Zoho rate limit to reset...
                  </p>
                  <button
                    onClick={() => setIsWaiting(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Stop Timer
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-blue-700 mb-4">
                    Click to start a 5-minute timer
                  </p>
                  <button
                    onClick={startWaiting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Timer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Test Connection */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Test Connection</h2>
                <p className="text-gray-600 text-sm">Test if the rate limit has reset</p>
              </div>
              <button
                onClick={testConnection}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Test Now
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center text-red-800">
                  <FiX className="w-5 h-5 mr-2" />
                  <span className="font-medium">Error: {error}</span>
                </div>
              </div>
            )}

            {testResult && (
              <div className="space-y-4">
                {/* Token Status */}
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-900 mb-2">Token Status</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">Token Refresh:</span>
                      <span className={`ml-2 ${testResult.debug?.tokenRefresh?.success ? 'text-green-600' : 'text-red-600'}`}>
                        {testResult.debug?.tokenRefresh?.success ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">Has Access Token:</span>
                      <span className={`ml-2 ${testResult.debug?.tokenRefresh?.hasAccessToken ? 'text-green-600' : 'text-red-600'}`}>
                        {testResult.debug?.tokenRefresh?.hasAccessToken ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>
                  {testResult.debug?.tokenRefresh?.error && (
                    <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                      <p className="text-red-800 text-sm font-medium">Token Error:</p>
                      <p className="text-red-700 text-sm">{testResult.debug.tokenRefresh.error}</p>
                    </div>
                  )}
                </div>

                {/* Calendar API Status */}
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-900 mb-2">Calendar API Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">API Success:</span>
                      <span className={`ml-2 ${testResult.debug?.calendarApi?.success ? 'text-green-600' : 'text-red-600'}`}>
                        {testResult.debug?.calendarApi?.success ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">GET Response:</span>
                      <span className={`ml-2 ${testResult.debug?.calendarApi?.getResponseStatus === 200 ? 'text-green-600' : 'text-red-600'}`}>
                        {testResult.debug?.calendarApi?.getResponseStatus || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Events:</span>
                      <span className="ml-2 text-gray-600">
                        {testResult.debug?.calendarApi?.data?.totalEvents || 0}
                      </span>
                    </div>
                  </div>
                  {testResult.debug?.calendarApi?.error && (
                    <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                      <p className="text-red-800 text-sm font-medium">API Error:</p>
                      <p className="text-red-700 text-sm">{testResult.debug.calendarApi.error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Recommendations</h3>
            <div className="text-sm text-green-800 space-y-2">
              <p>• <strong>Wait 5-10 minutes</strong> before testing again</p>
              <p>• <strong>Reduce API calls</strong> - avoid frequent testing</p>
              <p>• <strong>Use existing tokens</strong> when possible instead of refreshing</p>
              <p>• <strong>Check calendar page</strong> once rate limit resets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
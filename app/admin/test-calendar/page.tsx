'use client';

import { useState } from 'react';
import { FiRefreshCw, FiCalendar, FiInfo, FiCheck, FiX } from 'react-icons/fi';

export default function TestCalendarPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-calendar');
      const data = await response.json();
      setTestResult(data);
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Zoho Calendar Test</h1>
              <p className="text-gray-600">Test the connection to Zoho Calendar API</p>
            </div>
            <button
              onClick={runTest}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Testing...' : 'Run Test'}
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

          {testResult && (
            <div className="space-y-6">
              {/* Environment Variables */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FiInfo className="w-5 h-5 mr-2" />
                  Environment Variables
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(testResult.debug?.environmentVariables || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className={`ml-2 ${value ? 'text-green-600' : 'text-red-600'}`}>
                        {value ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Token Refresh */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FiRefreshCw className="w-5 h-5 mr-2" />
                  Token Refresh
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Success:</span>
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
                  {testResult.debug?.tokenRefresh?.error && (
                    <div className="text-red-600">
                      <span className="font-medium">Error:</span> {testResult.debug.tokenRefresh.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Calendar API */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  Calendar API
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Success:</span>
                    <span className={`ml-2 ${testResult.debug?.calendarApi?.success ? 'text-green-600' : 'text-red-600'}`}>
                      {testResult.debug?.calendarApi?.success ? <FiCheck className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Calendar UID:</span>
                    <span className="ml-2 text-gray-600">{testResult.debug?.calendarApi?.calendarUid}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">GET Response Status:</span>
                    <span className={`ml-2 ${testResult.debug?.calendarApi?.getResponseStatus === 200 ? 'text-green-600' : 'text-red-600'}`}>
                      {testResult.debug?.calendarApi?.getResponseStatus || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">POST Response Status:</span>
                    <span className={`ml-2 ${testResult.debug?.calendarApi?.postResponseStatus === 200 ? 'text-green-600' : 'text-red-600'}`}>
                      {testResult.debug?.calendarApi?.postResponseStatus || 'N/A'}
                    </span>
                  </div>
                  {testResult.debug?.calendarApi?.error && (
                    <div className="text-red-600">
                      <span className="font-medium">Error:</span> {testResult.debug.calendarApi.error}
                    </div>
                  )}
                  
                  {/* Event Data */}
                  {testResult.debug?.calendarApi?.data && (
                    <div className="mt-4 p-3 bg-white rounded border">
                      <h4 className="font-medium text-gray-900 mb-2">Event Data:</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-700">Total Events:</span>
                          <span className="ml-2 text-gray-600">{testResult.debug.calendarApi.data.totalEvents}</span>
                        </div>
                        {testResult.debug.calendarApi.data.sampleEvent && (
                          <div>
                            <span className="font-medium text-gray-700">Sample Event:</span>
                            <div className="ml-2 text-gray-600">
                              <div>ID: {testResult.debug.calendarApi.data.sampleEvent.id}</div>
                              <div>Title: {testResult.debug.calendarApi.data.sampleEvent.title}</div>
                              <div>Start Time: {testResult.debug.calendarApi.data.sampleEvent.start_time}</div>
                            </div>
                          </div>
                        )}
                        {testResult.debug.calendarApi.data.rawEventStructure && (
                          <div>
                            <span className="font-medium text-gray-700">Event Fields:</span>
                            <div className="ml-2 text-gray-600 text-xs">
                              {testResult.debug.calendarApi.data.rawEventStructure.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Raw Response */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Raw Response</h3>
                <pre className="bg-white p-4 rounded border text-xs overflow-auto max-h-96">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
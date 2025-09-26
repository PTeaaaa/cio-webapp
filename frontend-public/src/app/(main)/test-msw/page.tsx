'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL!;

const fetcher = async (url: string) => {
  console.log('🔍 Fetching:', url);
  const res = await fetch(url, { cache: 'no-store' });
  console.log('📡 Response status:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.log('❌ Error response:', errorText);
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  const data = await res.json();
  console.log('✅ Success data:', data);
  return data;
};

export default function TestMSWPage() {
  const searchParams = useSearchParams();
  const [currentMode, setCurrentMode] = useState<string>('success');
  const [testAgency] = useState('กรมการแพทย์');

  const mockMode = searchParams.get('mock') || 'success';

  useEffect(() => {
    console.log('🎯 Mock mode from URL:', mockMode);
    setCurrentMode(mockMode);

    // Update MSW mode when URL changes
    if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
      import('@/mocks/browser').then(({ setMockMode }) => {
        console.log('🔄 Setting MSW mode to:', mockMode);
        setMockMode(mockMode as 'success' | '500' | 'network');
        localStorage.setItem('msw:mode', mockMode);
      });
    }
  }, [mockMode]);

  const url = `${BACKEND_URL}/places/by-agency/${encodeURIComponent(testAgency)}?page=1&limit=5`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    mutate();
  };

  const switchMode = (newMode: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('mock', newMode);
    window.history.pushState({}, '', newUrl.toString());
    window.location.reload(); // Force reload to apply new mode
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">MSW Testing Page</h1>

        {/* Mode Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Mock Mode Controls</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => switchMode('success')}
              className={`px-4 py-2 rounded ${currentMode === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Success Mode
            </button>
            <button
              onClick={() => switchMode('500')}
              className={`px-4 py-2 rounded ${currentMode === '500' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              500 Error Mode
            </button>
            <button
              onClick={() => switchMode('network')}
              className={`px-4 py-2 rounded ${currentMode === 'network' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            >
              Network Error Mode
            </button>
          </div>
          <p className="text-sm text-gray-600">Current Mode: <strong>{currentMode}</strong></p>
          <p className="text-sm text-gray-600">API Mocking: <strong>{process.env.NEXT_PUBLIC_API_MOCKING || 'disabled'}</strong></p>
        </div>

        {/* Debug Info */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="text-sm space-y-2">
            <p><strong>Request URL:</strong> {url}</p>
            <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Has Error:</strong> {error ? 'Yes' : 'No'}</p>
            <p><strong>Has Data:</strong> {data ? 'Yes' : 'No'}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Request
          </button>
        </div>

        {/* Results Display */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API Response</h2>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Error Occurred:</h3>
              <p className="text-red-700">{error.message}</p>
              <div className="mt-4 p-3 bg-red-100 rounded text-xs">
                <strong>Full error object:</strong>
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </div>
            </div>
          )}

          {data && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">Success Response:</h3>
              <pre className="text-sm bg-green-100 p-3 rounded overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}

          {!isLoading && !error && !data && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600">No data received yet. Try refreshing or changing the mock mode.</p>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Quick test links:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><a href="?mock=success" className="text-blue-600 hover:underline">Test Success Mode</a></li>
            <li><a href="?mock=500" className="text-blue-600 hover:underline">Test 500 Error Mode</a></li>
            <li><a href="?mock=network" className="text-blue-600 hover:underline">Test Network Error Mode</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
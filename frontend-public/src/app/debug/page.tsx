"use client"

import { useState } from 'react';

export default function DebugPage() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3003';
    const [result, setResult] = useState<string>('');

    const testFetch = async () => {
        try {
            setResult('Testing...');
            const url = `${backendUrl}/search/places?name=กรม&agency=Department&limit=5&offset=0`;
            console.log('Testing fetch to:', url);

            const response = await fetch(url);
            console.log('Response:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Data:', data);
            setResult(`Success! Got ${data.length} results: ${JSON.stringify(data.slice(0, 2), null, 2)}`);
        } catch (error: any) {
            console.error('Fetch error:', error);
            setResult(`Error: ${error.message}`);
        }
    };

    const testFetchEncoded = async () => {
        try {
            setResult('Testing with proper encoding...');
            const searchTerm = 'กรม';
            const agency = 'Department';
            const url = `${backendUrl}/search/places?name=${encodeURIComponent(searchTerm)}&agency=${encodeURIComponent(agency)}&limit=5&offset=0`;
            console.log('Testing encoded fetch to:', url);

            const response = await fetch(url);
            console.log('Response:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Data:', data);
            setResult(`Success! Got ${data.length} results: ${JSON.stringify(data.slice(0, 2), null, 2)}`);
        } catch (error: any) {
            console.error('Fetch error:', error);
            setResult(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-4">Debug Page</h1>
            <p><strong>NEXT_PUBLIC_BACKEND_URL:</strong> {backendUrl || 'UNDEFINED'}</p>

            <div className="space-y-4 mt-4">
                <button
                    onClick={testFetch}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                    Test Basic Fetch
                </button>

                <button
                    onClick={testFetchEncoded}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Test Encoded Fetch
                </button>
            </div>

            {result && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <pre className="whitespace-pre-wrap">{result}</pre>
                </div>
            )}
        </div>
    );
}

// app/test-api/page.tsx
'use client'; // This is a Client Component

import { useState, useEffect } from 'react';

export default function TestApiPage() {
  const [message, setMessage] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const NESTJS_API_URL = 'http://localhost:3003'; // Make sure this matches your NestJS port

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the "Hello" message
        const helloResponse = await fetch(`${NESTJS_API_URL}/users/hello`);
        if (!helloResponse.ok) {
          throw new Error(`HTTP error! status: ${helloResponse.status}`);
        }
        const helloData = await helloResponse.text(); // Use .text() if the response is plain text
        setMessage(helloData);

        // Fetch the list of users
        const usersResponse = await fetch(`${NESTJS_API_URL}/users`);
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        setUsers(usersData);

      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Next.js Frontend</h1>
      <h2>Connecting to NestJS Backend</h2>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {message ? (
        <p><strong>Message from NestJS:</strong> {message}</p>
      ) : (
        <p>Loading message from NestJS...</p>
      )}

      <h3>Users from NestJS:</h3>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name} (ID: {user.id})</li>
          ))}
        </ul>
      ) : (
        !error && <p>Loading users from NestJS...</p>
      )}
      {users.length === 0 && !error && <p>No users found or still loading...</p>}
    </div>
  );
}
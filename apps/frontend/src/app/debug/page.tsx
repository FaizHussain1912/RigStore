import React from 'react';

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
  const url = process.env.NEXT_PUBLIC_API_URL || 'NOT_SET';
  
  let catRes = 'Not attempted';
  let catData = null;
  
  try {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767').replace(/\/$/, '');
    const fetchUrl = `${baseUrl}/api/category/laptops`;
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    catRes = `Status: ${res.status} | OK: ${res.ok}`;
    catData = await res.json();
  } catch (error: any) {
    catRes = `Error: ${error.message}`;
  }

  return (
    <div style={{ padding: '2rem', color: 'black', background: 'white', minHeight: '100vh' }}>
      <h1>Debug Page</h1>
      <p><strong>API_URL:</strong> {url}</p>
      <p><strong>Category Fetch Result:</strong> {catRes}</p>
      <details>
        <summary>Data</summary>
        <pre>{JSON.stringify(catData, null, 2)}</pre>
      </details>
    </div>
  );
}

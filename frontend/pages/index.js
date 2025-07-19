import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [apiStatus, setApiStatus] = useState('Loading...');
  
  useEffect(() => {
    // Check if the backend API is running
    const checkApi = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();
        
        if (data.status === 'ok') {
          setApiStatus('API is running');
        } else {
          setApiStatus('API returned unexpected response');
        }
      } catch (error) {
        console.error('Error checking API:', error);
        setApiStatus('API is not running or not accessible');
      }
    };
    
    checkApi();
  }, []);
  
  return (
    <div>
      <Head>
        <title>Multiprints Business System</title>
        <meta name="description" content="Business management system for printing businesses" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Multiprints Business System</h1>
        
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h2>System Status</h2>
          <p>
            <strong>Backend API:</strong> {apiStatus}
          </p>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/admin">Admin Dashboard</a></li>
            <li><a href="/products">Product Catalog</a></li>
          </ul>
        </div>
      </main>
    </div>
  );
}
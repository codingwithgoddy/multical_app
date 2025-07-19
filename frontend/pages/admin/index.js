import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // This is just a placeholder for authentication
  // In a real app, you would check if the user is authenticated
  useEffect(() => {
    // Simulate checking authentication
    const checkAuth = () => {
      // For now, we'll just set it to true for demonstration
      setIsLoggedIn(true);
    };
    
    checkAuth();
  }, []);
  
  if (!isLoggedIn) {
    return (
      <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
        <h1>Admin Login</h1>
        <p>Please log in to access the admin dashboard.</p>
        <form style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
            <input type="email" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
            <input type="password" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <button 
            type="button" 
            onClick={() => setIsLoggedIn(true)}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Log In
          </button>
        </form>
      </div>
    );
  }
  
  return (
    <div>
      <Head>
        <title>Admin Dashboard | Multiprints</title>
        <meta name="description" content="Admin dashboard for Multiprints Business System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Admin Dashboard</h1>
          <button 
            onClick={() => setIsLoggedIn(false)}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Log Out
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Orders</h3>
            <p>Total Orders: 0</p>
            <p>Pending: 0</p>
            <p>Completed: 0</p>
            <a href="/admin/orders" style={{ color: '#0070f3', textDecoration: 'none' }}>View Orders →</a>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Products</h3>
            <p>Total Products: 0</p>
            <p>Categories: 0</p>
            <a href="/admin/products" style={{ color: '#0070f3', textDecoration: 'none' }}>Manage Products →</a>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Customers</h3>
            <p>Total Customers: 0</p>
            <a href="/admin/customers" style={{ color: '#0070f3', textDecoration: 'none' }}>View Customers →</a>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Reports</h3>
            <p>Generate business reports</p>
            <a href="/admin/reports" style={{ color: '#0070f3', textDecoration: 'none' }}>View Reports →</a>
          </div>
        </div>
      </main>
    </div>
  );
}
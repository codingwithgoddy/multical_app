import React, { useState } from 'react';
import { apiGet, apiPost } from '../utils/api';
import { useRouter } from 'next/router';
import { AuthResponse } from '../types';

// Define test endpoints
const testEndpoints = [
  { name: 'Login', method: 'POST', url: '/auth/login', requiresAuth: false },
  { name: 'Get Current User', method: 'GET', url: '/auth/me', requiresAuth: true },
  { name: 'List Admin Users', method: 'GET', url: '/auth/admin', requiresAuth: true },
  { name: 'Verify Token', method: 'GET', url: '/auth/verify', requiresAuth: true },
];

const ApiTestPage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(testEndpoints[0]);
  const [requestBody, setRequestBody] = useState('{\n  "email": "admin@example.com",\n  "password": "password123"\n}');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();

  const handleEndpointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = testEndpoints.find(endpoint => endpoint.name === e.target.value);
    if (selected) {
      setSelectedEndpoint(selected);
      
      // Set default request body based on endpoint
      if (selected.name === 'Login') {
        setRequestBody('{\n  "email": "admin@example.com",\n  "password": "password123"\n}');
      } else {
        setRequestBody('{}');
      }
    }
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let parsedBody;
      try {
        parsedBody = requestBody ? JSON.parse(requestBody) : {};
      } catch (e) {
        throw new Error('Invalid JSON in request body');
      }

      let result;
      if (selectedEndpoint.method === 'GET') {
        result = await apiGet(selectedEndpoint.url);
      } else if (selectedEndpoint.method === 'POST') {
        result = await apiPost(selectedEndpoint.url, parsedBody);
        
        // If this is a login request and it succeeded, store the token
        if (selectedEndpoint.name === 'Login' && result.access_token) {
          localStorage.setItem('accessToken', result.access_token);
          if (result.refresh_token) {
            localStorage.setItem('refreshToken', result.refresh_token);
          }
          setAuthToken(result.access_token);
        }
      }

      setResponse(result);
    } catch (err: any) {
      console.error('API request failed:', err);
      setError(err.response?.data?.error?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthToken(null);
    setResponse(null);
    setError(null);
  };

  // Check if token exists on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full mr-2" 
               style={{ backgroundColor: authToken ? 'green' : 'red' }}></div>
          <span>{authToken ? 'Authenticated' : 'Not Authenticated'}</span>
          
          {authToken && (
            <button 
              onClick={handleLogout}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Request</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Endpoint</label>
            <select 
              value={selectedEndpoint.name}
              onChange={handleEndpointChange}
              className="w-full p-2 border rounded"
            >
              {testEndpoints.map(endpoint => (
                <option key={endpoint.name} value={endpoint.name}>
                  {endpoint.method} {endpoint.url} - {endpoint.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Request Body (JSON)</label>
            <textarea 
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full p-2 border rounded font-mono text-sm h-40"
            />
          </div>
          
          <button 
            onClick={handleSendRequest}
            disabled={loading || (selectedEndpoint.requiresAuth && !authToken)}
            className={`px-4 py-2 rounded text-white ${
              loading || (selectedEndpoint.requiresAuth && !authToken) 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
          
          {selectedEndpoint.requiresAuth && !authToken && (
            <p className="text-red-500 text-sm mt-2">
              This endpoint requires authentication. Please login first.
            </p>
          )}
        </div>
        
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Response</h2>
          
          {loading && <p>Loading...</p>}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {response && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80 text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">API Information</h2>
        <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
        <p className="text-sm text-gray-600 mt-2">
          Note: Make sure your backend server is running and accessible at the configured URL.
        </p>
      </div>
    </div>
  );
};

export default ApiTestPage;
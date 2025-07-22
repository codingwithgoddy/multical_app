import React, { useEffect, useState } from 'react';
import { testApiConnection } from '../../utils/api-test';

interface ApiStatusProps {
  showDetails?: boolean;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ showDetails = false }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'warning'>('loading');
  const [message, setMessage] = useState<string>('Checking API connection...');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const checkApiStatus = async () => {
      const result = await testApiConnection();
      setStatus(result.status as 'success' | 'error' | 'warning');
      setMessage(result.message);
    };

    checkApiStatus();
    
    // Set up periodic checking every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!showDetails) {
    return (
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
        <span className="text-sm text-gray-600">API</span>
      </div>
    );
  }

  return (
    <div className="border rounded p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-2 ${getStatusColor()}`}></div>
          <h3 className="font-medium">API Connection Status</h3>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-700"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-2">
          <p className="text-sm">{message}</p>
          <p className="text-xs text-gray-500 mt-1">
            API URL: {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
          </p>
          <button 
            onClick={async () => {
              setStatus('loading');
              setMessage('Checking API connection...');
              const result = await testApiConnection();
              setStatus(result.status as 'success' | 'error' | 'warning');
              setMessage(result.message);
            }}
            className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Connection
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiStatus;
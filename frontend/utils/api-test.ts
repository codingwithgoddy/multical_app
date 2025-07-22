import axios from 'axios';

/**
 * Simple utility to test if the backend API is accessible
 * @returns Promise with API status
 */
export const testApiConnection = async (): Promise<{ status: string; message: string }> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      return {
        status: 'error',
        message: 'API URL is not configured. Please check your .env.local file.'
      };
    }
    
    // Try to connect to the API health check endpoint
    const response = await axios.get(`${apiUrl}/health`, { timeout: 5000 });
    
    if (response.status === 200) {
      return {
        status: 'success',
        message: `Successfully connected to API at ${apiUrl}`
      };
    } else {
      return {
        status: 'warning',
        message: `API responded with status ${response.status}`
      };
    }
  } catch (error: any) {
    return {
      status: 'error',
      message: `Failed to connect to API: ${error.message}`
    };
  }
};

/**
 * Test if authentication is working
 * @param email Admin email
 * @param password Admin password
 * @returns Promise with login test result
 */
export const testApiAuth = async (
  email: string = 'admin@example.com',
  password: string = 'password123'
): Promise<{ status: string; message: string; data?: any }> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      return {
        status: 'error',
        message: 'API URL is not configured. Please check your .env.local file.'
      };
    }
    
    // Try to login
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email,
      password
    });
    
    if (response.status === 200 && response.data.access_token) {
      return {
        status: 'success',
        message: 'Authentication successful',
        data: response.data
      };
    } else {
      return {
        status: 'warning',
        message: 'Authentication response did not contain expected data',
        data: response.data
      };
    }
  } catch (error: any) {
    return {
      status: 'error',
      message: `Authentication failed: ${error.response?.data?.error?.message || error.message}`,
      data: error.response?.data
    };
  }
};
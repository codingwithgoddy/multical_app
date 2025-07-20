import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { apiPost } from '../utils/api';
import { AuthResponse, LoginCredentials, User } from '../types';
import jwt_decode from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Decode token to get user info and expiration
        const decoded = jwt_decode<{ exp: number; user: User }>(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          // Try to refresh the token
          const newToken = await refreshToken();
          if (!newToken) {
            logout();
            return;
          }
          
          // Decode the new token
          const newDecoded = jwt_decode<{ exp: number; user: User }>(newToken);
          setUser(newDecoded.user);
          setIsAuthenticated(true);
        } else {
          setUser(decoded.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await apiPost<AuthResponse>('/auth/login', credentials);
      
      // Store tokens
      localStorage.setItem('accessToken', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      } else {
        // Fallback if refresh token is not provided
        localStorage.setItem('refreshToken', response.access_token);
      }
      
      // Set user state
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return null;
      }
      
      const response = await apiPost<{ access_token: string; refresh_token?: string }>(
        '/auth/refresh',
        { refresh_token: refreshToken }
      );
      
      const newAccessToken = response.access_token;
      localStorage.setItem('accessToken', newAccessToken);
      
      // Update refresh token if provided
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }
      
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login
    router.push('/auth/login');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
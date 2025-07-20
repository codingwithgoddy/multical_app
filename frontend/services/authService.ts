import { apiPost } from '../utils/api';
import { AuthResponse, LoginCredentials, User } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiPost<any>('/auth/login', credentials);
      
      console.log('Backend response:', response);
      
      // Map backend user model to frontend user model
      const mappedUser: User = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        // Map is_admin boolean to role string
        role: response.user.is_admin ? 'owner' : 'worker',
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: response.user.created_at || new Date().toISOString()
      };
      
      console.log('Mapped user:', mappedUser);
      
      return {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        user: mappedUser,
        token_type: response.token_type || 'Bearer',
        expires_in: response.expires_in || 3600
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  // Add a function to map user from token or API response
  mapUserFromBackend: (backendUser: any): User => {
    return {
      id: backendUser.id,
      username: backendUser.username,
      email: backendUser.email,
      role: backendUser.is_admin ? 'owner' : 'worker',
      isActive: true,
      lastLogin: backendUser.last_login || new Date().toISOString(),
      createdAt: backendUser.created_at || new Date().toISOString()
    };
  }
};
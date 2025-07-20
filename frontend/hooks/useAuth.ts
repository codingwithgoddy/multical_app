import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Re-export the hook from the context
export const useAuth = useAuthContext;

export default useAuth;
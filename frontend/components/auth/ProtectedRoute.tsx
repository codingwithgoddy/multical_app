import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<'owner' | 'payment_admin' | 'worker'>;
}

/**
 * A wrapper component that protects routes requiring authentication
 * Redirects to login if user is not authenticated
 * Optionally checks for specific roles if requiredRoles is provided
 */
export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const currentPath = router.asPath;

  useEffect(() => {
    // Wait until auth check is complete
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace({
        pathname: '/auth/login',
        query: { from: currentPath }, // Store the current path to redirect back after login
      });
      return;
    }

    // Check for required roles if specified
    if (requiredRoles && requiredRoles.length > 0 && user) {
      const hasRequiredRole = requiredRoles.includes(user.role);
      if (!hasRequiredRole) {
        // Redirect to dashboard with unauthorized message
        router.replace({
          pathname: '/dashboard',
          query: { unauthorized: 'true', message: 'You do not have permission to access this page' },
        });
      }
    }
  }, [isLoading, isAuthenticated, user, router, requiredRoles, currentPath]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto rounded-full bg-primary-700 flex items-center justify-center text-white text-2xl font-bold">
            MP
          </div>
          <h1 className="mt-4 text-2xl font-bold text-primary-700">MultiPrints Admin</h1>
          <div className="mt-4 flex justify-center">
            <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="mt-2 text-gray-600">Verifying your credentials...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If role check is required but user doesn't have permission, show nothing (will redirect)
  if (requiredRoles && requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return null;
    }
  }

  // If authenticated and has required role (if specified), render children
  return <>{children}</>;
}
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

  useEffect(() => {
    // Wait until auth check is complete
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    // Check for required roles if specified
    if (requiredRoles && requiredRoles.length > 0 && user) {
      const hasRequiredRole = requiredRoles.includes(user.role);
      if (!hasRequiredRole) {
        // Redirect to dashboard with unauthorized message
        router.replace({
          pathname: '/dashboard',
          query: { unauthorized: 'true' },
        });
      }
    }
  }, [isLoading, isAuthenticated, user, router, requiredRoles]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-700">MultiPrints Admin</h1>
          <p className="mt-2 text-gray-600">Loading...</p>
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
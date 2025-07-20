import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';

// Define routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/products',
  '/orders',
  '/customers',
  '/payments',
  '/analytics',
  '/admin-users',
  '/settings',
  '/profile',
];

// Define routes that require specific roles
const roleProtectedRoutes: Record<string, Array<'owner' | 'payment_admin' | 'worker'>> = {
  '/analytics': ['owner'],
  '/admin-users': ['owner'],
  '/settings': ['owner'],
  '/products': ['owner', 'worker'],
  '/customers': ['owner', 'payment_admin'],
  '/payments': ['owner', 'payment_admin'],
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Simple loading indicator for page transitions
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    router.pathname === route || router.pathname.startsWith(`${route}/`)
  );

  // Get required roles for the current route if any
  const getRequiredRoles = (): Array<'owner' | 'payment_admin' | 'worker'> | undefined => {
    const exactMatch = roleProtectedRoutes[router.pathname];
    if (exactMatch) return exactMatch;

    // Check for path patterns (e.g., /products/123 should match /products)
    for (const [route, roles] of Object.entries(roleProtectedRoutes)) {
      if (router.pathname.startsWith(`${route}/`)) {
        return roles;
      }
    }
    return undefined;
  };

  return (
    <AuthProvider>
      <Head>
        <title>MultiPrints Admin</title>
        <meta name="description" content="MultiPrints Business Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary-500 z-50 animate-pulse" />
      )}
      
      {isProtectedRoute ? (
        <ProtectedRoute requiredRoles={getRequiredRoles()}>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}

export default MyApp;
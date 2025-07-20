import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import { apiGet } from '../../utils/api';

interface DashboardStats {
  totalEarnings: number;
  pendingOrders: number;
  completedOrders: number;
  outstandingDebts: number;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    pendingOrders: 0,
    completedOrders: 0,
    outstandingDebts: 0,
  });
  const router = useRouter();
  const { user } = useAuth();

  // Check for unauthorized access message
  useEffect(() => {
    if (router.query.unauthorized === 'true') {
      alert('You do not have permission to access the requested page.');
      router.replace('/dashboard', undefined, { shallow: true });
    }
  }, [router]);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // This would be replaced with an actual API call
        // const data = await apiGet<DashboardStats>('/analytics/dashboard');
        
        // Simulated data
        const data: DashboardStats = {
          totalEarnings: 125000,
          pendingOrders: 12,
          completedOrders: 48,
          outstandingDebts: 35000,
        };
        
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your business performance and key metrics
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="mt-4 h-8 w-3/4 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              KES {stats.totalEarnings.toLocaleString()}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.pendingOrders}</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.completedOrders}</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-gray-500">Outstanding Debts</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              KES {stats.outstandingDebts.toLocaleString()}
            </p>
          </Card>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
          <div className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent orders to display</p>
            )}
          </div>
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-gray-900">Recent Payments</h3>
          <div className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent payments to display</p>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
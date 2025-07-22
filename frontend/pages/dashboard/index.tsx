import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import ApiStatus from '../../components/ui/ApiStatus';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import Link from 'next/link';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  UserPlusIcon,
  DocumentPlusIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

interface DashboardStats {
  totalEarnings: number;
  pendingOrders: number;
  completedOrders: number;
  outstandingDebts: number;
  earningsData: {
    labels: string[];
    data: number[];
  };
  orderStatusData: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  debtData: {
    labels: string[];
    data: number[];
  };
}

interface RecentActivity {
  id: string;
  type: 'order' | 'payment' | 'customer' | 'quote';
  title: string;
  description: string;
  time: string;
  status?: string;
  amount?: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 0,
    pendingOrders: 0,
    completedOrders: 0,
    outstandingDebts: 0,
    earningsData: {
      labels: [],
      data: [],
    },
    orderStatusData: {
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    },
    debtData: {
      labels: [],
      data: [],
    },
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
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
          earningsData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            data: [12000, 19000, 15000, 22000, 18000, 24000, 15000],
          },
          orderStatusData: {
            pending: 12,
            inProgress: 18,
            completed: 48,
            cancelled: 3,
          },
          debtData: {
            labels: ['1-30 days', '31-60 days', '61-90 days', '90+ days'],
            data: [15000, 10000, 7000, 3000],
          },
        };
        
        setStats(data);

        // Simulated recent activity
        const activityData: RecentActivity[] = [
          {
            id: 'ord-1234',
            type: 'order',
            title: 'New order received',
            description: 'Business cards order from John Doe',
            time: '10 minutes ago',
            status: 'pending',
          },
          {
            id: 'pay-5678',
            type: 'payment',
            title: 'Payment received',
            description: 'KES 2,500 for Order #12340',
            time: '1 hour ago',
            amount: 2500,
          },
          {
            id: 'cus-9012',
            type: 'customer',
            title: 'New customer registered',
            description: 'Jane Smith added contact details',
            time: '3 hours ago',
          },
          {
            id: 'quo-3456',
            type: 'quote',
            title: 'Quote request submitted',
            description: 'Brochure printing quote from ABC Company',
            time: '5 hours ago',
          },
          {
            id: 'ord-7890',
            type: 'order',
            title: 'Order status updated',
            description: 'Order #12335 marked as completed',
            time: '1 day ago',
            status: 'completed',
          },
        ];
        
        setRecentActivity(activityData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Quick action buttons
  const quickActions: QuickAction[] = [
    {
      title: 'New Order',
      description: 'Create a new customer order',
      icon: DocumentPlusIcon,
      href: '/orders/new',
      color: 'bg-blue-500',
    },
    {
      title: 'Record Payment',
      description: 'Record a new payment',
      icon: CurrencyDollarIcon,
      href: '/payments/record',
      color: 'bg-green-500',
    },
    {
      title: 'Add Customer',
      description: 'Register a new customer',
      icon: UserPlusIcon,
      href: '/customers/new',
      color: 'bg-purple-500',
    },
    {
      title: 'Add Product',
      description: 'Create a new product',
      icon: PlusIcon,
      href: '/products/new',
      color: 'bg-orange-500',
    },
    {
      title: 'Test API',
      description: 'Test backend API endpoints',
      icon: ClipboardDocumentCheckIcon,
      href: '/api-test',
      color: 'bg-indigo-500',
    },
  ];

  // Chart data
  const earningsChartData = {
    labels: stats.earningsData.labels,
    datasets: [
      {
        label: 'Earnings (KES)',
        data: stats.earningsData.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const orderStatusChartData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          stats.orderStatusData.pending,
          stats.orderStatusData.inProgress,
          stats.orderStatusData.completed,
          stats.orderStatusData.cancelled,
        ],
        backgroundColor: [
          'rgba(255, 159, 64, 0.7)',  // Orange for pending
          'rgba(54, 162, 235, 0.7)',  // Blue for in progress
          'rgba(75, 192, 192, 0.7)',  // Green for completed
          'rgba(255, 99, 132, 0.7)',  // Red for cancelled
        ],
        borderColor: [
          'rgb(255, 159, 64)',
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const debtChartData = {
    labels: stats.debtData.labels,
    datasets: [
      {
        label: 'Outstanding Debt (KES)',
        data: stats.debtData.data,
        backgroundColor: 'rgba(220, 38, 38, 0.7)',
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `KES ${value.toLocaleString()}`;
          }
        },
      },
    },
    maintainAspectRatio: false,
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `KES ${value.toLocaleString()}`;
          }
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
            <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-600" />
          </div>
        );
      case 'payment':
        return (
          <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
            <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
          </div>
        );
      case 'customer':
        return (
          <div className="flex-shrink-0 rounded-full bg-purple-100 p-2">
            <UserPlusIcon className="h-5 w-5 text-purple-600" />
          </div>
        );
      case 'quote':
        return (
          <div className="flex-shrink-0 rounded-full bg-orange-100 p-2">
            <DocumentPlusIcon className="h-5 w-5 text-orange-600" />
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 rounded-full bg-gray-100 p-2">
            <BellAlertIcon className="h-5 w-5 text-gray-600" />
          </div>
        );
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your business performance and key metrics
        </p>
      </div>
      
      {/* API Status */}
      <ApiStatus showDetails={true} />

      {/* Key Metrics */}
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              KES {stats.totalEarnings.toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-green-600">
              <span className="font-medium">↑ 12%</span>
              <span className="text-gray-500"> vs last month</span>
            </p>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
              <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-xs font-medium text-yellow-800">{stats.pendingOrders}</span>
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.pendingOrders}</p>
            <p className="mt-2 text-xs text-yellow-600">
              <span className="font-medium">Requires attention</span>
            </p>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs font-medium text-green-800">{stats.completedOrders}</span>
              </div>
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.completedOrders}</p>
            <p className="mt-2 text-xs text-green-600">
              <span className="font-medium">↑ 8%</span>
              <span className="text-gray-500"> vs last month</span>
            </p>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Outstanding Debts</h3>
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              KES {stats.outstandingDebts.toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-red-600">
              <span className="font-medium">↑ 3%</span>
              <span className="text-gray-500"> vs last month</span>
            </p>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Link 
              href={action.href} 
              key={index}
              className="group relative block overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md hover:border-gray-300"
            >
              <div className="flex items-center">
                <div className={`${action.color} rounded-lg p-2 text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Earnings Overview</h3>
          {isLoading ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ) : (
            <div className="h-64">
              <Line data={earningsChartData} options={lineChartOptions} />
            </div>
          )}
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Order Status</h3>
          {isLoading ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ) : (
            <div className="h-64">
              <Doughnut data={orderStatusChartData} options={doughnutChartOptions} />
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Outstanding Debts by Age</h3>
          {isLoading ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ) : (
            <div className="h-64">
              <Bar data={debtChartData} options={barChartOptions} />
            </div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
            <Link href="/notifications" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3 space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  {getActivityIcon(activity.type)}
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    {activity.status && (
                      <span className={`inline-flex mt-1 items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
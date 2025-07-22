import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { getOrders, bulkUpdateOrderStatus, bulkAssignOrders } from '../../services/orderService';
import { Order, PaginatedResponse } from '../../types';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentTextIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';

const OrdersPage: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: router.query.status as string || '',
    startDate: '',
    endDate: '',
    customerId: '',
    assignedTo: '',
    search: '',
  });
  
  // Selected orders for bulk actions
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Bulk action states
  const [showBulkStatusUpdate, setShowBulkStatusUpdate] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [showBulkAssign, setShowBulkAssign] = useState(false);
  const [bulkAssignWorker, setBulkAssignWorker] = useState('');
  
  // Workers list (would come from API in real implementation)
  const workers = [
    { id: '1', name: 'John Doe', role: 'worker' },
    { id: '2', name: 'Jane Smith', role: 'worker' },
    { id: '3', name: 'Mike Johnson', role: 'worker' },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders({
        status: filters.status as any || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        customerId: filters.customerId || undefined,
        assignedTo: filters.assignedTo || undefined,
        search: filters.search || undefined,
        page: pagination.page,
        pageSize: pagination.pageSize
      });
      
      setOrders(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Handle error - show toast notification
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    // Update URL with status filter if present
    if (filters.status) {
      router.push({
        pathname: router.pathname,
        query: { status: filters.status }
      }, undefined, { shallow: true });
    } else if (router.query.status) {
      router.push({
        pathname: router.pathname
      }, undefined, { shallow: true });
    }
  }, [filters.status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pagination.page = 1; // Reset to first page on new search
    fetchOrders();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedOrders.length === 0) return;
    
    try {
      await bulkUpdateOrderStatus(selectedOrders, bulkStatus as any);
      setShowBulkStatusUpdate(false);
      setBulkStatus('');
      setSelectedOrders([]);
      fetchOrders();
      // Show success toast
    } catch (error) {
      console.error('Failed to update order statuses:', error);
      // Show error toast
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkAssignWorker || selectedOrders.length === 0) return;
    
    try {
      await bulkAssignOrders(selectedOrders, bulkAssignWorker);
      setShowBulkAssign(false);
      setBulkAssignWorker('');
      setSelectedOrders([]);
      fetchOrders();
      // Show success toast
    } catch (error) {
      console.error('Failed to assign orders:', error);
      // Show error toast
    }
  };

  const getStatusBadgeClass = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-500 mr-1" />;
      case 'in_progress':
        return <ArrowPathIcon className="h-4 w-4 text-blue-500 mr-1" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout title="Order Management">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <Card>
              {/* Search and filters */}
              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search orders by reference, customer name, or phone..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <FunnelIcon className="h-4 w-4 mr-2" />
                      Filters
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={fetchOrders}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                  </div>
                </form>
                
                {/* Advanced filters */}
                {showFilters && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                      label="Status"
                      value={filters.status}
                      onChange={(value) => handleFilterChange('status', value)}
                      options={[
                        { value: '', label: 'All Statuses' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' },
                      ]}
                    />
                    <Input
                      label="Start Date"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                    <Select
                      label="Assigned To"
                      value={filters.assignedTo}
                      onChange={(value) => handleFilterChange('assignedTo', value)}
                      options={[
                        { value: '', label: 'All Workers' },
                        ...workers.map(worker => ({ value: worker.id, label: worker.name }))
                      ]}
                    />
                  </div>
                )}
              </div>
              
              {/* Bulk actions */}
              {selectedOrders.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedOrders.length} orders selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBulkStatusUpdate(true)}
                      className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Update Status
                    </button>
                    {user?.role === 'owner' && (
                      <button
                        type="button"
                        onClick={() => setShowBulkAssign(true)}
                        className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Assign to Worker
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedOrders([])}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Clear Selection
                    </button>
                  </div>
                  
                  {/* Bulk status update modal */}
                  {showBulkStatusUpdate && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Update Order Status</h3>
                        <Select
                          label="New Status"
                          value={bulkStatus}
                          onChange={(value) => setBulkStatus(value)}
                          options={[
                            { value: '', label: 'Select Status' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'in_progress', label: 'In Progress' },
                            { value: 'completed', label: 'Completed' },
                            { value: 'cancelled', label: 'Cancelled' },
                          ]}
                        />
                        <div className="mt-5 sm:mt-6 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowBulkStatusUpdate(false)}
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleBulkStatusUpdate}
                            disabled={!bulkStatus}
                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Bulk assign modal */}
                  {showBulkAssign && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Orders to Worker</h3>
                        <Select
                          label="Select Worker"
                          value={bulkAssignWorker}
                          onChange={(value) => setBulkAssignWorker(value)}
                          options={[
                            { value: '', label: 'Select Worker' },
                            ...workers.map(worker => ({ value: worker.id, label: worker.name }))
                          ]}
                        />
                        <div className="mt-5 sm:mt-6 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowBulkAssign(false)}
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleBulkAssign}
                            disabled={!bulkAssignWorker}
                            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Orders table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={selectedOrders.length === orders.length && orders.length > 0}
                            onChange={toggleSelectAll}
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading orders...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                          No orders found. Try adjusting your filters.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => toggleSelectOrder(order.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <Link href={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-900">
                                {order.reference}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                                <div className="text-sm text-gray-500">{order.customer.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            KES {order.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {order.paidAmount >= order.totalAmount ? (
                              <span className="text-green-600 font-medium">Paid</span>
                            ) : order.paidAmount > 0 ? (
                              <span className="text-yellow-600 font-medium">Partial</span>
                            ) : (
                              <span className="text-red-600 font-medium">Unpaid</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.assignedTo ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Worker Name
                              </span>
                            ) : (
                              <span className="text-gray-400">Unassigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link href={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-900 mr-3">
                              View
                            </Link>
                            <Link href={`/orders/${order.id}/edit`} className="text-primary-600 hover:text-primary-900">
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{orders.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              pagination.page === pageNum
                                ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { getOrderById, updateOrderStatus, assignOrderToWorker, updateOrderEstimatedCompletion } from '../../../services/orderService';
import { Order } from '../../../types';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../../hooks/useAuth';

const OrderDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit states
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [isEditingEstimatedCompletion, setIsEditingEstimatedCompletion] = useState(false);
  const [newEstimatedCompletion, setNewEstimatedCompletion] = useState('');
  
  // Workers list (would come from API in real implementation)
  const workers = [
    { id: '1', name: 'John Doe', role: 'worker' },
    { id: '2', name: 'Jane Smith', role: 'worker' },
    { id: '3', name: 'Mike Johnson', role: 'worker' },
  ];

  const fetchOrder = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await getOrderById(id as string);
      setOrder(response.data);
      setNewStatus(response.data.status);
      setNewAssignedTo(response.data.assignedTo || '');
      setNewEstimatedCompletion(response.data.estimatedCompletion || '');
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!order || !newStatus) return;
    
    try {
      const response = await updateOrderStatus(order.id, newStatus as any);
      setOrder(response.data);
      setIsEditingStatus(false);
      // Show success toast
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Show error toast
    }
  };

  const handleAssignmentUpdate = async () => {
    if (!order) return;
    
    try {
      const response = await assignOrderToWorker(order.id, newAssignedTo);
      setOrder(response.data);
      setIsEditingAssignment(false);
      // Show success toast
    } catch (error) {
      console.error('Failed to assign order:', error);
      // Show error toast
    }
  };

  const handleEstimatedCompletionUpdate = async () => {
    if (!order || !newEstimatedCompletion) return;
    
    try {
      const response = await updateOrderEstimatedCompletion(order.id, newEstimatedCompletion);
      setOrder(response.data);
      setIsEditingEstimatedCompletion(false);
      // Show success toast
    } catch (error) {
      console.error('Failed to update estimated completion:', error);
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
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <Card>
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading order details...</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout title="Order Details">
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <Card>
                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
                    <p className="mt-4 text-gray-500">{error || 'Order not found'}</p>
                    <button
                      onClick={() => router.push('/orders')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Back to Orders
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Order ${order.reference}`}>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/orders" className="text-primary-600 hover:text-primary-900">
                <span className="sr-only">Back to orders</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">Order {order.reference}</h1>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/orders/${order.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Order
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Print / Download
              </button>
            </div>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {/* Order Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Order details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Status Card */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
                    {!isEditingStatus && user?.role !== 'payment_admin' && (
                      <button
                        onClick={() => setIsEditingStatus(true)}
                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        Change Status
                      </button>
                    )}
                  </div>
                  
                  {isEditingStatus ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <Select
                        label="Status"
                        value={newStatus}
                        onChange={(value) => setNewStatus(value)}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'in_progress', label: 'In Progress' },
                          { value: 'completed', label: 'Completed' },
                          { value: 'cancelled', label: 'Cancelled' },
                        ]}
                      />
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          onClick={() => setIsEditingStatus(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleStatusUpdate}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-6">
                        <div className={`p-3 rounded-full ${getStatusBadgeClass(order.status)} mr-4`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Current Status</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Timeline */}
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        <div className="relative flex items-start mb-6">
                          <div className="flex items-center h-6">
                            <div className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary-600 rounded-full">
                              <CheckCircleIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Order Received</p>
                            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-start mb-6">
                          <div className="flex items-center h-6">
                            <div className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full ${
                              order.status === 'pending' || order.status === 'in_progress' || order.status === 'completed' 
                                ? 'bg-primary-600' 
                                : 'bg-gray-300'
                            }`}>
                              <ClockIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Processing</p>
                            <p className="text-xs text-gray-500">
                              {order.status === 'pending' ? 'Current stage' : 'Completed'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-start mb-6">
                          <div className="flex items-center h-6">
                            <div className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full ${
                              order.status === 'in_progress' || order.status === 'completed' 
                                ? 'bg-primary-600' 
                                : 'bg-gray-300'
                            }`}>
                              <ArrowPathIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">In Production</p>
                            <p className="text-xs text-gray-500">
                              {order.status === 'in_progress' ? 'Current stage' : (
                                order.status === 'completed' ? 'Completed' : 'Not started'
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-start">
                          <div className="flex items-center h-6">
                            <div className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full ${
                              order.status === 'completed' 
                                ? 'bg-primary-600' 
                                : 'bg-gray-300'
                            }`}>
                              <CheckCircleIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Completed</p>
                            <p className="text-xs text-gray-500">
                              {order.status === 'completed' ? formatDate(order.updatedAt) : 'Not completed yet'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
                
                {/* Order Items */}
                <Card>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.orderItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {item.product.imageUrl && (
                                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                                    <img 
                                      className="h-10 w-10 rounded-md object-cover" 
                                      src={item.product.imageUrl} 
                                      alt={item.product.name} 
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                                  {item.customizationNotes && (
                                    <div className="text-xs text-gray-500">{item.customizationNotes}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              KES {item.unitPrice.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              KES {(item.quantity * item.unitPrice).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                            Subtotal
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                            KES {order.subtotal.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                            Delivery Fee
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                            KES {order.deliveryFee.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                            Total
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-900 font-bold">
                            KES {order.totalAmount.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </Card>
                
                {/* Design Files */}
                {order.designFiles.length > 0 && (
                  <Card>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Design Files</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {order.designFiles.map((file) => (
                        <div key={file.id} className="border border-gray-200 rounded-md p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900 truncate" title={file.filename}>
                              {file.filename}
                            </p>
                            <a 
                              href={file.cloudinaryUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <ArrowDownTrayIcon className="h-5 w-5" />
                            </a>
                          </div>
                          <p className="text-xs text-gray-500">
                            {(file.fileSize / 1024).toFixed(2)} KB • {file.mimeType}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded on {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                
                {/* Payment History */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
                    <Link
                      href={`/payments/record?orderId=${order.id}`}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      Record Payment
                    </Link>
                  </div>
                  
                  <div className="mb-4 flex items-center justify-between bg-gray-50 p-4 rounded-md">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-900">KES {order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Paid Amount</p>
                      <p className="text-lg font-semibold text-gray-900">KES {order.paidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className={`text-lg font-semibold ${
                        order.totalAmount - order.paidAmount > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        KES {(order.totalAmount - order.paidAmount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`text-sm font-medium ${
                        order.paidAmount >= order.totalAmount 
                          ? 'text-green-600' 
                          : order.paidAmount > 0 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {order.paidAmount >= order.totalAmount 
                          ? 'Fully Paid' 
                          : order.paidAmount > 0 
                            ? 'Partially Paid' 
                            : 'Unpaid'}
                      </p>
                    </div>
                  </div>
                  
                  {order.payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Method
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reference
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {order.payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(payment.recordedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                KES {payment.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.paymentMethod === 'mpesa_stk_push' 
                                  ? 'Mpesa STK Push' 
                                  : payment.paymentMethod === 'mpesa_paybill' 
                                    ? 'Mpesa Paybill' 
                                    : 'Cash'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  payment.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : payment.status === 'pending' || payment.status === 'awaiting_confirmation'
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1).replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.mpesaTransactionId || payment.paybillConfirmationCode || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No payments recorded yet
                    </div>
                  )}
                </Card>
                
                {/* Notes */}
                <Card>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Notes</h2>
                  {order.notes ? (
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                      {order.notes}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No notes for this order
                    </div>
                  )}
                </Card>
              </div>
              
              {/* Right column - Customer and Order Info */}
              <div className="space-y-6">
                {/* Customer Info */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
                    <Link
                      href={`/customers/${order.customer.id}`}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      View Profile
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">Customer since {new Date(order.customer.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer.phone}</p>
                        <p className="text-xs text-gray-500">Primary contact</p>
                      </div>
                    </div>
                    
                    {order.customer.email && (
                      <div className="flex items-start">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer.email}</p>
                          <p className="text-xs text-gray-500">Email address</p>
                        </div>
                      </div>
                    )}
                    
                    {order.customer.address && (
                      <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer.address}</p>
                          <p className="text-xs text-gray-500">Address</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">KES {order.customer.totalDebt.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Total outstanding debt</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Order Info */}
                <Card>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.reference}</p>
                        <p className="text-xs text-gray-500">Order reference</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                        <p className="text-xs text-gray-500">Order date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center text-gray-400 mt-0.5 mr-3">
                        {order.fulfillmentType === 'pickup' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery'}
                        </p>
                        <p className="text-xs text-gray-500">Fulfillment type</p>
                      </div>
                    </div>
                    
                    {order.fulfillmentType === 'delivery' && order.deliveryAddress && (
                      <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.deliveryAddress}</p>
                          <p className="text-xs text-gray-500">Delivery address</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center text-gray-400 mt-0.5 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        {isEditingEstimatedCompletion ? (
                          <div className="w-full">
                            <Input
                              type="datetime-local"
                              value={newEstimatedCompletion}
                              onChange={(e) => setNewEstimatedCompletion(e.target.value)}
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                              <button
                                onClick={() => setIsEditingEstimatedCompletion(false)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleEstimatedCompletionUpdate}
                                className="px-2 py-1 text-xs border border-transparent rounded-md shadow-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {order.estimatedCompletion 
                                  ? formatDate(order.estimatedCompletion) 
                                  : 'Not set'}
                              </p>
                              {user?.role !== 'payment_admin' && (
                                <button
                                  onClick={() => setIsEditingEstimatedCompletion(true)}
                                  className="text-primary-600 hover:text-primary-900 text-xs"
                                >
                                  <PencilIcon className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">Estimated completion</p>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        {isEditingAssignment ? (
                          <div className="w-full">
                            <Select
                              value={newAssignedTo}
                              onChange={(value) => setNewAssignedTo(value)}
                              options={[
                                { value: '', label: 'Unassigned' },
                                ...workers.map(worker => ({ value: worker.id, label: worker.name }))
                              ]}
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                              <button
                                onClick={() => setIsEditingAssignment(false)}
                                className="px-2 py-1 text-xs border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAssignmentUpdate}
                                className="px-2 py-1 text-xs border border-transparent rounded-md shadow-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {order.assignedTo ? 'Worker Name' : 'Unassigned'}
                              </p>
                              {user?.role === 'owner' && (
                                <button
                                  onClick={() => setIsEditingAssignment(true)}
                                  className="text-primary-600 hover:text-primary-900 text-xs"
                                >
                                  <PencilIcon className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">Assigned worker</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Related Orders */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Customer's Other Orders</h2>
                    <Link
                      href={`/orders?customerId=${order.customer.id}`}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center"
                    >
                      View All
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  
                  <div className="text-center py-6 text-gray-500">
                    No other orders from this customer
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetailPage;
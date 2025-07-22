import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import { Customer, Order, Payment } from '../../../types';
import { customerService } from '../../../services/customerService';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  PencilIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';

export default function CustomerDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch customer details
        const customerResponse = await customerService.getCustomer(id as string);
        setCustomer(customerResponse.data);
        
        // Fetch customer orders
        const ordersResponse = await customerService.getCustomerOrders(id as string);
        setOrders(ordersResponse.data.orders || []);
        
        // Fetch customer payments
        const paymentsResponse = await customerService.getCustomerPayments(id as string);
        setPayments(paymentsResponse.data || []);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch customer data:', err);
        setError('Failed to load customer information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  // Handle adding a note to the customer
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !note.trim()) return;
    
    setAddingNote(true);
    try {
      await customerService.addCustomerNote(id as string, note);
      setNote('');
      // Refresh customer data to show the new note
      const customerResponse = await customerService.getCustomer(id as string);
      setCustomer(customerResponse.data);
    } catch (err) {
      console.error('Failed to add note:', err);
      setError('Failed to add note. Please try again.');
    } finally {
      setAddingNote(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Customer Details">
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !customer) {
    return (
      <AdminLayout title="Customer Details">
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error || 'Customer not found'}</p>
                  <div className="mt-4">
                    <Link
                      href="/customers"
                      className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2" />
                      Back to Customers
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Customer: ${customer.name}`}>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          {/* Back button and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <Link
                href="/customers"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Customers
              </Link>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/customers/${customer.id}/edit`}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Customer
              </Link>
              <Link
                href={`/payments/record?customer_id=${customer.id}`}
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                Record Payment
              </Link>
            </div>
          </div>

          {/* Customer overview */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6 md:border-r md:border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 text-xl font-medium">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                    <p className="text-sm text-gray-500">
                      Customer since {formatDate(customer.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                  
                  {customer.email && (
                    <div className="flex items-start">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {customer.address && (
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-500">{customer.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-2/3 md:pl-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className={`h-8 w-8 ${customer.totalDebt > 0 ? 'text-red-500' : 'text-green-500'}`} />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Outstanding Debt</p>
                        <p className={`text-xl font-semibold ${customer.totalDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(customer.totalDebt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-8 w-8 text-primary-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <p className="text-xl font-semibold text-gray-900">{orders.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-8 w-8 text-primary-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-500">Total Spent</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {formatCurrency(payments.reduce((sum, payment) => sum + payment.amount, 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs for Orders, Payments, and Notes */}
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-primary-100 p-1 mb-6">
              <Tab
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-primary-700 hover:bg-white/[0.12] hover:text-primary-800'
                  )
                }
              >
                Orders
              </Tab>
              <Tab
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-primary-700 hover:bg-white/[0.12] hover:text-primary-800'
                  )
                }
              >
                Payments
              </Tab>
              <Tab
                className={({ selected }) =>
                  clsx(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-primary-700 shadow'
                      : 'text-primary-700 hover:bg-white/[0.12] hover:text-primary-800'
                  )
                }
              >
                Notes & Communication
              </Tab>
            </Tab.List>
            
            <Tab.Panels>
              {/* Orders Panel */}
              <Tab.Panel>
                <Card>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order History</h3>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                      <p className="mt-1 text-sm text-gray-500">This customer hasn't placed any orders.</p>
                      <div className="mt-6">
                        <Link
                          href="/orders/new"
                          className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Create New Order
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reference
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
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
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.reference}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={clsx(
                                  'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                  {
                                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                                    'bg-blue-100 text-blue-800': order.status === 'in_progress',
                                    'bg-green-100 text-green-800': order.status === 'completed',
                                    'bg-red-100 text-red-800': order.status === 'cancelled',
                                  }
                                )}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(order.totalAmount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(order.paidAmount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/orders/${order.id}`}
                                  className="text-primary-600 hover:text-primary-900"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </Tab.Panel>
              
              {/* Payments Panel */}
              <Tab.Panel>
                <Card>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
                  
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No payments yet</h3>
                      <p className="mt-1 text-sm text-gray-500">This customer hasn't made any payments.</p>
                      <div className="mt-6">
                        <Link
                          href={`/payments/record?customer_id=${customer.id}`}
                          className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Record Payment
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300">
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
                              Order Ref
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(payment.recordedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(payment.amount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link href={`/orders/${payment.orderId}`} className="text-primary-600 hover:text-primary-900">
                                  {payment.orderId.substring(0, 8)}...
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={clsx(
                                  'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                  {
                                    'bg-yellow-100 text-yellow-800': payment.status === 'pending',
                                    'bg-green-100 text-green-800': payment.status === 'completed',
                                    'bg-red-100 text-red-800': payment.status === 'failed',
                                    'bg-blue-100 text-blue-800': payment.status === 'awaiting_confirmation',
                                  }
                                )}>
                                  {payment.status.replace('_', ' ').charAt(0).toUpperCase() + payment.status.replace('_', ' ').slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.notes || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </Tab.Panel>
              
              {/* Notes & Communication Panel */}
              <Tab.Panel>
                <Card>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Notes & Communication</h3>
                  
                  {/* Add Note Form */}
                  <div className="mb-6">
                    <form onSubmit={handleAddNote}>
                      <div className="mb-4">
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                          Add a Note
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="note"
                            name="note"
                            rows={3}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="Add notes about this customer, communication details, or follow-up reminders..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={addingNote || !note.trim()}
                          className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingNote ? 'Adding...' : 'Add Note'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Notes List - This would be populated from the customer data */}
                  <div className="space-y-4">
                    {/* Example note - in a real implementation, this would come from the API */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">Admin User</span>
                            <span className="text-gray-500 ml-2">
                              <ClockIcon className="inline-block h-4 w-4 mr-1" />
                              {formatDate(new Date().toISOString())}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-700">
                            <p>
                              Customer prefers to be contacted via WhatsApp. Interested in bulk order discounts for business cards.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* If there are no notes */}
                    {/* 
                    <div className="text-center py-8">
                      <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Add notes about this customer to keep track of important information.</p>
                    </div>
                    */}
                  </div>
                </Card>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </AdminLayout>
  );
}
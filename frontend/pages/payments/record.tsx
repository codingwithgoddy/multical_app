import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Customer, Order } from '../../types';
import paymentService from '../../services/paymentService';
import customerService from '../../services/customerService';
import orderService from '../../services/orderService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function RecordPaymentPage() {
  const router = useRouter();
  const { orderId, customerId } = router.query;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const [formData, setFormData] = useState({
    customerId: customerId as string || '',
    orderId: orderId as string || '',
    amount: '',
    paymentMethod: 'cash',
    mpesaTransactionId: '',
    paybillReference: '',
    paybillConfirmationCode: '',
    customerPhone: '',
    notes: '',
  });
  
  // Fetch customers and orders on component mount
  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, []);
  
  // Filter orders when customer changes
  useEffect(() => {
    if (formData.customerId) {
      const filteredOrders = orders.filter(order => order.customerId === formData.customerId);
      setCustomerOrders(filteredOrders);
      
      // If there's only one order for this customer, auto-select it
      if (filteredOrders.length === 1 && !formData.orderId) {
        setFormData(prev => ({
          ...prev,
          orderId: filteredOrders[0].id,
        }));
      }
    } else {
      setCustomerOrders([]);
    }
  }, [formData.customerId, orders]);
  
  // Auto-fill amount when order is selected
  useEffect(() => {
    if (formData.orderId) {
      const selectedOrder = orders.find(order => order.id === formData.orderId);
      if (selectedOrder) {
        const remainingAmount = selectedOrder.totalAmount - selectedOrder.paidAmount;
        setFormData(prev => ({
          ...prev,
          amount: remainingAmount.toString(),
          customerId: selectedOrder.customerId,
        }));
      }
    }
  }, [formData.orderId, orders]);
  
  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await customerService.getCustomers();
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };
  
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await orderService.getOrders({ status: 'pending,in_progress' });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateForm = () => {
    if (!formData.customerId) {
      setError('Please select a customer');
      return false;
    }
    
    if (!formData.orderId) {
      setError('Please select an order');
      return false;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (formData.paymentMethod === 'mpesa_paybill') {
      if (!formData.paybillReference || !formData.paybillConfirmationCode || !formData.customerPhone) {
        setError('Please fill in all M-Pesa Paybill details');
        return false;
      }
    }
    
    if (formData.paymentMethod === 'mpesa_stk_push') {
      if (!formData.customerPhone) {
        setError('Please enter customer phone number for STK Push');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (formData.paymentMethod === 'mpesa_stk_push') {
        // Handle STK Push
        await paymentService.initiateStkPush(
          formData.orderId,
          formData.customerId,
          parseFloat(formData.amount),
          formData.customerPhone
        );
        setSuccess('M-Pesa STK Push initiated successfully. Customer should receive a prompt on their phone.');
      } else {
        // Handle manual payment recording
        await paymentService.recordPayment({
          orderId: formData.orderId,
          customerId: formData.customerId,
          amount: parseFloat(formData.amount),
          paymentMethod: formData.paymentMethod as 'mpesa_stk_push' | 'mpesa_paybill' | 'cash',
          mpesaTransactionId: formData.mpesaTransactionId,
          paybillReference: formData.paybillReference,
          paybillConfirmationCode: formData.paybillConfirmationCode,
          customerPhone: formData.customerPhone,
          notes: formData.notes,
        });
        setSuccess('Payment recorded successfully');
        
        // Reset form after successful submission
        setFormData({
          customerId: '',
          orderId: '',
          amount: '',
          paymentMethod: 'cash',
          mpesaTransactionId: '',
          paybillReference: '',
          paybillConfirmationCode: '',
          customerPhone: '',
          notes: '',
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to record payment. Please try again.');
      console.error('Error recording payment:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Record Payment</h1>
        <Link href="/payments">
          <a className="text-primary-600 hover:text-primary-900">Back to Payments</a>
        </Link>
      </div>
      
      <Card>
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                id="customerId"
                name="customerId"
                label="Customer"
                value={formData.customerId}
                onChange={(value) => handleSelectChange('customerId', value)}
                options={[
                  { value: '', label: 'Select Customer' },
                  ...customers.map(customer => ({
                    value: customer.id,
                    label: `${customer.name} (${customer.phone})`,
                  })),
                ]}
                disabled={loadingCustomers}
              />
              {loadingCustomers && (
                <div className="mt-1 text-sm text-gray-500">Loading customers...</div>
              )}
            </div>
            
            <div>
              <Select
                id="orderId"
                name="orderId"
                label="Order"
                value={formData.orderId}
                onChange={(value) => handleSelectChange('orderId', value)}
                options={[
                  { value: '', label: 'Select Order' },
                  ...customerOrders.map(order => ({
                    value: order.id,
                    label: `${order.reference} (${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(order.totalAmount - order.paidAmount)} remaining)`,
                  })),
                ]}
                disabled={loadingOrders || !formData.customerId}
                helpText={!formData.customerId ? 'Select a customer first' : undefined}
              />
              {loadingOrders && (
                <div className="mt-1 text-sm text-gray-500">Loading orders...</div>
              )}
            </div>
            
            <div>
              <Input
                id="amount"
                name="amount"
                label="Amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                leftAddon="KES"
                placeholder="0.00"
                required
              />
            </div>
            
            <div>
              <Select
                id="paymentMethod"
                name="paymentMethod"
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(value) => handleSelectChange('paymentMethod', value)}
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'mpesa_stk_push', label: 'M-Pesa STK Push' },
                  { value: 'mpesa_paybill', label: 'M-Pesa Paybill' },
                ]}
              />
            </div>
            
            {(formData.paymentMethod === 'mpesa_stk_push' || formData.paymentMethod === 'mpesa_paybill') && (
              <div>
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  label="Customer Phone Number"
                  placeholder="e.g., 254712345678"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  helpText="Enter phone number in format 254XXXXXXXXX"
                />
              </div>
            )}
            
            {formData.paymentMethod === 'mpesa_paybill' && (
              <>
                <div>
                  <Input
                    id="paybillReference"
                    name="paybillReference"
                    label="Paybill Reference"
                    placeholder="Enter reference used by customer"
                    value={formData.paybillReference}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Input
                    id="paybillConfirmationCode"
                    name="paybillConfirmationCode"
                    label="M-Pesa Confirmation Code"
                    placeholder="e.g., QK7HPLS5JR"
                    value={formData.paybillConfirmationCode}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Input
                    id="mpesaTransactionId"
                    name="mpesaTransactionId"
                    label="M-Pesa Transaction ID"
                    placeholder="Enter transaction ID from SMS"
                    value={formData.mpesaTransactionId}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Add any additional notes about this payment"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Link href="/payments">
              <a className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Cancel
              </a>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Record Payment'
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
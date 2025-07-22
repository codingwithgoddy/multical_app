import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Payment } from '../../types';
import paymentService from '../../services/paymentService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

interface ConfirmationForm {
  paymentId: string;
  mpesaTransactionId: string;
  customerPhone: string;
  paybillConfirmationCode: string;
}

export default function PendingConfirmationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  
  const [confirmationForm, setConfirmationForm] = useState<ConfirmationForm>({
    paymentId: '',
    mpesaTransactionId: '',
    customerPhone: '',
    paybillConfirmationCode: '',
  });
  
  const [confirmingPayment, setConfirmingPayment] = useState<Payment | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  
  useEffect(() => {
    fetchPendingConfirmations();
  }, []);
  
  const fetchPendingConfirmations = async () => {
    setLoading(true);
    try {
      const response = await paymentService.getPendingConfirmations();
      setPendingPayments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load pending confirmations. Please try again.');
      console.error('Error fetching pending confirmations:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmClick = (payment: Payment) => {
    setConfirmingPayment(payment);
    setConfirmationForm({
      paymentId: payment.id,
      mpesaTransactionId: '',
      customerPhone: payment.customerPhone || '',
      paybillConfirmationCode: '',
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfirmationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsConfirming(true);
    
    try {
      await paymentService.confirmPaybill(confirmationForm);
      setSuccess('Payment confirmed successfully');
      
      // Remove the confirmed payment from the list
      setPendingPayments((prev) => prev.filter((p) => p.id !== confirmationForm.paymentId));
      
      // Reset form
      setConfirmingPayment(null);
      setConfirmationForm({
        paymentId: '',
        mpesaTransactionId: '',
        customerPhone: '',
        paybillConfirmationCode: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to confirm payment. Please check the details and try again.');
      console.error('Error confirming payment:', err);
    } finally {
      setIsConfirming(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Payment Confirmations</h1>
        <Link href="/payments">
          <a className="text-primary-600 hover:text-primary-900">Back to Payments</a>
        </Link>
      </div>
      
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
      
      {confirmingPayment ? (
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Confirm M-Pesa Paybill Payment</h2>
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p className="font-medium">Payment Details</p>
            <p>Order Reference: {confirmingPayment.orderId}</p>
            <p>Amount: {formatCurrency(confirmingPayment.amount)}</p>
            <p>Paybill Reference: {confirmingPayment.paybillReference || 'N/A'}</p>
            <p>Date: {formatDate(confirmingPayment.recordedAt)}</p>
          </div>
          
          <form onSubmit={handleConfirmSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="mpesaTransactionId"
                name="mpesaTransactionId"
                label="M-Pesa Transaction ID"
                placeholder="Enter transaction ID from SMS"
                value={confirmationForm.mpesaTransactionId}
                onChange={handleInputChange}
                required
              />
              
              <Input
                id="customerPhone"
                name="customerPhone"
                label="Customer Phone Number"
                placeholder="e.g., 254712345678"
                value={confirmationForm.customerPhone}
                onChange={handleInputChange}
                required
                helpText="Enter phone number in format 254XXXXXXXXX"
              />
              
              <Input
                id="paybillConfirmationCode"
                name="paybillConfirmationCode"
                label="M-Pesa Confirmation Code"
                placeholder="e.g., QK7HPLS5JR"
                value={confirmationForm.paybillConfirmationCode}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setConfirmingPayment(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isConfirming}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirming...
                  </>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Awaiting Confirmation</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : pendingPayments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending payment confirmations found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Reference
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paybill Reference
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link href={`/orders/${payment.orderId}`}>
                          <a className="text-primary-600 hover:text-primary-900">{payment.orderId}</a>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/customers/${payment.customerId}`}>
                          <a className="text-primary-600 hover:text-primary-900">{payment.customerId}</a>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paybillReference || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.recordedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleConfirmClick(payment)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Confirm
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import paymentService from '../../services/paymentService';
import customerService from '../../services/customerService';
import Card from '../../components/ui/Card';

interface DebtSummary {
  totalDebt: number;
  customerCount: number;
  topDebtors: {
    customerId: string;
    customerName: string;
    totalDebt: number;
    phone: string;
  }[];
}

interface CustomerWithDebt {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalDebt: number;
  lastPaymentDate?: string;
}

export default function DebtTrackingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debtSummary, setDebtSummary] = useState<DebtSummary | null>(null);
  const [customers, setCustomers] = useState<CustomerWithDebt[]>([]);
  
  useEffect(() => {
    fetchDebtData();
  }, []);
  
  const fetchDebtData = async () => {
    setLoading(true);
    try {
      // Fetch debt summary
      const summaryResponse = await paymentService.getDebtSummary();
      setDebtSummary(summaryResponse.data);
      
      // Fetch customers with debt
      const customersResponse = await customerService.getCustomers({ hasDebt: 'true' });
      setCustomers(customersResponse.data);
      
      setError(null);
    } catch (err) {
      setError('Failed to load debt information. Please try again.');
      console.error('Error fetching debt data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Debt Tracking Dashboard</h1>
        <div className="flex space-x-2">
          <Link href="/payments">
            <a className="text-primary-600 hover:text-primary-900">Back to Payments</a>
          </Link>
          <button
            onClick={() => router.push('/payments/record')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Record Payment
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <h3 className="text-lg font-medium mb-2">Total Outstanding Debt</h3>
              <p className="text-3xl font-bold">{formatCurrency(debtSummary?.totalDebt || 0)}</p>
              <p className="text-sm mt-2 opacity-80">Across {debtSummary?.customerCount || 0} customers</p>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <h3 className="text-lg font-medium mb-2">Average Debt per Customer</h3>
              <p className="text-3xl font-bold">
                {debtSummary && debtSummary.customerCount > 0
                  ? formatCurrency(debtSummary.totalDebt / debtSummary.customerCount)
                  : formatCurrency(0)}
              </p>
              <p className="text-sm mt-2 opacity-80">Based on customers with outstanding balances</p>
            </Card>
            
            <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
              <h3 className="text-lg font-medium mb-2">Highest Individual Debt</h3>
              <p className="text-3xl font-bold">
                {debtSummary?.topDebtors && debtSummary.topDebtors.length > 0
                  ? formatCurrency(debtSummary.topDebtors[0].totalDebt)
                  : formatCurrency(0)}
              </p>
              <p className="text-sm mt-2 opacity-80">
                {debtSummary?.topDebtors && debtSummary.topDebtors.length > 0
                  ? debtSummary.topDebtors[0].customerName
                  : 'No debtors'}
              </p>
            </Card>
          </div>
          
          {/* Top Debtors */}
          <Card className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Debtors</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outstanding Debt
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {debtSummary?.topDebtors && debtSummary.topDebtors.length > 0 ? (
                    debtSummary.topDebtors.map((debtor) => (
                      <tr key={debtor.customerId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/customers/${debtor.customerId}`}>
                            <a className="text-primary-600 hover:text-primary-900 font-medium">
                              {debtor.customerName}
                            </a>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {debtor.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-red-600 font-medium">{formatCurrency(debtor.totalDebt)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link href={`/payments/record?customerId=${debtor.customerId}`}>
                            <a className="text-primary-600 hover:text-primary-900 mr-3">Record Payment</a>
                          </Link>
                          <Link href={`/customers/${debtor.customerId}`}>
                            <a className="text-gray-600 hover:text-gray-900">View Details</a>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No debtors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* All Customers with Debt */}
          <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">All Customers with Outstanding Balances</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outstanding Debt
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Payment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/customers/${customer.id}`}>
                            <a className="text-primary-600 hover:text-primary-900 font-medium">
                              {customer.name}
                            </a>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{customer.phone}</div>
                          {customer.email && <div className="text-xs">{customer.email}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-red-600 font-medium">{formatCurrency(customer.totalDebt)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(customer.lastPaymentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link href={`/payments/record?customerId=${customer.id}`}>
                            <a className="text-primary-600 hover:text-primary-900 mr-3">Record Payment</a>
                          </Link>
                          <Link href={`/customers/${customer.id}`}>
                            <a className="text-gray-600 hover:text-gray-900">View Details</a>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No customers with debt found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
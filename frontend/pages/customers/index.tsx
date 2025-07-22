import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Customer, PaginatedResponse } from '../../types';
import { customerService } from '../../services/customerService';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDebtOnly, setShowDebtOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load customers on initial render and when filters change
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const hasDebtParam = router.query.has_debt === 'true';
        if (hasDebtParam) {
          setShowDebtOnly(true);
        }
        
        const response = await customerService.getCustomers({
          search: searchQuery,
          hasDebt: showDebtOnly,
          sortBy,
          sortOrder,
          page: currentPage,
          pageSize
        });
        
        setCustomers(response.data);
        setTotalPages(response.totalPages);
        setTotalCustomers(response.total);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        setError('Failed to load customers. Please try again.');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [searchQuery, showDebtOnly, currentPage, pageSize, sortBy, sortOrder, router.query.has_debt]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortOrder('asc');
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

  return (
    <AdminLayout title="Customer Management">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          
          {/* Search and filters */}
          <div className="mt-4">
            <Card className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <form onSubmit={handleSearch} className="w-full md:w-96">
                  <Input
                    type="text"
                    placeholder="Search by name, phone, or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                    className="w-full"
                  />
                </form>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      id="debt-filter"
                      type="checkbox"
                      checked={showDebtOnly}
                      onChange={() => setShowDebtOnly(!showDebtOnly)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="debt-filter" className="ml-2 text-sm text-gray-700">
                      Show customers with debt only
                    </label>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowDebtOnly(false);
                      setSortBy('name');
                      setSortOrder('asc');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                  
                  <Link
                    href="/customers/new"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Add Customer
                  </Link>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Customer list */}
          <Card>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No customers found.</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange('name')}
                        >
                          <div className="flex items-center">
                            <span>Name</span>
                            {sortBy === 'name' && (
                              <span className="ml-1">
                                {sortOrder === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange('totalDebt')}
                        >
                          <div className="flex items-center">
                            <span>Outstanding Debt</span>
                            {sortBy === 'totalDebt' && (
                              <span className="ml-1">
                                {sortOrder === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange('createdAt')}
                        >
                          <div className="flex items-center">
                            <span>Customer Since</span>
                            {sortBy === 'createdAt' && (
                              <span className="ml-1">
                                {sortOrder === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-700 font-medium">
                                  {customer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  <Link href={`/customers/${customer.id}`} className="hover:text-primary-600">
                                    {customer.name}
                                  </Link>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {customer.address || 'No address provided'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                              {customer.phone}
                            </div>
                            {customer.email && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                                {customer.email}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center ${customer.totalDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                              <span className="font-medium">
                                {formatCurrency(customer.totalDebt)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/customers/${customer.id}`}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              View
                            </Link>
                            <Link
                              href={`/customers/${customer.id}/edit`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * pageSize, totalCustomers)}
                        </span>{' '}
                        of <span className="font-medium">{totalCustomers}</span> customers
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        
                        {/* Page numbers - simplified for brevity */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Show pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
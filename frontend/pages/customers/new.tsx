import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { customerService } from '../../services/customerService';
import { 
  ArrowLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function NewCustomerPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      phone: '',
      address: ''
    };
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Validate email (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    // Validate phone
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[0-9+\s()-]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid phone number format';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await customerService.createCustomer(formData);
      router.push(`/customers/${response.data.id}`);
    } catch (err) {
      console.error('Failed to create customer:', err);
      setError('Failed to create customer. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New Customer">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Add New Customer</h1>
            <Link
              href="/customers"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Customers
            </Link>
          </div>

          <Card>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Input
                      id="name"
                      name="name"
                      label="Customer Name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      error={formErrors.name}
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      error={formErrors.phone}
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      id="email"
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={formErrors.email}
                      helpText="Optional"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <Input
                      id="address"
                      name="address"
                      label="Address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      error={formErrors.address}
                      helpText="Optional"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/customers"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Customer'}
                  </button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
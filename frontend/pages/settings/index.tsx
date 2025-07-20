import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Head from 'next/head';

export default function Settings() {
  return (
    <>
      <Head>
        <title>Settings | MultiPrints Admin</title>
        <meta name="description" content="MultiPrints Admin Dashboard Settings" />
      </Head>
      <AdminLayout title="Settings">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system settings and configurations
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-semibold leading-6 text-gray-900">General Settings</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Name</p>
                  <p className="text-sm text-gray-500">The name of your business as it appears to customers</p>
                </div>
                <div className="w-1/3">
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="MultiPrints"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Contact Email</p>
                  <p className="text-sm text-gray-500">Email address displayed on customer-facing pages</p>
                </div>
                <div className="w-1/3">
                  <input
                    type="email"
                    className="form-input"
                    defaultValue="contact@multiprints.com"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Contact Phone</p>
                  <p className="text-sm text-gray-500">Phone number displayed on customer-facing pages</p>
                </div>
                <div className="w-1/3">
                  <input
                    type="tel"
                    className="form-input"
                    defaultValue="+254 712 345 678"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" className="btn-primary">
                Save Changes
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold leading-6 text-gray-900">Payment Settings</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">M-Pesa Paybill Number</p>
                  <p className="text-sm text-gray-500">The paybill number customers will use for payments</p>
                </div>
                <div className="w-1/3">
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="123456"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">M-Pesa Business Short Code</p>
                  <p className="text-sm text-gray-500">Used for STK Push integration</p>
                </div>
                <div className="w-1/3">
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="123456"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable STK Push</p>
                  <p className="text-sm text-gray-500">Allow customers to pay via M-Pesa STK Push</p>
                </div>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" className="btn-primary">
                Save Changes
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold leading-6 text-gray-900">System Settings</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">Put the customer website in maintenance mode</p>
                </div>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Debug Mode</p>
                  <p className="text-sm text-gray-500">Enable detailed error messages (not recommended for production)</p>
                </div>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" className="btn-primary">
                Save Changes
              </button>
            </div>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
}
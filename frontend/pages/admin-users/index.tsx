import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';

export default function AdminUsers() {
  return (
    <AdminLayout title="Admin Users">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage admin users and their permissions
        </p>
      </div>

      <Card>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Users</h3>
            <p className="mt-1 text-sm text-gray-500">
              A list of all admin users including their name, role, and status.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="btn-primary"
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      John Doe
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">john@multiprints.com</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Owner</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-primary-600 hover:text-primary-900">
                        Edit
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      Jane Smith
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">jane@multiprints.com</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Payment Admin</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-primary-600 hover:text-primary-900">
                        Edit
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      Robert Johnson
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">robert@multiprints.com</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Worker</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Inactive
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-primary-600 hover:text-primary-900">
                        Edit
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
}
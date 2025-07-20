import React, { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import clsx from 'clsx';

// Define navigation items with role-based access control
const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon,
    roles: ['owner', 'payment_admin', 'worker'] // All roles can access
  },
  { 
    name: 'Products', 
    href: '/products', 
    icon: ShoppingBagIcon,
    roles: ['owner', 'worker'] // Only owners and workers can manage products
  },
  { 
    name: 'Orders', 
    href: '/orders', 
    icon: DocumentDuplicateIcon,
    roles: ['owner', 'payment_admin', 'worker'] // All roles can access
  },
  { 
    name: 'Customers', 
    href: '/customers', 
    icon: UsersIcon,
    roles: ['owner', 'payment_admin'] // Only owners and payment admins can access customer data
  },
  { 
    name: 'Payments', 
    href: '/payments', 
    icon: CurrencyDollarIcon,
    roles: ['owner', 'payment_admin'] // Only owners and payment admins can handle payments
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: ChartPieIcon,
    roles: ['owner'] // Only owners can access analytics
  },
  { 
    name: 'Admin Users', 
    href: '/admin-users', 
    icon: UserGroupIcon,
    roles: ['owner'] // Only owners can manage other admin users
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Cog6ToothIcon,
    roles: ['owner'] // Only owners can access settings
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-700 px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <h1 className="text-2xl font-bold tracking-tight text-white">MultiPrints</h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation
                              .filter(item => user?.role && item.roles.includes(user.role))
                              .map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className={clsx(
                                      router.pathname === item.href
                                        ? 'bg-primary-800 text-white'
                                        : 'text-primary-200 hover:bg-primary-800 hover:text-white',
                                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                    )}
                                  >
                                    <item.icon
                                      className={clsx(
                                        router.pathname === item.href
                                          ? 'text-white'
                                          : 'text-primary-200 group-hover:text-white',
                                        'h-6 w-6 shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-700 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <h1 className="text-2xl font-bold tracking-tight text-white">MultiPrints</h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation
                      .filter(item => user?.role && item.roles.includes(user.role))
                      .map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={clsx(
                              router.pathname === item.href
                                ? 'bg-primary-800 text-white'
                                : 'text-primary-200 hover:bg-primary-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            )}
                          >
                            <item.icon
                              className={clsx(
                                router.pathname === item.href
                                  ? 'text-white'
                                  : 'text-primary-200 group-hover:text-white',
                                'h-6 w-6 shrink-0'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white">
                    <div className="h-8 w-8 rounded-full bg-primary-800 flex items-center justify-center">
                      <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">{user?.username || 'User'}</span>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-primary-700 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-primary-200 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            {title}
          </div>
          <Link href="#">
            <span className="sr-only">Your profile</span>
            <div className="h-8 w-8 rounded-full bg-primary-800 flex items-center justify-center text-white">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </Link>
        </div>

        <main className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Notification dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    {/* Notification badge */}
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-80 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        <Menu.Item>
                          <div className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                  <DocumentDuplicateIcon className="h-4 w-4 text-primary-600" />
                                </div>
                              </div>
                              <div className="ml-3 w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">New order received</p>
                                <p className="mt-1 text-sm text-gray-500">Order #12345 from John Doe</p>
                                <p className="mt-1 text-xs text-gray-400">5 minutes ago</p>
                              </div>
                            </div>
                          </div>
                        </Menu.Item>
                        <Menu.Item>
                          <div className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                  <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                                </div>
                              </div>
                              <div className="ml-3 w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">Payment received</p>
                                <p className="mt-1 text-sm text-gray-500">KES 2,500 for Order #12340</p>
                                <p className="mt-1 text-xs text-gray-400">1 hour ago</p>
                              </div>
                            </div>
                          </div>
                        </Menu.Item>
                      </div>
                      <div className="border-t border-gray-100 px-4 py-2">
                        <Link href="/notifications" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                          View all notifications
                        </Link>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                        {user?.username || 'User'}
                      </span>
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={clsx(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900'
                            )}
                          >
                            Your profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={clsx(
                              active ? 'bg-gray-50' : '',
                              'block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
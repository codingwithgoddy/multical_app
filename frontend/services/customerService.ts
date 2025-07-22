import { ApiResponse, Customer, PaginatedResponse, Payment } from '../types';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

interface CustomerFilters {
  search?: string;
  hasDebt?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const customerService = {
  // Get all customers with optional filtering
  getCustomers: async (filters: CustomerFilters = {}): Promise<PaginatedResponse<Customer>> => {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.hasDebt !== undefined) queryParams.append('has_debt', filters.hasDebt.toString());
    if (filters.sortBy) queryParams.append('sort_by', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sort_order', filters.sortOrder);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('page_size', filters.pageSize.toString());
    
    const queryString = queryParams.toString();
    return apiGet<PaginatedResponse<Customer>>(`/customers${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get a single customer by ID
  getCustomer: async (id: string): Promise<ApiResponse<Customer>> => {
    return apiGet<ApiResponse<Customer>>(`/customers/${id}`);
  },
  
  // Get customer orders
  getCustomerOrders: async (id: string): Promise<ApiResponse<any>> => {
    return apiGet<ApiResponse<any>>(`/customers/${id}/orders`);
  },
  
  // Get customer payment history
  getCustomerPayments: async (id: string): Promise<ApiResponse<Payment[]>> => {
    return apiGet<ApiResponse<Payment[]>>(`/customers/${id}/payments`);
  },
  
  // Search customers by phone or email
  searchCustomers: async (query: string): Promise<ApiResponse<Customer[]>> => {
    return apiGet<ApiResponse<Customer[]>>(`/customers/search?q=${encodeURIComponent(query)}`);
  },
  
  // Add a note to customer
  addCustomerNote: async (customerId: string, note: string): Promise<ApiResponse<any>> => {
    return apiPost<ApiResponse<any>>(`/customers/${customerId}/notes`, { note });
  },
  
  // Update customer information
  updateCustomer: async (id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    return apiPut<ApiResponse<Customer>>(`/customers/${id}`, data);
  },
  
  // Create a new customer
  createCustomer: async (data: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    return apiPost<ApiResponse<Customer>>('/customers', data);
  }
};

export default customerService;
import { ApiResponse, Order, PaginatedResponse } from '../types';
import { apiGet, apiPost, apiPut } from '../utils/api';

interface OrderFilters {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  customerId?: string;
  assignedTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const getOrders = async (filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> => {
  const queryParams = new URLSearchParams();
  
  // Add filters to query params
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.startDate) queryParams.append('start_date', filters.startDate);
  if (filters.endDate) queryParams.append('end_date', filters.endDate);
  if (filters.customerId) queryParams.append('customer_id', filters.customerId);
  if (filters.assignedTo) queryParams.append('assigned_to', filters.assignedTo);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.pageSize) queryParams.append('page_size', filters.pageSize.toString());
  
  const url = `/orders?${queryParams.toString()}`;
  return apiGet<PaginatedResponse<Order>>(url);
};

export const getOrderById = async (id: string): Promise<ApiResponse<Order>> => {
  return apiGet<ApiResponse<Order>>(`/orders/${id}`);
};

export const getOrderByReference = async (reference: string): Promise<ApiResponse<Order>> => {
  return apiGet<ApiResponse<Order>>(`/orders/track/${reference}`);
};

export const updateOrderStatus = async (
  id: string, 
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
): Promise<ApiResponse<Order>> => {
  return apiPut<ApiResponse<Order>>(`/orders/${id}/status`, { status });
};

export const assignOrderToWorker = async (
  id: string, 
  workerId: string
): Promise<ApiResponse<Order>> => {
  return apiPut<ApiResponse<Order>>(`/orders/${id}/assign`, { assigned_to: workerId });
};

export const updateOrderEstimatedCompletion = async (
  id: string, 
  estimatedCompletion: string
): Promise<ApiResponse<Order>> => {
  return apiPut<ApiResponse<Order>>(`/orders/${id}/estimated-completion`, { estimated_completion: estimatedCompletion });
};

export const bulkUpdateOrderStatus = async (
  orderIds: string[], 
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
): Promise<ApiResponse<{ updated: number }>> => {
  return apiPost<ApiResponse<{ updated: number }>>('/orders/bulk/status', { order_ids: orderIds, status });
};

export const bulkAssignOrders = async (
  orderIds: string[], 
  workerId: string
): Promise<ApiResponse<{ updated: number }>> => {
  return apiPost<ApiResponse<{ updated: number }>>('/orders/bulk/assign', { order_ids: orderIds, assigned_to: workerId });
};
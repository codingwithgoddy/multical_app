// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'owner' | 'payment_admin' | 'worker';
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'product' | 'service';
  basePrice: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: string;
  reference: string;
  customerId: string;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paidAmount: number;
  fulfillmentType: 'pickup' | 'delivery';
  deliveryLocationId?: string;
  deliveryAddress?: string;
  notes?: string;
  estimatedCompletion?: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  orderItems: OrderItem[];
  designFiles: DesignFile[];
  payments: Payment[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  customizationNotes?: string;
  product: Product;
}

export interface DesignFile {
  id: string;
  orderId: string;
  filename: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  totalDebt: number;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  paymentMethod: 'mpesa_stk_push' | 'mpesa_paybill' | 'cash';
  mpesaTransactionId?: string;
  paybillReference?: string;
  paybillConfirmationCode?: string;
  customerPhone?: string;
  status: 'pending' | 'completed' | 'failed' | 'awaiting_confirmation';
  recordedBy?: string;
  notes?: string;
  recordedAt: string;
  confirmedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
  token_type?: string;
  expires_in?: number;
}
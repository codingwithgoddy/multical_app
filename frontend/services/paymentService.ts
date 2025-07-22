import { ApiResponse, Payment, PaginatedResponse } from '../types';
import { apiGet, apiPost, apiPut } from '../utils/api';

interface RecordPaymentData {
  orderId: string;
  customerId: string;
  amount: number;
  paymentMethod: 'mpesa_stk_push' | 'mpesa_paybill' | 'cash';
  mpesaTransactionId?: string;
  paybillReference?: string;
  paybillConfirmationCode?: string;
  customerPhone?: string;
  notes?: string;
}

interface ConfirmPaybillData {
  paymentId: string;
  mpesaTransactionId: string;
  customerPhone: string;
  paybillConfirmationCode: string;
}

interface PaymentFilters {
  customerId?: string;
  orderId?: string;
  paymentMethod?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

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

const paymentService = {
  // Get paginated payments with optional filters
  getPayments: (filters: PaymentFilters = {}): Promise<PaginatedResponse<Payment>> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiGet<PaginatedResponse<Payment>>(`/api/v1/payments?${queryParams.toString()}`);
  },
  
  // Get a single payment by ID
  getPayment: (id: string): Promise<ApiResponse<Payment>> => {
    return apiGet<ApiResponse<Payment>>(`/api/v1/payments/${id}`);
  },
  
  // Record a new payment (manual/cash)
  recordPayment: (data: RecordPaymentData): Promise<ApiResponse<Payment>> => {
    return apiPost<ApiResponse<Payment>>('/api/v1/payments/record-manual', data);
  },
  
  // Initiate Mpesa STK Push
  initiateStkPush: (
    orderId: string,
    customerId: string,
    amount: number,
    phoneNumber: string
  ): Promise<ApiResponse<{ checkoutRequestId: string }>> => {
    return apiPost<ApiResponse<{ checkoutRequestId: string }>>('/api/v1/payments/mpesa-stk-push', {
      orderId,
      customerId,
      amount,
      phoneNumber,
    });
  },
  
  // Confirm Mpesa Paybill payment
  confirmPaybill: (data: ConfirmPaybillData): Promise<ApiResponse<Payment>> => {
    return apiPut<ApiResponse<Payment>>('/api/v1/payments/confirm-paybill', data);
  },
  
  // Get pending paybill confirmations
  getPendingConfirmations: (): Promise<ApiResponse<Payment[]>> => {
    return apiGet<ApiResponse<Payment[]>>('/api/v1/payments/pending-confirmations');
  },
  
  // Get debt summary
  getDebtSummary: (): Promise<ApiResponse<DebtSummary>> => {
    return apiGet<ApiResponse<DebtSummary>>('/api/v1/payments/debts/summary');
  },
  
  // Get customer payment history
  getCustomerPayments: (customerId: string): Promise<ApiResponse<Payment[]>> => {
    return apiGet<ApiResponse<Payment[]>>(`/api/v1/customers/${customerId}/payments`);
  },
};

export default paymentService;
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { Product, PaginatedResponse } from '../types';

interface ProductFilters {
  search?: string;
  type?: 'product' | 'service' | 'all';
  isActive?: boolean | 'all';
  category?: string;
  page?: number;
  pageSize?: number;
}

interface ProductFormData {
  name: string;
  description: string;
  type: 'product' | 'service';
  basePrice: number;
  category: string;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export const productService = {
  // Get all products with optional filtering
  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    if (filters.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    
    if (filters.isActive !== undefined && filters.isActive !== 'all') {
      params.append('isActive', filters.isActive.toString());
    }
    
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    
    if (filters.pageSize) {
      params.append('pageSize', filters.pageSize.toString());
    }
    
    return apiGet<PaginatedResponse<Product>>(`/products?${params.toString()}`);
  },
  
  // Get a single product by ID
  getProduct: async (id: string): Promise<Product> => {
    return apiGet<Product>(`/products/${id}`);
  },
  
  // Create a new product
  createProduct: async (productData: ProductFormData): Promise<Product> => {
    // Map frontend field names to backend field names
    const mappedData = {
      name: productData.name,
      description: productData.description,
      type: productData.type,
      price: productData.basePrice,
      category: productData.category,
      image_url: productData.imageUrl,
      cloudinary_public_id: productData.cloudinaryPublicId,
      is_active: productData.isActive
    };
    return apiPost<Product>('/products', mappedData);
  },
  
  // Update an existing product
  updateProduct: async (id: string, productData: ProductFormData): Promise<Product> => {
    return apiPut<Product>(`/products/${id}`, productData);
  },
  
  // Delete a product
  deleteProduct: async (id: string): Promise<void> => {
    return apiDelete(`/products/${id}`);
  },
  
  // Check if a product has dependencies (orders, quotes, etc.)
  checkProductDependencies: async (id: string): Promise<{ hasDependencies: boolean }> => {
    return apiGet<{ hasDependencies: boolean }>(`/products/${id}/check-dependencies`);
  },
  
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    return apiGet<Category[]>('/products/categories');
  },
  
  // Create a new category
  createCategory: async (name: string): Promise<Category> => {
    return apiPost<Category>('/products/categories', { name });
  },
  
  // Delete a category
  deleteCategory: async (id: string): Promise<void> => {
    return apiDelete(`/products/categories/${id}`);
  }
};
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/layout/AdminLayout';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import { productService } from '../../../services/productService';
import { Product } from '../../../types';
import { 
  ArrowLeftIcon,
  PhotoIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Cloudinary widget type
declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'product',
    basePrice: '',
    category: '',
    imageUrl: '',
    cloudinaryPublicId: '',
    isActive: true
  });
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch product data
  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setFetchLoading(true);
    setError(null);
    
    try {
      const product = await productService.getProduct(productId);
      setOriginalProduct(product);
      
      // Format the data for the form
      setFormData({
        name: product.name,
        description: product.description,
        type: product.type,
        basePrice: product.basePrice.toString(),
        category: product.category,
        imageUrl: product.imageUrl,
        cloudinaryPublicId: product.imageUrl ? product.imageUrl.split('/').pop()?.split('.')[0] || '' : '',
        isActive: product.isActive
      });
    } catch (err: any) {
      console.error('Failed to fetch product:', err);
      setError(err.response?.data?.error?.message || 'Failed to load product. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle price input with validation
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\\d+(\\.\\d{0,2})?$/.test(value)) {
      setFormData(prev => ({ ...prev, basePrice: value }));
    }
  };

  // Initialize Cloudinary widget
  const openCloudinaryWidget = () => {
    if (typeof window === 'undefined') return;

    // Check if Cloudinary script is loaded
    if (!window.cloudinary) {
      // Add Cloudinary script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      initWidget();
    }
  };

  const initWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        resourceType: 'image',
        folder: 'products',
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          setFormData(prev => ({
            ...prev,
            imageUrl: result.info.secure_url,
            cloudinaryPublicId: result.info.public_id
          }));
        }
      }
    );
    widget.open();
  };

  // Validate form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.basePrice) {
      errors.basePrice = 'Price is required';
    } else if (isNaN(parseFloat(formData.basePrice))) {
      errors.basePrice = 'Price must be a valid number';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Convert basePrice to number
      const productData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice)
      };
      
      await productService.updateProduct(id as string, productData);
      
      // Redirect to products list on success
      router.push('/products');
    } catch (err: any) {
      console.error('Failed to update product:', err);
      setError(err.response?.data?.error?.message || 'Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !originalProduct) {
    return (
      <AdminLayout title="Edit Product">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
                <div className="mt-4">
                  <div className="flex">
                    <Link
                      href="/products"
                      className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                    >
                      Back to Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Products
          </Link>
        </div>
        
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Product</h3>
              <p className="mt-1 text-sm text-gray-600">
                Update your product or service information.
              </p>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500">PRODUCT PREVIEW</h4>
                <div className="mt-2 border border-gray-200 rounded-md p-4">
                  <div className="flex flex-col items-center">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Product preview"
                        className="h-32 w-32 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-md bg-gray-100 flex items-center justify-center">
                        <PhotoIcon className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    <div className="mt-4 text-center">
                      <h3 className="text-gray-900 font-medium">
                        {formData.name || 'Product Name'}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {formData.description || 'Product description will appear here'}
                      </p>
                      <p className="text-primary-600 font-medium mt-2">
                        {formData.basePrice ? `KES ${parseFloat(formData.basePrice).toLocaleString()}` : 'KES 0.00'}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          formData.type === 'product' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {formData.type === 'product' ? 'Product' : 'Service'}
                        </span>
                        {formData.category && (
                          <span className="ml-2 inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                            {formData.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 md:col-span-2 md:mt-0">
            <Card>
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  {/* Product Type */}
                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Product Type</label>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          id="type-product"
                          name="type"
                          type="radio"
                          value="product"
                          checked={formData.type === 'product'}
                          onChange={handleChange}
                          className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="type-product" className="ml-2 block text-sm text-gray-700">
                          Product (Fixed price)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="type-service"
                          name="type"
                          type="radio"
                          value="service"
                          checked={formData.type === 'service'}
                          onChange={handleChange}
                          className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="type-service" className="ml-2 block text-sm text-gray-700">
                          Service (Quote-based)
                        </label>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.type === 'product' 
                        ? 'Products have fixed prices and can be ordered directly.' 
                        : 'Services require quotes and have customizable pricing.'}
                    </p>
                  </div>
                  
                  {/* Product Name */}
                  <div className="col-span-6">
                    <Input
                      id="name"
                      name="name"
                      label="Product Name"
                      value={formData.name}
                      onChange={handleChange}
                      error={validationErrors.name}
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="col-span-6">
                    <TextArea
                      id="description"
                      name="description"
                      label="Description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      error={validationErrors.description}
                    />
                  </div>
                  
                  {/* Price and Category */}
                  <div className="col-span-6 sm:col-span-3">
                    <Input
                      id="basePrice"
                      name="basePrice"
                      label={formData.type === 'product' ? 'Price (KES)' : 'Starting Price (KES)'}
                      value={formData.basePrice}
                      onChange={handleChange}
                      error={validationErrors.basePrice}
                      leftAddon="KES"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <Input
                      id="category"
                      name="category"
                      label="Category"
                      value={formData.category}
                      onChange={handleChange}
                      error={validationErrors.category}
                      placeholder="e.g., Business Cards, Banners, Design Services"
                    />
                  </div>
                  
                  {/* Product Image */}
                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {formData.imageUrl ? (
                          <div>
                            <img
                              src={formData.imageUrl}
                              alt="Product"
                              className="mx-auto h-32 w-32 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, imageUrl: '', cloudinaryPublicId: '' }))}
                              className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <button
                                type="button"
                                onClick={openCloudinaryWidget}
                                className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                              >
                                <span>Upload a file</span>
                              </button>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Status */}
                  <div className="col-span-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isActive" className="font-medium text-gray-700">
                          Active
                        </label>
                        <p className="text-gray-500">
                          Active products are visible to customers and can be ordered.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link
                    href="/products"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
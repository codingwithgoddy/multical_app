import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';

export default function Home() {
  // Sample product categories
  const productCategories = [
    { name: 'Business Cards', href: '/products/business-cards', image: '/images/placeholder-business-cards.jpg' },
    { name: 'Flyers & Brochures', href: '/products/flyers', image: '/images/placeholder-flyers.jpg' },
    { name: 'Banners & Signage', href: '/products/banners', image: '/images/placeholder-banners.jpg' },
    { name: 'Stationery', href: '/products/stationery', image: '/images/placeholder-stationery.jpg' },
  ];

  // Sample featured products
  const featuredProducts = [
    { 
      id: 1, 
      name: 'Premium Business Cards', 
      description: 'Make a lasting impression with our premium business cards printed on high-quality card stock.',
      price: 'From KSh 1,500',
      image: '/images/placeholder-product-1.jpg'
    },
    { 
      id: 2, 
      name: 'Full Color Flyers', 
      description: 'Vibrant, full-color flyers perfect for promotions, events, and announcements.',
      price: 'From KSh 2,500',
      image: '/images/placeholder-product-2.jpg'
    },
    { 
      id: 3, 
      name: 'Custom Banners', 
      description: 'Eye-catching banners for indoor and outdoor use, available in various sizes.',
      price: 'From KSh 3,500',
      image: '/images/placeholder-product-3.jpg'
    },
  ];

  return (
    <>
      <NextSeo
        title="Professional Printing Services"
        description="High-quality printing services for businesses and individuals. Fast turnaround, competitive prices, and exceptional customer service."
      />
      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-gray-100 py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                  <span className="mr-1 h-2 w-2 rounded-full bg-primary-600"></span>
                  Trusted by businesses across Kenya
                </div>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                  Professional <span className="text-primary-600">Printing</span> Solutions for Your Business
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                  High-quality printing services with fast turnaround times, competitive pricing, and exceptional customer service. From business cards to large format printing, we've got you covered.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/products" className="btn btn-primary">
                    Browse Products
                  </Link>
                  <Link href="/request-quote" className="btn btn-outline">
                    Request Quote
                  </Link>
                </div>
                
                {/* Trust indicators */}
                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">4.9/5 Rating (200+ Reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">100% Satisfaction Guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Fast 24-48 Hour Turnaround</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-xl md:h-80 lg:h-96">
                  {/* Placeholder for hero image - replace with actual image in production */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-90" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-xl font-semibold">Professional Printing Services</p>
                    <p className="mt-2">For businesses and individuals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 hidden h-32 w-32 translate-y-1/2 transform opacity-20 lg:block">
            <div className="h-full w-full rounded-full bg-primary-500"></div>
          </div>
          <div className="absolute right-0 top-0 hidden h-24 w-24 -translate-y-1/2 transform opacity-20 lg:block">
            <div className="h-full w-full rounded-full bg-secondary-500"></div>
          </div>
        </section>
        
        {/* Product Categories Section */}
        <section className="py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900">
                Explore Our Product Categories
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Browse our wide range of high-quality printing products and services
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productCategories.map((category, index) => (
                <Link 
                  key={index} 
                  href={category.href}
                  className="group relative overflow-hidden rounded-lg bg-gray-200 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-h-1 aspect-w-1 h-48 w-full bg-gray-200">
                    {/* Replace with actual images in production */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-900/40" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h3 className="text-center text-xl font-bold text-white group-hover:text-primary-200 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/products" className="btn btn-outline">
                View All Categories
              </Link>
            </div>
          </div>
        </section>
        
        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900">
                Our Popular Products
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Discover our most requested printing products with fast turnaround times
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <div key={product.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-h-1 aspect-w-1 h-48 w-full bg-gray-200">
                    {/* Replace with actual product images in production */}
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <span className="text-sm font-medium text-primary-600">{product.price}</span>
                    </div>
                    <p className="mb-4 text-gray-600">
                      {product.description}
                    </p>
                    <Link href={`/products/${product.id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/products" className="btn btn-outline">
                View All Products
              </Link>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="bg-gray-100 py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900">
                Why Choose MultiPrints?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                We're committed to providing the highest quality printing services with exceptional customer care
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-full bg-primary-100 p-3 text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Fast Turnaround</h3>
                <p className="text-gray-600">
                  Get your printing done quickly without compromising on quality. Most orders are completed within 24-48 hours.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-full bg-primary-100 p-3 text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Quality Guaranteed</h3>
                <p className="text-gray-600">
                  We stand behind our work with a 100% satisfaction guarantee. If you're not happy, we'll reprint your order or refund your money.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-full bg-primary-100 p-3 text-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Competitive Pricing</h3>
                <p className="text-gray-600">
                  Get the best value for your money with our transparent pricing. No hidden fees or surprise charges on your final bill.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Business Information Section */}
        <section className="py-16">
          <div className="container">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <h2 className="mb-4 text-3xl font-bold text-white">About MultiPrints</h2>
                  <p className="mb-6 text-primary-100">
                    MultiPrints is a leading printing service provider in Nairobi, Kenya. With over 10 years of experience, we've helped thousands of businesses and individuals with their printing needs.
                  </p>
                  <ul className="mb-8 space-y-3">
                    <li className="flex items-center text-primary-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-200" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      State-of-the-art printing equipment
                    </li>
                    <li className="flex items-center text-primary-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-200" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Experienced design and production team
                    </li>
                    <li className="flex items-center text-primary-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-200" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Convenient location in central Nairobi
                    </li>
                    <li className="flex items-center text-primary-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-primary-200" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Delivery services throughout Nairobi
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/about" className="btn bg-white text-primary-600 hover:bg-gray-100">
                      Learn More
                    </Link>
                    <Link href="/contact" className="btn border border-white bg-transparent text-white hover:bg-white/10">
                      Contact Us
                    </Link>
                  </div>
                </div>
                <div className="relative hidden md:block">
                  {/* Replace with actual image in production */}
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="flex h-full items-center justify-center bg-gray-200 p-12">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="mt-4 text-gray-500">Business Image Placeholder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="bg-gray-100 py-16">
          <div className="container">
            <div className="rounded-lg bg-white p-8 shadow-md md:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
                  Ready to Start Your Printing Project?
                </h2>
                <p className="mb-8 text-lg text-gray-600">
                  Contact us today for a free quote or to discuss your printing needs. Our team is ready to help bring your vision to life.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/request-quote" className="btn btn-primary">
                    Request a Quote
                  </Link>
                  <Link href="/contact" className="btn btn-outline">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
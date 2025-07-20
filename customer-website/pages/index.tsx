import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function Home() {
  return (
    <>
      <NextSeo
        title="Professional Printing Services"
        description="High-quality printing services for businesses and individuals. Fast turnaround, competitive prices, and exceptional customer service."
      />
      <Layout>
        <section className="bg-gradient-to-b from-white to-gray-100 py-20">
          <div className="container">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                  Professional <span className="text-primary-600">Printing</span> Services
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                  High-quality printing solutions for all your business and personal needs.
                  Fast turnaround, competitive prices, and exceptional customer service.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/products" className="btn btn-primary">
                    Browse Products
                  </Link>
                  <Link href="/services" className="btn btn-outline">
                    Request Quote
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-xl md:h-80 lg:h-96">
                  {/* Placeholder for hero image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <p className="text-center text-xl font-semibold">Hero Image Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900">
              Our Popular Products
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Product placeholders */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-h-1 aspect-w-1 h-48 w-full bg-gray-200" />
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold">Product {item}</h3>
                    <p className="mb-4 text-gray-600">
                      High-quality printing with fast turnaround times.
                    </p>
                    <Link href={`/products/${item}`} className="text-primary-600 hover:text-primary-700">
                      View Details →
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
        
        <section className="bg-gray-100 py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900">
              Why Choose MultiPrints?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 rounded-full bg-primary-100 p-3 text-primary-600 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Fast Turnaround</h3>
                <p className="text-gray-600">
                  Get your printing done quickly without compromising on quality.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 rounded-full bg-primary-100 p-3 text-primary-600 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Quality Guaranteed</h3>
                <p className="text-gray-600">
                  We stand behind our work with a 100% satisfaction guarantee.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 rounded-full bg-primary-100 p-3 text-primary-600 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Competitive Pricing</h3>
                <p className="text-gray-600">
                  Get the best value for your money with our transparent pricing.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { Inter, Poppins } from 'next/font/google';
import { QueryClient, QueryClientProvider } from 'react-query';

// Font configuration
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-poppins: ${poppins.style.fontFamily};
        }
      `}</style>
      <DefaultSeo
        titleTemplate="%s | MultiPrints"
        defaultTitle="MultiPrints - Professional Printing Services"
        description="High-quality printing services for businesses and individuals. Fast turnaround, competitive prices, and exceptional customer service."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://multiprints.com',
          siteName: 'MultiPrints',
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://multiprints.com'}/images/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: 'MultiPrints - Professional Printing Services',
            },
          ],
        }}
        twitter={{
          handle: '@multiprints',
          site: '@multiprints',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
          {
            name: 'theme-color',
            content: '#0ea5e9',
          },
        ]}
      />
      <div className={`${inter.variable} ${poppins.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}
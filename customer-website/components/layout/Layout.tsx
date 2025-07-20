import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export default function Layout({ 
  children, 
  hideHeader = false, 
  hideFooter = false 
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {!hideHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
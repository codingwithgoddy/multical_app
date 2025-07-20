import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={clsx('rounded-lg bg-white p-6 shadow', className)}>
      {children}
    </div>
  );
}
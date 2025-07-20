import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helpText,
      className,
      fullWidth = true,
      disabled,
      rows = 5, // Default to 5 rows for better visibility
      resize = 'vertical', // Default to vertical resizing
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    
    return (
      <div className={clsx(fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-2" // Increased bottom margin
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={clsx(
            'block rounded-md shadow-sm sm:text-base', // Increased font size for better readability
            'py-3 px-4', // Increased padding for better spacing
            'leading-relaxed', // Better line height for readability
            fullWidth ? 'w-full' : 'w-auto',
            hasError
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
            disabled ? 'bg-gray-100 cursor-not-allowed' : '',
            `resize-${resize}`, // Apply resize property
            className
          )}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${props.id}-error` : undefined}
          {...props}
        />
        {hasError && (
          <p className="mt-2 text-sm text-red-600" id={`${props.id}-error`}>
            {error}
          </p>
        )}
        {helpText && !hasError && (
          <p className="mt-2 text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
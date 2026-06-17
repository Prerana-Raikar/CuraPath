import React, { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  loadingText = 'Loading...',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white focus:ring-primary-500 shadow-lg',
    secondary: 'bg-white text-slate-700 border border-slate-200 focus:ring-primary-500 shadow-md',
    success: 'bg-gradient-to-r from-success-600 to-success-700 text-white focus:ring-success-500 shadow-lg',
    danger: 'bg-gradient-to-r from-error-600 to-error-700 text-white focus:ring-error-500 shadow-lg',
    warning: 'bg-gradient-to-r from-warning-600 to-warning-700 text-white focus:ring-warning-500 shadow-lg',
    outline: 'border-2 border-primary-500 text-primary-600 focus:ring-primary-500',
    ghost: 'text-slate-600 focus:ring-slate-500'
  };

  const sizeClasses = {
    xs: 'px-3 py-2 text-xs gap-2',
    sm: 'px-4 py-2.5 text-sm gap-2',
    md: 'px-6 py-3 text-sm gap-3',
    lg: 'px-8 py-4 text-base gap-3',
    xl: 'px-10 py-5 text-lg gap-4'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Content */}
      <div className="flex items-center">
        {loading ? (
          <>
            <LoadingSpinner 
              variant="medical" 
              size="small" 
              color={variant === 'primary' || variant === 'success' || variant === 'danger' || variant === 'warning' ? 'white' : 'primary'} 
              className="mr-2"
            />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0 mr-2">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0 ml-2">{rightIcon}</span>}
          </>
        )}
      </div>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'medical';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  style?: 'filled' | 'outlined' | 'soft' | 'glass';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  style = 'soft',
  dot = false,
  pulse = false,
  className = '' 
}) => {
  const variantClasses = {
    default: {
      filled: 'bg-slate-600 text-white shadow-sm',
      outlined: 'bg-white text-slate-600 border border-slate-300 shadow-sm',
      soft: 'bg-slate-100 text-slate-800 border border-slate-200',
      glass: 'medical-glass text-slate-800'
    },
    primary: {
      filled: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md',
      outlined: 'bg-white text-primary-600 border border-primary-300 shadow-sm',
      soft: 'bg-primary-100 text-primary-800 border border-primary-200',
      glass: 'medical-glass text-primary-800'
    },
    success: {
      filled: 'bg-gradient-to-r from-success-600 to-success-700 text-white shadow-md',
      outlined: 'bg-white text-success-600 border border-success-300 shadow-sm',
      soft: 'bg-success-100 text-success-800 border border-success-200',
      glass: 'medical-glass text-success-800'
    },
    warning: {
      filled: 'bg-gradient-to-r from-warning-600 to-warning-700 text-white shadow-md',
      outlined: 'bg-white text-warning-600 border border-warning-300 shadow-sm',
      soft: 'bg-warning-100 text-warning-800 border border-warning-200',
      glass: 'medical-glass text-warning-800'
    },
    danger: {
      filled: 'bg-gradient-to-r from-error-600 to-error-700 text-white shadow-md',
      outlined: 'bg-white text-error-600 border border-error-300 shadow-sm',
      soft: 'bg-error-100 text-error-800 border border-error-200',
      glass: 'medical-glass text-error-800'
    },
    info: {
      filled: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md',
      outlined: 'bg-white text-primary-600 border border-primary-300 shadow-sm',
      soft: 'bg-primary-100 text-primary-800 border border-primary-200',
      glass: 'medical-glass text-primary-800'
    },
    medical: {
      filled: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg',
      outlined: 'bg-white text-primary-600 border-2 border-primary-400 shadow-md',
      soft: 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-900 border border-primary-200',
      glass: 'premium-glass text-primary-800 border border-primary-200/50'
    }
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs font-semibold',
    sm: 'px-2.5 py-1 text-xs font-semibold',
    md: 'px-3 py-1.5 text-sm font-bold',
    lg: 'px-4 py-2 text-sm font-bold'
  };

  const dotSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  const pulseClass = pulse ? 'animate-medical-pulse' : '';

  return (
    <span className={`inline-flex items-center rounded-2xl transition-all duration-300 hover:scale-105 gpu-accelerated ${variantClasses[variant][style]} ${sizeClasses[size]} ${pulseClass} ${className}`}>
      {dot && (
        <div className={`${dotSizeClasses[size]} rounded-full mr-2 ${
          variant === 'default' ? 'bg-slate-400' :
          variant === 'primary' ? 'bg-primary-500' :
          variant === 'success' ? 'bg-success-500' :
          variant === 'warning' ? 'bg-warning-500' :
          variant === 'danger' ? 'bg-error-500' :
          variant === 'medical' ? 'bg-primary-500' :
          'bg-primary-500'
        } ${pulse ? 'animate-medical-pulse' : ''}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
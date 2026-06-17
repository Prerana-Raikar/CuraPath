import React from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'medical';
  color?: 'primary' | 'white' | 'gray' | 'success' | 'warning' | 'error';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  variant = 'spinner',
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-slate-600',
    success: 'border-success-600',
    warning: 'border-warning-600',
    error: 'border-error-600'
  };

  if (variant === 'medical') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} relative`}>
          {/* Outer ring */}
          <div className={`absolute inset-0 rounded-full border-2 border-primary-200`}></div>
          {/* Inner ring */}
          <div className={`absolute inset-1 rounded-full border-2 border-primary-500 border-t-transparent`}></div>
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-primary-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    const dotSizeClasses = {
      xs: 'w-1 h-1',
      small: 'w-1.5 h-1.5',
      medium: 'w-2 h-2',
      large: 'w-2.5 h-2.5',
      xl: 'w-3 h-3'
    };

    const dotColorClasses = {
      primary: 'bg-primary-600',
      white: 'bg-white',
      gray: 'bg-slate-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      error: 'bg-error-600'
    };

    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className={`${dotSizeClasses[size]} ${dotColorClasses[color]} rounded-full`} />
        <div className={`${dotSizeClasses[size]} ${dotColorClasses[color]} rounded-full`} />
        <div className={`${dotSizeClasses[size]} ${dotColorClasses[color]} rounded-full`} />
      </div>
    );
  }

  if (variant === 'pulse') {
    const pulseColorClasses = {
      primary: 'bg-primary-600',
      white: 'bg-white',
      gray: 'bg-slate-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      error: 'bg-error-600'
    };

    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} ${pulseColorClasses[color]} rounded-full`} />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`rounded-full border-2 border-transparent ${colorClasses[color]} border-t-transparent ${sizeClasses[size]}`}
        style={{
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
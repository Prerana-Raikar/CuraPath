import React, { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'interactive';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  children, 
  className = '', 
  padding = 'md',
  variant = 'default',
  hover = false,
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    xs: 'p-4',
    sm: 'p-5',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variantClasses = {
    default: 'bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200/50 relative overflow-hidden',
    elevated: 'bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-200/50 relative overflow-hidden',
    outlined: 'bg-white/90 rounded-3xl border-2 border-slate-300 shadow-md relative overflow-hidden',
    glass: 'medical-glass rounded-3xl relative overflow-hidden',
    interactive: 'medical-card-interactive relative overflow-hidden group'
  };

  const hoverClass = hover && variant !== 'interactive' 
    ? 'hover-medical cursor-pointer' 
    : '';

  return (
    <div 
      ref={ref}
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClass} ${className}`}
      {...props}
    >
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
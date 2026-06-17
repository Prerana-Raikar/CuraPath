import React from 'react';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AlertProps {
  variant: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  message?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  style?: 'default' | 'filled' | 'outlined' | 'medical';
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  className = '',
  style = 'default'
}) => {
  const variantConfig = {
    success: {
      default: {
        bgColor: 'bg-gradient-to-r from-success-50 to-success-100/50',
        borderColor: 'border-success-200',
        textColor: 'text-success-800',
        titleColor: 'text-success-900',
        iconColor: 'text-success-600'
      },
      filled: {
        bgColor: 'bg-gradient-to-r from-success-600 to-success-700',
        borderColor: 'border-success-600',
        textColor: 'text-white',
        titleColor: 'text-white',
        iconColor: 'text-white'
      },
      outlined: {
        bgColor: 'bg-white/90 backdrop-blur-sm',
        borderColor: 'border-success-300',
        textColor: 'text-success-800',
        titleColor: 'text-success-900',
        iconColor: 'text-success-600'
      },
      medical: {
        bgColor: 'medical-glass',
        borderColor: 'border-success-300/50',
        textColor: 'text-success-800',
        titleColor: 'text-success-900',
        iconColor: 'text-success-600'
      }
    },
    warning: {
      default: {
        bgColor: 'bg-gradient-to-r from-warning-50 to-warning-100/50',
        borderColor: 'border-warning-200',
        textColor: 'text-warning-800',
        titleColor: 'text-warning-900',
        iconColor: 'text-warning-600'
      },
      filled: {
        bgColor: 'bg-gradient-to-r from-warning-600 to-warning-700',
        borderColor: 'border-warning-600',
        textColor: 'text-white',
        titleColor: 'text-white',
        iconColor: 'text-white'
      },
      outlined: {
        bgColor: 'bg-white/90 backdrop-blur-sm',
        borderColor: 'border-warning-300',
        textColor: 'text-warning-800',
        titleColor: 'text-warning-900',
        iconColor: 'text-warning-600'
      },
      medical: {
        bgColor: 'medical-glass',
        borderColor: 'border-warning-300/50',
        textColor: 'text-warning-800',
        titleColor: 'text-warning-900',
        iconColor: 'text-warning-600'
      }
    },
    danger: {
      default: {
        bgColor: 'bg-gradient-to-r from-error-50 to-error-100/50',
        borderColor: 'border-error-200',
        textColor: 'text-error-800',
        titleColor: 'text-error-900',
        iconColor: 'text-error-600'
      },
      filled: {
        bgColor: 'bg-gradient-to-r from-error-600 to-error-700',
        borderColor: 'border-error-600',
        textColor: 'text-white',
        titleColor: 'text-white',
        iconColor: 'text-white'
      },
      outlined: {
        bgColor: 'bg-white/90 backdrop-blur-sm',
        borderColor: 'border-error-300',
        textColor: 'text-error-800',
        titleColor: 'text-error-900',
        iconColor: 'text-error-600'
      },
      medical: {
        bgColor: 'medical-glass',
        borderColor: 'border-error-300/50',
        textColor: 'text-error-800',
        titleColor: 'text-error-900',
        iconColor: 'text-error-600'
      }
    },
    info: {
      default: {
        bgColor: 'bg-gradient-to-r from-primary-50 to-primary-100/50',
        borderColor: 'border-primary-200',
        textColor: 'text-primary-800',
        titleColor: 'text-primary-900',
        iconColor: 'text-primary-600'
      },
      filled: {
        bgColor: 'bg-gradient-to-r from-primary-600 to-primary-700',
        borderColor: 'border-primary-600',
        textColor: 'text-white',
        titleColor: 'text-white',
        iconColor: 'text-white'
      },
      outlined: {
        bgColor: 'bg-white/90 backdrop-blur-sm',
        borderColor: 'border-primary-300',
        textColor: 'text-primary-800',
        titleColor: 'text-primary-900',
        iconColor: 'text-primary-600'
      },
      medical: {
        bgColor: 'medical-glass',
        borderColor: 'border-primary-300/50',
        textColor: 'text-primary-800',
        titleColor: 'text-primary-900',
        iconColor: 'text-primary-600'
      }
    }
  };

  const iconMap = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    danger: XCircleIcon,
    info: InformationCircleIcon
  };

  const config = variantConfig[variant][style];
  const IconComponent = iconMap[variant];

  return (
    <div className={`rounded-2xl border p-6 shadow-lg ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
          </div>
        </div>
        <div className="ml-4 flex-1">
          {title && (
            <h3 className={`text-base font-bold ${config.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm leading-relaxed ${config.textColor}`}>
            {children || message}
          </div>
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={`inline-flex rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 ${config.textColor}`}
              onClick={onDismiss}
              aria-label="Dismiss alert"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
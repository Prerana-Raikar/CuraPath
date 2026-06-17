import React from 'react';
import { 
  HeartIcon, 
  BeakerIcon, 
  ClockIcon, 
  FireIcon 
} from '@heroicons/react/24/outline';

interface VitalSign {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: React.ComponentType<any>;
}

interface VitalSignsCardProps {
  vitals: VitalSign[];
  title?: string;
  className?: string;
}

const VitalSignsCard: React.FC<VitalSignsCardProps> = ({ 
  vitals, 
  title = "Vital Signs",
  className = '' 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'warning':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'critical':
        return 'text-error-600 bg-error-50 border-error-200 animate-medical-alert';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusAnimation = (status: string) => {
    switch (status) {
      case 'normal':
        return 'animate-medical-breathing';
      case 'warning':
        return 'animate-medical-pulse';
      case 'critical':
        return 'animate-medical-alert';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 gpu-accelerated ${className}`}>
      {/* Medical top accent with pulse */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-3xl animate-medical-pulse"></div>
      
      {/* Medical scanning effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-50/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 animate-medical-scan"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <HeartIcon className="h-5 w-5 text-primary-600 mr-2 animate-medical-heartbeat" />
          {title}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vitals.map((vital, index) => (
            <div 
              key={vital.name}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${getStatusColor(vital.status)} ${getStatusAnimation(vital.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <vital.icon className="h-5 w-5" />
                <span className="text-xs font-medium uppercase tracking-wide opacity-75">
                  {vital.name}
                </span>
              </div>
              
              <div className="flex items-baseline">
                <span className="text-2xl font-bold medical-monospace">
                  {vital.value}
                </span>
                <span className="text-sm ml-1 opacity-75">
                  {vital.unit}
                </span>
              </div>
              
              {/* Medical vital signs indicator */}
              <div className="mt-2 h-1 bg-current/20 rounded-full overflow-hidden">
                <div className={`h-full bg-current rounded-full transition-all duration-500 ${
                  vital.status === 'critical' ? 'animate-medical-alert' : 
                  vital.status === 'warning' ? 'animate-medical-pulse' : 
                  'animate-medical-breathing'
                }`} style={{ width: '60%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VitalSignsCard; 
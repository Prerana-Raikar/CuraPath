import React from 'react';

interface ECGWaveformProps {
  heartRate?: number;
  isNormal?: boolean;
  className?: string;
}

const ECGWaveform: React.FC<ECGWaveformProps> = ({ 
  heartRate = 72, 
  isNormal = true,
  className = '' 
}) => {
  const getHeartRateColor = () => {
    if (heartRate < 60) return 'text-warning-600';
    if (heartRate > 100) return 'text-error-600';
    return 'text-success-600';
  };

  const getHeartRateStatus = () => {
    if (heartRate < 60) return 'Bradycardia';
    if (heartRate > 100) return 'Tachycardia';
    return 'Normal';
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 gpu-accelerated ${className}`}>
      {/* Medical top accent with heartbeat */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-3xl animate-medical-heartbeat"></div>
      
      {/* Medical scanning effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-50/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 animate-medical-scan"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">ECG Monitor</h3>
          <div className="flex items-center space-x-2">
            <div className={`text-sm font-bold ${getHeartRateColor()} animate-medical-pulse`}>
              {heartRate} BPM
            </div>
            <div className="text-xs text-slate-500">
              {getHeartRateStatus()}
            </div>
          </div>
        </div>
        
        {/* ECG Waveform */}
        <div className="bg-slate-900 rounded-2xl p-4 mb-4 relative overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #3b82f6 1px, transparent 1px),
                linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          {/* ECG Waveform */}
          <svg 
            className="w-full h-24 text-green-400 animate-medical-ecg" 
            viewBox="0 0 400 100" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            
            {/* P Wave */}
            <path 
              d="M 20 50 Q 30 40 40 50 Q 50 60 60 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
              className="animate-medical-breathing"
            />
            
            {/* QRS Complex */}
            <path 
              d="M 60 50 L 70 50 L 75 20 L 80 80 L 85 50 L 90 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
              className="animate-medical-heartbeat"
            />
            
            {/* ST Segment */}
            <path 
              d="M 90 50 L 110 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
            />
            
            {/* T Wave */}
            <path 
              d="M 110 50 Q 120 40 130 50 Q 140 60 150 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
              className="animate-medical-breathing"
            />
            
            {/* Second heartbeat */}
            <path 
              d="M 150 50 Q 160 40 170 50 Q 180 60 190 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
              className="animate-medical-breathing"
            />
            
            <path 
              d="M 190 50 L 200 50 L 205 20 L 210 80 L 215 50 L 220 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
              className="animate-medical-heartbeat"
            />
            
            <path 
              d="M 220 50 L 240 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
            />
            
            <path 
              d="M 240 50 Q 250 40 260 50 Q 270 60 280 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
              className="animate-medical-breathing"
            />
            
            {/* Third heartbeat */}
            <path 
              d="M 280 50 Q 290 40 300 50 Q 310 60 320 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
              className="animate-medical-breathing"
            />
            
            <path 
              d="M 320 50 L 330 50 L 335 20 L 340 80 L 345 50 L 350 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
              className="animate-medical-heartbeat"
            />
            
            <path 
              d="M 350 50 L 370 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
            />
            
            <path 
              d="M 370 50 Q 380 40 390 50" 
              stroke="url(#ecgGradient)" 
              strokeWidth="2" 
              fill="none"
              className="animate-medical-breathing"
            />
          </svg>
          
          {/* Heartbeat indicator */}
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-medical-alert"></div>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Rhythm</div>
            <div className={`text-sm font-semibold ${isNormal ? 'text-success-600' : 'text-error-600'}`}>
              {isNormal ? 'Normal' : 'Irregular'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Amplitude</div>
            <div className="text-sm font-semibold text-primary-600">Normal</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">Quality</div>
            <div className="text-sm font-semibold text-success-600">Good</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECGWaveform; 
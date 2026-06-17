import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { UserIcon, LockClosedIcon, HeartIcon, ShieldCheckIcon, BeakerIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Doctor', email: 'doctor@curapath.com', password: 'demo123', icon: BeakerIcon, color: 'from-blue-500 to-blue-600', action: 'fill' },
    { role: 'Patient', email: 'Individual emails', password: 'N/A', icon: HeartIcon, color: 'from-emerald-500 to-emerald-600', action: 'navigate' },
    { role: 'Staff', email: 'staff@curapath.com', password: 'demo123', icon: UserGroupIcon, color: 'from-orange-500 to-orange-600', action: 'fill' }
  ];

  const handleDemoAccountClick = (account: any) => {
    if (account.action === 'navigate') {
      // Navigate to patient portal
      navigate('/patient/login');
    } else {
      // Fill the form fields
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (emailInput && passwordInput) {
        emailInput.value = account.email;
        passwordInput.value = account.password;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 medical-pattern-dots relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-100/30 to-blue-200/20 rounded-full blur-3xl animate-medical-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-100/30 to-teal-200/20 rounded-full blur-3xl animate-medical-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-2xl animate-medical-pulse"></div>
      </div>

      <div className="max-w-md w-full space-y-8 animate-medical-fade-in relative z-10">
        {/* Enhanced Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 animate-medical-heartbeat">
                <HeartIcon className="h-10 w-10 text-white" />
              </div>
              {/* Orbiting elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-medical-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-medical-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold medical-text-gradient mb-3 animate-medical-slide-up">
            CuraPath
          </h1>
          <p className="text-xl text-slate-600 mb-2 animate-medical-slide-up" style={{ animationDelay: '0.1s' }}>
            Advanced Medical Analytics Platform
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 animate-medical-slide-up" style={{ animationDelay: '0.2s' }}>
            <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
            <span>HIPAA Compliant • Secure • Real-time</span>
          </div>
        </div>

        {/* Enhanced Login Form */}
        <Card variant="glass" className="medical-card hover-medical backdrop-blur-xl animate-medical-slide-up" style={{ animationDelay: '0.3s' }}>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="medical-label flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-primary-500" />
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                </div>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className={`medical-input pl-12 transition-all duration-300 ${errors.email ? 'medical-input-error' : 'hover:border-primary-300 focus:border-primary-500'}`}
                  placeholder="Enter your email address"
                />
                {!errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="medical-error flex items-center mt-2 animate-medical-alert">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-medical-pulse"></div>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="medical-label flex items-center">
                <LockClosedIcon className="h-4 w-4 mr-2 text-primary-500" />
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                </div>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  className={`medical-input pl-12 transition-all duration-300 ${errors.password ? 'medical-input-error' : 'hover:border-primary-300 focus:border-primary-500'}`}
                  placeholder="Enter your password"
                />
                {!errors.password && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
              </div>
              {errors.password && (
                <p className="medical-error flex items-center mt-2 animate-medical-alert">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-medical-pulse"></div>
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-gradient-to-r from-error-50 to-error-100/50 border border-error-200 rounded-2xl p-4 animate-medical-alert">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-error-500 rounded-full mr-3 animate-medical-pulse"></div>
                  <p className="text-error-800 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
              size="lg"
              loadingText="Authenticating..."
              className="medical-gradient-primary hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Sign In Securely</span>
              </div>
            </Button>
          </form>
        </Card>

        {/* Enhanced Demo Accounts */}
        <Card variant="glass" className="medical-card backdrop-blur-xl animate-medical-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-medical-pulse"></div>
            Demo Access
          </h3>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => {
              const IconComponent = account.icon;
              return (
                <div 
                  key={account.role} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200/50 hover:border-primary-200 transition-all duration-300 hover:shadow-md animate-medical-slide-up group cursor-pointer"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  onClick={() => handleDemoAccountClick(account)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${account.color} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800">{account.role}</span>
                      <p className="text-xs text-slate-600">{account.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {account.action === 'navigate' ? 'Go to Portal' : 'Click to fill'}
                  </div>
                </div>
              );
            })}
            <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl border border-primary-200/50">
              <p className="text-xs text-primary-800 font-semibold text-center">
                Password: <code className="bg-primary-100 px-2 py-1 rounded-lg font-mono">demo123</code>
              </p>
            </div>
          </div>
        </Card>

        {/* Enhanced Footer */}
        <div className="text-center animate-medical-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-medical-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-medical-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-xs text-slate-500">
            © 2025 CuraPath Medical Systems. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
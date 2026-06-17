import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { EyeIcon, EyeSlashIcon, HeartIcon, ShieldCheckIcon, BeakerIcon, UserGroupIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const demoAccounts = [
    {
      email: 'doctor@curapath.com',
      password: 'demo123',
      role: 'Doctor',
      icon: BeakerIcon,
      color: 'from-purple-500 to-blue-600'
    },
    {
      email: 'patient@curapath.com',
      password: 'demo123',
      role: 'Patient',
      icon: HeartIcon,
      color: 'from-purple-500 to-blue-600'
    },
    {
      email: 'staff@curapath.com',
      password: 'demo123',
      role: 'Staff',
      icon: UserGroupIcon,
      color: 'from-purple-500 to-blue-600'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements for sides */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side decorative elements */}
        <div className="absolute left-0 top-1/4 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute left-8 top-1/2 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
        <div className="absolute left-16 bottom-1/4 w-20 h-20 bg-gradient-to-r from-purple-100/40 to-blue-100/40 rounded-full blur-2xl"></div>
        
        {/* Right side decorative elements */}
        <div className="absolute right-0 top-1/3 w-40 h-40 bg-gradient-to-bl from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute right-12 top-2/3 w-28 h-28 bg-gradient-to-tl from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
        <div className="absolute right-20 bottom-1/3 w-16 h-16 bg-gradient-to-l from-blue-100/40 to-purple-100/40 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-6xl w-full">
          {/* Enhanced Header with Animations */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 animate-pulse">
                  <HeartIcon className="h-12 w-12 text-white" />
                </div>
                {/* Orbiting elements */}
                <div className="absolute -top-3 -right-3 w-5 h-5 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              CuraPath
            </h1>
            <p className="text-xl text-slate-700 font-medium">
              Medical Analytics Platform
            </p>
          </div>

          {/* Single wide layout without card */}
          <div className="max-w-7xl w-full">
            {/* Header section */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">Sign In</h2>
              <p className="text-base text-slate-600">Access your medical portal</p>
            </div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Left features section */}
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheckIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Secure Access</h3>
                  <p className="text-sm text-slate-600">HIPAA compliant medical portal with advanced security</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BeakerIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Powered</h3>
                  <p className="text-sm text-slate-600">Advanced medical analytics and risk assessment</p>
                </div>
              </div>

              {/* Center login form - wider */}
              <div className="lg:col-span-3">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 pl-10 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 pl-10 pr-10 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-slate-700">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    fullWidth
                    size="lg"
                    loadingText="Signing in..."
                    className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium text-sm py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <ShieldCheckIcon className="h-4 w-4" />
                      <span>Sign In</span>
                    </div>
                  </Button>
                </form>

                {/* Demo Section */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <p className="text-xs text-slate-500 text-center mb-3">Quick Demo Access</p>
                  <div className="space-y-2">
                    {demoAccounts.map((account) => {
                      const IconComponent = account.icon;
                      return (
                        <div 
                          key={account.role} 
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-200 group cursor-pointer hover:shadow-md"
                          onClick={() => {
                            setEmail(account.email);
                            setPassword(account.password);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 bg-gradient-to-r ${account.color} rounded-md flex items-center justify-center shadow-sm`}>
                              <IconComponent className="h-3 w-3 text-white" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-slate-800">{account.role}</span>
                              <p className="text-xs text-slate-600">{account.email}</p>
                            </div>
                          </div>
                          <span className="text-xs text-purple-600 group-hover:text-purple-700 transition-colors duration-200 font-medium">
                            Click to fill
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-700 text-center font-medium">
                      Password: <code className="bg-white px-1 py-0.5 rounded text-xs">demo123</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right features section */}
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Patient Care</h3>
                  <p className="text-sm text-slate-600">Comprehensive medical management and monitoring</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800 mb-2">Team Access</h3>
                  <p className="text-xs text-slate-600">Collaborative healthcare team management</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500">
              © 2025 CuraPath Medical Systems
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
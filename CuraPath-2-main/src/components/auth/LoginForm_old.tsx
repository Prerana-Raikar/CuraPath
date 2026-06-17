import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Alert from '@/components/common/Alert';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const demoAccounts = [
    { role: 'Doctor', email: 'dr.smith@curapath.com', password: 'Doctor123!' },
    { role: 'Patient', email: 'patient1@example.com', password: 'Patient123!' },
    { role: 'Staff', email: 'staff1@curapath.com', password: 'Staff123!' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsLoading(true);

    try {
      await login(demoEmail, demoPassword);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 cyber-slide-in relative z-10">
        {/* Futuristic Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 glass-morphism rounded-3xl flex items-center justify-center cyber-glow relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <svg className="h-12 w-12 text-cyan-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse"></div>
          </div>
          <h2 className="mt-8 text-center text-5xl font-black neon-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            CURAPATH
          </h2>
          <div className="mt-2 h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
          <p className="mt-6 text-center text-lg text-slate-300 font-mono">
            <span className="text-cyan-400">&gt;</span> AI-Powered Health Analytics Platform
          </p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* Cyberpunk Login Form */}
        <div className="glass-morphism p-8 rounded-3xl cyber-float relative overflow-hidden" style={{animationDelay: '0.3s'}}>
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-[2px]">
            <div className="h-full w-full rounded-3xl bg-slate-900/80"></div>
          </div>
          
          {/* Data stream effect */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 data-stream"></div>
          
          <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <p className="text-red-300 font-mono text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="cyber-float" style={{animationDelay: '0.5s'}}>
                <label htmlFor="email" className="block text-sm font-mono text-cyan-300 mb-3">
                  <span className="text-cyan-400">&gt;</span> EMAIL_ADDRESS
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-cyan-400/60 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 font-mono backdrop-blur-sm"
                    placeholder="user@curapath.ai"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="cyber-float" style={{animationDelay: '0.7s'}}>
                <label htmlFor="password" className="block text-sm font-mono text-cyan-300 mb-3">
                  <span className="text-cyan-400">&gt;</span> PASSWORD
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-cyan-400/60 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 font-mono backdrop-blur-sm"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400/60 hover:text-cyan-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            <div className="pt-4 cyber-float" style={{animationDelay: '0.9s'}}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cyber-glow font-mono text-lg relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>ACCESSING SYSTEM...</span>
                    </div>
                  ) : (
                    <span>&gt; INITIALIZE LOGIN SEQUENCE</span>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>

          {/* Cyberpunk Demo Accounts */}
          <div className="mt-10 cyber-float" style={{animationDelay: '1.1s'}}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-6 bg-slate-900/80 text-cyan-300 font-mono text-sm backdrop-blur-sm">
                  <span className="text-cyan-400">&gt;</span> DEMO_ACCESS_PROTOCOLS
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {demoAccounts.map((account, index) => (
                <button
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={isLoading}
                  className="w-full p-4 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-cyan-400/50 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group backdrop-blur-sm cyber-float"
                  style={{ animationDelay: `${1.3 + index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${
                        account.role === 'Doctor' ? 'bg-cyan-400' :
                        account.role === 'Patient' ? 'bg-green-400' : 'bg-purple-400'
                      }`} />
                      <div className="text-left">
                        <p className="text-white font-mono font-semibold">
                          {account.role.toUpperCase()}_ACCESS
                        </p>
                        <p className="text-slate-400 text-xs font-mono">
                          {account.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Futuristic Backend Status */}
          <div className="mt-10 text-center cyber-float" style={{animationDelay: '1.5s'}}>
            <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-green-300 font-mono text-sm font-semibold">
                  API_CONNECTION: ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
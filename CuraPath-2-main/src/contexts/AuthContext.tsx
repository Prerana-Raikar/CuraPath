import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthAPI, TokenManager } from '../services/api';
import { MockAuthAPI, MockTokenManager } from '../services/mockApi';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockAPI, setUseMockAPI] = useState(true);

  const isAuthenticated = !!user;



  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      console.log('=== AUTH INITIALIZATION START ===');
      
      try {
        // Always start with no authentication - users must explicitly log in
        console.log('Starting fresh - no automatic authentication restoration');
        
        // Clear all authentication data from localStorage to ensure fresh start
        const clearAllAuthData = () => {
          // Clear mock API data
          localStorage.removeItem('curapath_mock_token');
          localStorage.removeItem('curapath_mock_user');
          
          // Clear real API data
          localStorage.removeItem('curapath_token');
          localStorage.removeItem('curapath_user');
          
          // Clear any other potential auth keys
          Object.keys(localStorage).forEach(key => {
            if (key.includes('curapath') || key.includes('auth') || key.includes('token')) {
              localStorage.removeItem(key);
            }
          });
        };
        
        clearAllAuthData();
        console.log('Cleared all authentication data from localStorage');
        
        setUser(null);
        setIsLoading(false);
        
        // Clear any existing tokens to ensure fresh start
        if (useMockAPI) {
          MockAuthAPI.logout();
        } else {
          TokenManager.removeToken();
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsLoading(false);
      }
      
      console.log('=== AUTH INITIALIZATION COMPLETE ===');
      console.log('Current state:', { user: null, isAuthenticated: false, isLoading: false });
    };

    initAuth();
  }, [useMockAPI]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Login attempt:', { email, useMockAPI });
      
      if (useMockAPI) {
        // Use mock API
        const response = await MockAuthAPI.login(email, password);
        console.log('Mock API response:', response);
        if (response.success && response.data?.user) {
          console.log('Setting user:', response.data.user);
          setUser(response.data.user);
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } else {
        // Use real API
        const response = await AuthAPI.login(email, password);
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await AuthAPI.register(userData);
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (useMockAPI) {
      MockAuthAPI.logout();
    } else {
      AuthAPI.logout();
    }
  };

  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user...');
      if (useMockAPI) {
        const response = await MockAuthAPI.getProfile();
        if (response.success && response.data?.user) {
          console.log('✅ Mock API refresh successful:', response.data.user);
          setUser(response.data.user);
        } else {
          throw new Error('Failed to get user profile');
        }
      } else {
        const response = await AuthAPI.getProfile();
        if (response.success && response.data?.user) {
          console.log('✅ Real API refresh successful:', response.data.user);
          setUser(response.data.user);
        } else {
          throw new Error('Failed to get user profile');
        }
      }
    } catch (error) {
      console.error('❌ Refresh user error:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
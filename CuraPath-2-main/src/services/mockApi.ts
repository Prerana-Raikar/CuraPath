// Mock API Service for CuraPath Frontend
// Provides demo functionality without requiring a backend server

import { User, UserRole } from '../types';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'doctor@curapath.com',
            firstName: 'Dr. Sanjana',
            lastName: 'Sharma',
    role: UserRole.DOCTOR,
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'patient@curapath.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.PATIENT,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'staff@curapath.com',
    firstName: 'Rohan',
    lastName: '',
    role: UserRole.STAFF,
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Token management
class MockTokenManager {
  private static readonly TOKEN_KEY = 'curapath_mock_token';
  private static readonly USER_KEY = 'curapath_mock_user';
  
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  
  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
  
  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  
  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Authentication API
export const MockAuthAPI = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(800); // Simulate network delay
    
    // Check if user exists and password is correct (demo123 for all users)
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (!user || password !== 'demo123') {
      throw new Error('Invalid email or password');
    }
    
    // Generate mock token
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    // Store token and user
    MockTokenManager.setToken(token);
    MockTokenManager.setUser(user);
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    };
  },

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    await delay(300);
    
    const token = MockTokenManager.getToken();
    const user = MockTokenManager.getUser();
    
    if (!token || !user) {
      throw new Error('Not authenticated');
    }
    
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    };
  },

  async logout(): Promise<ApiResponse> {
    await delay(200);
    MockTokenManager.removeToken();
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(MockTokenManager.getToken() && MockTokenManager.getUser());
  },

  // Get current user
  getCurrentUser(): User | null {
    return MockTokenManager.getUser();
  }
};

// Mock AI API
export const MockAIAPI = {
  async sendMessage(message: string, sessionId?: string): Promise<ApiResponse<{ sessionId: string; message: string; metadata: any }>> {
    await delay(1000);
    
    const responses = [
      "Based on your symptoms, I recommend scheduling an appointment with your primary care physician for a thorough evaluation.",
      "The symptoms you've described could be related to several conditions. Let me help you understand the possible causes.",
      "I understand your concern. Here are some general recommendations while you await professional medical advice.",
      "Thank you for providing that information. Based on medical literature, here's what you should know.",
      "It's important to monitor these symptoms. I recommend keeping a symptom diary and consulting with a healthcare provider."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      success: true,
      message: 'Message sent successfully',
      data: {
        sessionId: sessionId || `session_${Date.now()}`,
        message: randomResponse,
        metadata: {
          timestamp: new Date().toISOString(),
          confidence: 0.85,
          sources: ['Medical Literature', 'Clinical Guidelines']
        }
      }
    };
  }
};

// Mock Dashboard API
export const MockDashboardAPI = {
  async getStats(): Promise<ApiResponse<{ stats: any; role: string }>> {
    await delay(500);
    
    const user = MockTokenManager.getUser();
    if (!user) throw new Error('Not authenticated');
    
    let stats;
    
    switch (user.role) {
      case UserRole.DOCTOR:
        stats = {
          totalPatients: 247,
          appointmentsToday: 12,
          pendingRequests: 8,
          completedConsultations: 156
        };
        break;
      case UserRole.PATIENT:
        stats = {
          upcomingAppointments: 2,
          prescriptionRequests: 1,
          healthRecords: 15,
          lastCheckup: '2024-01-15'
        };
        break;
      case UserRole.STAFF:
        stats = {
          pendingApprovals: 23,
          processedToday: 45,
          totalPatients: 1247,
          systemAlerts: 3
        };
        break;
      default:
        stats = {};
    }
    
    return {
      success: true,
      message: 'Stats retrieved successfully',
      data: { stats, role: user.role }
    };
  }
};

// Health check
export const MockHealthAPI = {
  async checkHealth(): Promise<{ status: string; message: string }> {
    await delay(200);
    return { 
      status: 'OK', 
      message: 'Mock API is running - Demo mode active' 
    };
  }
};

export { MockTokenManager };
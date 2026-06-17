// API Service for CuraPath Frontend
// Connects to real Python Flask AI backend

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'curapath_token';
  
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  
  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
  
  static getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

const API_BASE_URL = 'http://localhost:5000/api';

// Generic API request function
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('🌐 API Request:', { url, options });
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...TokenManager.getAuthHeaders(),
  };

  const config: RequestInit = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    console.log('📡 Making fetch request to:', url);
    const response = await fetch(url, config);
    console.log('📥 Response received:', { 
      status: response.status, 
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    const data = await response.json();
    console.log('📊 Response data:', data);
    
    if (!response.ok) {
      console.error('❌ Response not OK, throwing error');
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    console.log('✅ API request successful, returning data');
    return data;
  } catch (error) {
    console.error('🚨 API Request Error:', error);
    throw error;
  }
}

// Authentication API
export const AuthAPI = {
  async login(email: string, password: string) {
    const response = await apiRequest<{
      user: any;
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.token) {
      TokenManager.setToken(response.data.token);
    }
    
    return response;
  },

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
  }) {
    const response = await apiRequest<{
      user: any;
      token: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data?.token) {
      TokenManager.setToken(response.data.token);
    }
    
    return response;
  },

  async getProfile() {
    return apiRequest<{ user: any }>('/auth/me');
  },

  async logout() {
    TokenManager.removeToken();
    return { success: true, message: 'Logged out successfully' };
  },
};

// AI Assistant API
export const AIAPI = {
  async sendMessage(message: string, sessionId?: string) {
    return apiRequest<{
      sessionId: string;
      message: string;
      metadata: any;
    }>('/ai-assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });
  },

  async getSessions() {
    return apiRequest<{ sessions: any[] }>('/ai/sessions');
  },

  async getSessionMessages(sessionId: string) {
    return apiRequest<{ messages: any[] }>(`/ai/sessions/${sessionId}/messages`);
  },

  async analyzeSymptoms(symptoms: string[], age?: number, gender?: string) {
    return apiRequest<{ analysis: any }>('/ai/analyze-symptoms', {
      method: 'POST',
      body: JSON.stringify({ symptoms, age, gender }),
    });
  }
};

// Risk Predictor API
export const RiskPredictorAPI = {
  async assessRisk(patientData: {
    age: number;
    conditions: string[];
    vitals: any;
    medicalHistory: any;
  }) {
    return apiRequest<{
      overall_risk: string;
      cardiovascular_risk: string;
      diabetes_risk: string;
      cancer_risk: string;
      recommendations: string[];
      timestamp: string;
    }>('/risk-predictor/assess', {
      method: 'POST',
      body: JSON.stringify({ patient_data: patientData }),
    });
  }
};

// Report Analyzer API
export const ReportAnalyzerAPI = {
  async analyzeReport(reportData: string, reportType: string) {
    return apiRequest<{
      summary: string;
      key_findings: string[];
      recommendations: string[];
      confidence_score: number;
      timestamp: string;
    }>('/report-analyzer/analyze', {
      method: 'POST',
      body: JSON.stringify({ report_data: reportData, report_type: reportType }),
    });
  }
};

// Symptom Checker API
export const SymptomCheckerAPI = {
  async checkSymptoms(symptoms: string[], age?: number, gender?: string) {
    return apiRequest<{
      triage_level: string;
      possible_conditions: string[];
      recommendations: string[];
      urgency: string;
      timestamp: string;
    }>('/symptom-checker/check', {
      method: 'POST',
      body: JSON.stringify({ symptoms, age, gender }),
    });
  },

  async suggestSymptoms(inputText: string) {
    return apiRequest<{
      suggested_symptoms: string[];
      related_categories: string[];
      timestamp: string;
    }>('/symptom-checker/suggest', {
      method: 'POST',
      body: JSON.stringify({ input_text: inputText }),
    });
  }
};

// Patient API
export const PatientAPI = {
  async getPatients(params?: { page?: number; limit?: number; search?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<{ patients: any[]; pagination: any }>(`/patients${queryString}`);
  },

  async getPatient(patientId: string) {
    return apiRequest<{ patient: any }>(`/patients/${patientId}`);
  },

  async createPatient(patientData: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    currentMedications?: string[];
  }) {
    return apiRequest<{ patient: any; tempPassword: string }>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  async updatePatient(patientId: string, updateData: any) {
    return apiRequest(`/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  async getMedicalRecords(patientId: string) {
    return apiRequest<{ records: any[] }>(`/patients/${patientId}/medical-records`);
  },

  async createMedicalRecord(patientId: string, recordData: any) {
    return apiRequest(`/patients/${patientId}/medical-records`, {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  },
};

// Prescription Request API
export const PrescriptionRequestAPI = {
  async createRequest(requestData: {
    medicationName: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    reasonForRequest: string;
    urgency?: 'low' | 'normal' | 'high' | 'urgent';
    requestType?: 'new' | 'refill' | 'dosage_change';
    existingPrescriptionId?: string;
    pharmacyPreference?: string;
    insuranceInfo?: string;
  }) {
    return apiRequest<{ request: any }>('/prescription-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  async getRequests(params?: { 
    page?: number; 
    limit?: number; 
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
    urgency?: 'low' | 'normal' | 'high' | 'urgent';
    patientId?: string;
  }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<{ requests: any[]; pagination: any }>(`/prescription-requests${queryString}`);
  },

  async getRequest(requestId: string) {
    return apiRequest<{ request: any }>(`/prescription-requests/${requestId}`);
  },

  async updateStatus(requestId: string, status: 'approved' | 'rejected', staffNotes?: string) {
    return apiRequest(`/prescription-requests/${requestId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, staffNotes }),
    });
  },

  async cancelRequest(requestId: string) {
    return apiRequest(`/prescription-requests/${requestId}/cancel`, {
      method: 'PUT',
    });
  },
};

// File Upload API
export const FileAPI = {
  async uploadFile(file: File, description?: string, category?: string, autoAnalyze?: boolean) {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    if (autoAnalyze) formData.append('autoAnalyze', 'true');

    return apiRequest<{
      fileId: string;
      originalName: string;
      analysis?: any;
    }>('/uploads/medical-document', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData - let browser set it with boundary
        ...TokenManager.getAuthHeaders(),
      },
      body: formData,
    });
  },

  async getFiles(params?: { category?: string; page?: number; limit?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<{ files: any[]; pagination: any }>(`/uploads/files${queryString}`);
  },

  async downloadFile(fileId: string) {
    const token = TokenManager.getToken();
    const url = `${API_BASE_URL}/uploads/files/${fileId}`;
    
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    return response.blob();
  },

  async deleteFile(fileId: string) {
    return apiRequest(`/uploads/files/${fileId}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const DashboardAPI = {
  async getStats() {
    return apiRequest<{ stats: any; role: string }>('/dashboard/stats');
  },

  async getChartData(type: string, period?: string) {
    const params = period ? `?type=${type}&period=${period}` : `?type=${type}`;
    return apiRequest<any>(`/dashboard/chart-data${params}`);
  },

  async getRecentActivity() {
    return apiRequest<{ activities: any[] }>('/dashboard/recent-activity');
  },
};

// Health check
export const HealthAPI = {
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'ERROR', message: 'AI Backend not available' };
    }
  },
};

export { TokenManager };
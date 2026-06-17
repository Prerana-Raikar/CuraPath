// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  DOCTOR = 'doctor',
  PATIENT = 'patient',
  STAFF = 'staff'
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Patient and Medical Data Types
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  address: Address;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalRecord[];
  prescriptions: Prescription[];
  labResults: LabResult[];
  vitals: VitalSigns[];
  accessRequests: AccessRequest[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'diagnosis' | 'procedure' | 'allergy' | 'condition';
  title: string;
  description: string;
  date: string;
  doctorId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'chronic';
  attachments?: MedicalDocument[];
}

export interface Prescription {
  id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued';
  instructions?: string;
  refills: number;
  pharmacy?: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  testType: string;
  result: string;
  normalRange: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
  orderDate: string;
  resultDate: string;
  orderedBy: string;
  lab: string;
  notes?: string;
}

export interface VitalSigns {
  id: string;
  patientId: string;
  timestamp: string;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  recordedBy: string;
}

export interface MedicalDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  uploadedBy: string;
  category: 'lab_result' | 'imaging' | 'prescription' | 'report' | 'other';
  url: string;
  thumbnailUrl?: string;
}

// Access Control Types
export interface AccessRequest {
  id: string;
  patientId: string;
  requesterId: string;
  requesterName: string;
  requesterRole: UserRole;
  requestType: 'full_access' | 'limited_access' | 'emergency_access';
  purpose: string;
  requestedData: string[];
  status: 'pending' | 'approved' | 'denied' | 'expired';
  requestDate: string;
  responseDate?: string;
  expiryDate?: string;
  notes?: string;
}

// AI and Analysis Types
export interface AIAnalysis {
  id: string;
  patientId: string;
  analysisType: 'risk_assessment' | 'summary' | 'symptom_check' | 'report_analysis';
  input: string;
  output: string;
  confidence: number;
  recommendations?: string[];
  createdAt: string;
  createdBy: string;
}

export interface SymptomCheckResult {
  symptoms: string[];
  possibleConditions: {
    condition: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    recommendations: string[];
  }[];
  disclaimer: string;
}

export interface HealthRiskPrediction {
  patientId: string;
  riskFactors: {
    factor: string;
    level: 'low' | 'medium' | 'high';
    impact: number;
  }[];
  overallRisk: number;
  predictions: {
    condition: string;
    probability: number;
    timeframe: string;
  }[];
  recommendations: string[];
  generatedAt: string;
}

// Monitoring and Tasks Types
export interface MonitoringTask {
  id: string;
  patientId: string;
  taskType: 'vital_monitoring' | 'medication_reminder' | 'follow_up' | 'lifestyle_tracking';
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'as_needed';
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
  assignedBy: string;
  lastCompleted?: string;
  completionData?: any;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation and UI Types
export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  current?: boolean;
  badge?: number;
}

export interface DashboardStats {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: any;
  href?: string;
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { DashboardStats } from '@/types';
import { getPendingAppointments } from '@/data/mockAppointments';
import { 
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  EyeIcon,
  ChevronRightIcon,
  CalendarIcon,
  ChartBarIcon,
  BellIcon,
  HeartIcon,
  ShieldCheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon as ChevronRight,
  CheckCircleIcon,
  UserIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

// Patient interface matching PatientList component
interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  medicalRecordNumber?: string;
  bloodType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  createdAt?: string;
  hasAccess?: boolean;
  accessLevel?: string;
  accessRequest?: any;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  vitals?: {
    bloodPressure?: { systolic: number; diastolic: number };
    heartRate: number;
    temperature: number;
    weight: number;
    height: number;
    bmi: number;
  }[];
  labResults?: {
    testName: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: string;
    resultDate: string;
    notes: string;
  }[];
  riskAssessment?: {
    overallRisk: string;
    riskScore: number;
    lastAssessed: string;
    cardiovascularRisk: string;
    diabetesRisk: string;
    cancerRisk: string;
    recommendations: string[];
  };
}

const DoctorDashboard: React.FC = () => {
  console.log('DoctorDashboard component rendered');
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock patient data from PatientList component - 10 total patients (7 accessible, 3 not accessible)
  const mockPatients: Patient[] = [
    {
      id: 'P001',
      email: 'priya.sharma@gmail.com',
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+91-98765-43210',
      dateOfBirth: '1985-03-15',
      gender: 'Female',
      medicalRecordNumber: 'MRN001',
      bloodType: 'A+',
      emergencyContactName: 'Raj Sharma',
      emergencyContactPhone: '+91-98765-43211',
      allergies: ['Penicillin', 'Shellfish'],
      chronicConditions: ['Type 1 Diabetes', 'Hypertension'],
      currentMedications: ['Insulin', 'Metformin', 'Lisinopril'],
      createdAt: '2023-01-15',
      hasAccess: true,
      accessLevel: 'full',
      address: {
        street: '123 Medical Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 140, diastolic: 90 },
          heartRate: 78,
          temperature: 98.6,
          weight: 65,
          height: 165,
          bmi: 23.9
        }
      ],
      labResults: [
        {
          testName: 'HbA1c',
          value: '7.2',
          unit: '%',
          referenceRange: '4.0-5.6',
          status: 'High',
          resultDate: '2024-01-20',
          notes: 'Elevated - needs adjustment'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 65,
        lastAssessed: '2024-01-20',
        cardiovascularRisk: 'Medium',
        diabetesRisk: 'High',
        cancerRisk: 'Low',
        recommendations: ['Monitor blood sugar daily', 'Regular exercise', 'Diet consultation']
      }
    },
    {
      id: 'P002',
      email: 'raj.patel@gmail.com',
      firstName: 'Raj',
      lastName: 'Patel',
      phone: '+91-98765-43212',
      dateOfBirth: '1978-07-22',
      gender: 'Male',
      medicalRecordNumber: 'MRN002',
      bloodType: 'O+',
      emergencyContactName: 'Priya Patel',
      emergencyContactPhone: '+91-98765-43213',
      allergies: ['Latex'],
      chronicConditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
      currentMedications: ['Aspirin', 'Atorvastatin', 'Metoprolol'],
      createdAt: '2023-02-10',
      hasAccess: true,
      accessLevel: 'limited',
      address: {
        street: '456 Health Avenue',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 135, diastolic: 85 },
          heartRate: 72,
          temperature: 98.4,
          weight: 78,
          height: 175,
          bmi: 25.5
        }
      ],
      labResults: [
        {
          testName: 'Cholesterol',
          value: '220',
          unit: 'mg/dL',
          referenceRange: '<200',
          status: 'High',
          resultDate: '2024-01-18',
          notes: 'Elevated LDL'
        }
      ],
      riskAssessment: {
        overallRisk: 'High',
        riskScore: 78,
        lastAssessed: '2024-01-18',
        cardiovascularRisk: 'High',
        diabetesRisk: 'Medium',
        cancerRisk: 'Low',
        recommendations: ['Cardiac monitoring', 'Low-fat diet', 'Regular exercise']
      }
    },
    {
      id: 'P003',
      email: 'ananya.kumar@gmail.com',
      firstName: 'Ananya',
      lastName: 'Kumar',
      phone: '+91-98765-43214',
      dateOfBirth: '1992-11-08',
      gender: 'Female',
      medicalRecordNumber: 'MRN003',
      bloodType: 'B+',
      emergencyContactName: 'Vikram Kumar',
      emergencyContactPhone: '+91-98765-43215',
      allergies: ['Dust', 'Pollen'],
      chronicConditions: ['Migraine', 'Anxiety'],
      currentMedications: ['Sumatriptan', 'Escitalopram'],
      createdAt: '2023-03-05',
      hasAccess: true,
      accessLevel: 'emergency',
      address: {
        street: '789 Wellness Street',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 75,
          temperature: 98.8,
          weight: 58,
          height: 160,
          bmi: 22.7
        }
      ],
      labResults: [
        {
          testName: 'Vitamin D',
          value: '18',
          unit: 'ng/mL',
          referenceRange: '30-100',
          status: 'Low',
          resultDate: '2024-01-22',
          notes: 'Deficient - supplementation needed'
        }
      ],
      riskAssessment: {
        overallRisk: 'Low',
        riskScore: 35,
        lastAssessed: '2024-01-22',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Vitamin D supplements', 'Stress management', 'Regular sleep']
      }
    },
    {
      id: 'P004',
      email: 'arjun.singh@gmail.com',
      firstName: 'Arjun',
      lastName: 'Singh',
      phone: '+91-98765-43216',
      dateOfBirth: '1972-05-12',
      gender: 'Male',
      medicalRecordNumber: 'MRN004',
      bloodType: 'AB+',
      emergencyContactName: 'Kavya Singh',
      emergencyContactPhone: '+91-98765-43217',
      allergies: ['Sulfa drugs'],
      chronicConditions: ['Prostate Cancer', 'Hypertension'],
      currentMedications: ['Bicalutamide', 'Lisinopril', 'Tamsulosin'],
      createdAt: '2023-04-20',
      hasAccess: true,
      accessLevel: 'full',
      address: {
        street: '321 Cancer Care Lane',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 145, diastolic: 95 },
          heartRate: 68,
          temperature: 98.2,
          weight: 82,
          height: 178,
          bmi: 25.9
        }
      ],
      labResults: [
        {
          testName: 'PSA',
          value: '8.5',
          unit: 'ng/mL',
          referenceRange: '<4.0',
          status: 'High',
          resultDate: '2024-01-19',
          notes: 'Elevated - monitoring required'
        }
      ],
      riskAssessment: {
        overallRisk: 'High',
        riskScore: 82,
        lastAssessed: '2024-01-19',
        cardiovascularRisk: 'High',
        diabetesRisk: 'Low',
        cancerRisk: 'High',
        recommendations: ['Oncological monitoring', 'Regular PSA tests', 'Lifestyle modifications']
      }
    },
    {
      id: 'P005',
      email: 'meera.reddy@gmail.com',
      firstName: 'Meera',
      lastName: 'Reddy',
      phone: '+91-98765-43218',
      dateOfBirth: '1988-09-30',
      gender: 'Female',
      medicalRecordNumber: 'MRN005',
      bloodType: 'O-',
      emergencyContactName: 'Suresh Reddy',
      emergencyContactPhone: '+91-98765-43219',
      allergies: ['Ibuprofen'],
      chronicConditions: ['Rheumatoid Arthritis', 'Osteoporosis'],
      currentMedications: ['Methotrexate', 'Calcium Carbonate', 'Vitamin D3'],
      createdAt: '2023-05-15',
      hasAccess: true,
      accessLevel: 'limited',
      address: {
        street: '654 Arthritis Road',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 125, diastolic: 82 },
          heartRate: 74,
          temperature: 98.5,
          weight: 62,
          height: 162,
          bmi: 23.6
        }
      ],
      labResults: [
        {
          testName: 'Rheumatoid Factor',
          value: '45',
          unit: 'IU/mL',
          referenceRange: '<14',
          status: 'High',
          resultDate: '2024-01-21',
          notes: 'Positive for RA'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 58,
        lastAssessed: '2024-01-21',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Joint protection', 'Calcium supplements', 'Physical therapy']
      }
    },
    {
      id: 'P006',
      email: 'vikram.malhotra@gmail.com',
      firstName: 'Vikram',
      lastName: 'Malhotra',
      phone: '+91-98765-43220',
      dateOfBirth: '1980-12-03',
      gender: 'Male',
      medicalRecordNumber: 'MRN006',
      bloodType: 'A-',
      emergencyContactName: 'Priya Malhotra',
      emergencyContactPhone: '+91-98765-43221',
      allergies: ['Peanuts', 'Tree nuts'],
      chronicConditions: ['Asthma', 'GERD'],
      currentMedications: ['Albuterol', 'Omeprazole', 'Montelukast'],
      createdAt: '2023-06-10',
      hasAccess: true,
      accessLevel: 'limited',
      address: {
        street: '987 Respiratory Way',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 130, diastolic: 85 },
          heartRate: 76,
          temperature: 98.7,
          weight: 75,
          height: 172,
          bmi: 25.4
        }
      ],
      labResults: [
        {
          testName: 'Peak Flow',
          value: '450',
          unit: 'L/min',
          referenceRange: '500-600',
          status: 'Low',
          resultDate: '2024-01-23',
          notes: 'Below normal range'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 52,
        lastAssessed: '2024-01-23',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Avoid allergens', 'Regular inhaler use', 'Monitor peak flow']
      }
    },
    {
      id: 'P007',
      email: 'kavya.iyer@gmail.com',
      firstName: 'Kavya',
      lastName: 'Iyer',
      phone: '+91-98765-43222',
      dateOfBirth: '1995-04-18',
      gender: 'Female',
      medicalRecordNumber: 'MRN007',
      bloodType: 'B-',
      emergencyContactName: 'Rahul Iyer',
      emergencyContactPhone: '+91-98765-43223',
      allergies: ['Latex', 'Adhesive tape'],
      chronicConditions: ['Eczema', 'Seasonal allergies'],
      currentMedications: ['Cetirizine', 'Hydrocortisone cream', 'Emollient cream'],
      createdAt: '2023-07-05',
      hasAccess: true,
      accessLevel: 'full',
      address: {
        street: '456 Dermatology Drive',
        city: 'Kolkata',
        state: 'West Bengal',
        zipCode: '700001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 118, diastolic: 78 },
          heartRate: 72,
          temperature: 98.4,
          weight: 55,
          height: 158,
          bmi: 22.0
        }
      ],
      labResults: [
        {
          testName: 'IgE Total',
          value: '280',
          unit: 'kU/L',
          referenceRange: '<100',
          status: 'High',
          resultDate: '2024-01-24',
          notes: 'Elevated - allergic response'
        }
      ],
      riskAssessment: {
        overallRisk: 'Low',
        riskScore: 28,
        lastAssessed: '2024-01-24',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Avoid triggers', 'Regular moisturizing', 'Allergy management']
      }
    },
    {
      id: 'P008',
      email: 'rahul.gupta@gmail.com',
      firstName: 'Rahul',
      lastName: 'Gupta',
      phone: '+91-98765-43224',
      dateOfBirth: '1975-08-25',
      gender: 'Male',
      medicalRecordNumber: 'MRN008',
      bloodType: 'O+',
      emergencyContactName: 'Sunita Gupta',
      emergencyContactPhone: '+91-98765-43225',
      allergies: ['Codeine'],
      chronicConditions: ['Chronic Kidney Disease', 'Hypertension'],
      currentMedications: ['Amlodipine', 'Furosemide', 'Calcitriol'],
      createdAt: '2023-08-12',
      hasAccess: false,
      accessLevel: 'none',
      address: {
        street: '789 Nephrology Street',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '380001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 150, diastolic: 95 },
          heartRate: 70,
          temperature: 98.3,
          weight: 80,
          height: 175,
          bmi: 26.1
        }
      ],
      labResults: [
        {
          testName: 'Creatinine',
          value: '2.8',
          unit: 'mg/dL',
          referenceRange: '0.7-1.3',
          status: 'High',
          resultDate: '2024-01-25',
          notes: 'Elevated - kidney function impaired'
        }
      ],
      riskAssessment: {
        overallRisk: 'High',
        riskScore: 75,
        lastAssessed: '2024-01-25',
        cardiovascularRisk: 'High',
        diabetesRisk: 'Medium',
        cancerRisk: 'Low',
        recommendations: ['Kidney function monitoring', 'Low-sodium diet', 'Regular nephrology follow-up']
      }
    },
    {
      id: 'P009',
      email: 'sunita.verma@gmail.com',
      firstName: 'Sunita',
      lastName: 'Verma',
      phone: '+91-98765-43226',
      dateOfBirth: '1982-11-14',
      gender: 'Female',
      medicalRecordNumber: 'MRN009',
      bloodType: 'A+',
      emergencyContactName: 'Amit Verma',
      emergencyContactPhone: '+91-98765-43227',
      allergies: ['Sulfa drugs', 'Aspirin'],
      chronicConditions: ['Multiple Sclerosis', 'Depression'],
      currentMedications: ['Interferon beta-1a', 'Sertraline', 'Baclofen'],
      createdAt: '2023-09-20',
      hasAccess: false,
      accessLevel: 'none',
      address: {
        street: '321 Neurology Avenue',
        city: 'Jaipur',
        state: 'Rajasthan',
        zipCode: '302001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 125, diastolic: 80 },
          heartRate: 73,
          temperature: 98.6,
          weight: 68,
          height: 165,
          bmi: 25.0
        }
      ],
      labResults: [
        {
          testName: 'Vitamin B12',
          value: '180',
          unit: 'pg/mL',
          referenceRange: '200-900',
          status: 'Low',
          resultDate: '2024-01-26',
          notes: 'Deficient - supplementation needed'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 62,
        lastAssessed: '2024-01-26',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        recommendations: ['Neurological monitoring', 'Vitamin B12 supplements', 'Physical therapy']
      }
    },
    {
      id: 'P010',
      email: 'amit.kumar@gmail.com',
      firstName: 'Amit',
      lastName: 'Kumar',
      phone: '+91-98765-43228',
      dateOfBirth: '1990-06-08',
      gender: 'Male',
      medicalRecordNumber: 'MRN010',
      bloodType: 'AB+',
      emergencyContactName: 'Neha Kumar',
      emergencyContactPhone: '+91-98765-43229',
      allergies: ['Shellfish', 'Eggs'],
      chronicConditions: ['Ulcerative Colitis', 'Iron Deficiency Anemia'],
      currentMedications: ['Mesalamine', 'Iron Sulfate', 'Folic Acid'],
      createdAt: '2023-10-15',
      hasAccess: false,
      accessLevel: 'none',
      address: {
        street: '654 Gastroenterology Road',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        zipCode: '226001'
      },
      vitals: [
        {
          bloodPressure: { systolic: 115, diastolic: 75 },
          heartRate: 75,
          temperature: 98.5,
          weight: 70,
          height: 170,
          bmi: 24.2
        }
      ],
      labResults: [
        {
          testName: 'Hemoglobin',
          value: '10.2',
          unit: 'g/dL',
          referenceRange: '13.5-17.5',
          status: 'Low',
          resultDate: '2024-01-27',
          notes: 'Anemic - iron therapy ongoing'
        }
      ],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 48,
        lastAssessed: '2024-01-27',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Medium',
        recommendations: ['Iron supplementation', 'Colonoscopy monitoring', 'Balanced diet']
      }
    }
  ];

  // Load patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setPatients(mockPatients);
      setLoading(false);
    };
    loadPatients();
  }, []);

  // Helper functions
  const getAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getPatientStatus = (patient: Patient): string => {
    if (!patient.riskAssessment) return 'unknown';
    
    const overallRisk = patient.riskAssessment.overallRisk.toLowerCase();
    
    if (overallRisk === 'low') return 'stable';
    if (overallRisk === 'medium') return 'monitoring';
    if (overallRisk === 'high' || overallRisk === 'very high' || overallRisk === 'critical') return 'highrisk';
    
    return 'unknown';
  };

  const getPatientRisk = (patient: Patient): string => {
    if (!patient.riskAssessment) return 'unknown';
    
    const overallRisk = patient.riskAssessment.overallRisk.toLowerCase();
    
    if (overallRisk === 'low') return 'low';
    if (overallRisk === 'medium') return 'medium';
    if (overallRisk === 'high') return 'high';
    if (overallRisk === 'very high' || overallRisk === 'critical') return 'critical';
    
    return 'unknown';
  };

  // Calculate dashboard statistics
  const totalPatients = patients.length;
  const accessiblePatients = patients.filter(p => p.hasAccess).length;
  const highRiskPatients = patients.filter(p => getPatientRisk(p) === 'high' || getPatientRisk(p) === 'critical').length;
  const stablePatients = patients.filter(p => getPatientStatus(p) === 'stable').length;
  const monitoringPatients = patients.filter(p => getPatientStatus(p) === 'monitoring').length;

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDayNames = () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Sample appointments for the calendar
  const getAppointmentsForDate = (date: Date) => {
    const appointments = [
      { date: '2024-01-25', patient: 'Priya Sharma', time: '09:00 AM', type: 'Follow-up' },
      { date: '2024-01-26', patient: 'Raj Patel', time: '10:30 AM', type: 'Consultation' },
      { date: '2024-01-27', patient: 'Ananya Kumar', time: '02:00 PM', type: 'Check-up' },
      { date: '2024-01-28', patient: 'Arjun Singh', time: '03:30 PM', type: 'Emergency' },
      { date: '2024-01-29', patient: 'Meera Reddy', time: '04:45 PM', type: 'Follow-up' }
    ];
    
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
  };

  const stats: DashboardStats[] = [
    {
      label: 'Total Patients',
      value: totalPatients,
      change: { value: 0, type: 'increase' },
      icon: UsersIcon,
      href: '/doctor/patients'
    },
    {
      label: 'Accessible Patients',
      value: accessiblePatients,
      icon: CheckCircleIcon,
      href: '/doctor/patients'
    },
    {
      label: 'High Risk Patients',
      value: highRiskPatients,
      change: { value: 0, type: 'increase' },
      icon: ExclamationTriangleIcon,
      href: '/doctor/risk-predictor'
    },
    {
      label: 'Today\'s Appointments',
      value: 12,
      icon: ClockIcon
    }
  ];

  const recentPatients = patients.slice(0, 3).map(patient => ({
    id: patient.id,
    name: `${patient.firstName} ${patient.lastName}`,
    age: getAge(patient.dateOfBirth),
    lastVisit: patient.createdAt || '2024-01-25',
    condition: patient.chronicConditions?.[0] || 'No conditions',
    status: getPatientStatus(patient),
    avatar: `${patient.firstName?.[0]}${patient.lastName?.[0]}`,
    hasAccess: patient.hasAccess
  }));

  const recentAlerts = [
    {
      id: '1',
      patient: 'Priya Sharma',
      message: 'Blood pressure reading above threshold',
      time: '2 hours ago',
      severity: 'high'
    },
    {
      id: '2',
      patient: 'Raj Patel',
      message: 'Missed medication reminder',
      time: '4 hours ago',
      severity: 'medium'
    },
    {
      id: '3',
      patient: 'Ananya Kumar',
      message: 'Lab results available for review',
      time: '6 hours ago',
      severity: 'low'
    }
  ];

  const quickActions = [
    {
      title: 'Patient List',
      description: 'View all patients and manage access',
      icon: UsersIcon,
      href: '/doctor/patients',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Risk Predictor',
      description: 'Assess patient health risks',
      icon: ExclamationTriangleIcon,
      href: '/doctor/risk-predictor',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Access Requests',
      description: 'Manage patient access requests',
      icon: ShieldCheckIcon,
      href: '/doctor/access-requests',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <HeartIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome back, Dr. Sanjana Sharma
          </h1>
          <p className="text-lg text-gray-600">
            Here's what's happening with your patients today
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            stat.href ? (
              <button
                key={stat.label}
                onClick={() => navigate(stat.href!)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left w-full"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </p>
                    {stat.change && (
                      <div className="flex items-center mt-2">
                        <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${
                          stat.change.type === 'increase' ? 'text-green-500' : 'text-red-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          +{stat.change.value}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${
                    index === 0 ? 'from-blue-500 to-blue-600' :
                    index === 1 ? 'from-orange-500 to-orange-600' :
                    index === 2 ? 'from-red-500 to-red-600' :
                    'from-green-500 to-green-600'
                  }`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </button>
            ) : (
              <div 
                key={stat.label} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </p>
                    {stat.change && (
                      <div className="flex items-center mt-2">
                        <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${
                          stat.change.type === 'increase' ? 'text-green-500' : 'text-red-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          +{stat.change.value}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${
                    index === 0 ? 'from-blue-500 to-blue-600' :
                    index === 1 ? 'from-orange-500 to-orange-600' :
                    index === 2 ? 'from-red-500 to-red-600' :
                    'from-green-500 to-green-600'
                  }`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600">Access your essential medical tools</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={action.title}
                onClick={() => navigate(action.href)}
                className="group block w-full text-left"
              >
                <div className={`${action.bgColor} rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group-hover:border-gray-300`}>
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    {action.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {action.description}
                  </p>
                  
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                      Open Tool →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Overview Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Patient Overview
              </h3>
              <p className="text-sm text-gray-600">Quick summary of your patient population</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/doctor/patients')}>
              Manage Patients
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-2">{stablePatients}</div>
              <div className="text-sm text-blue-700">Stable Patients</div>
              <div className="text-xs text-blue-600 mt-1">Low risk, routine care</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600 mb-2">{monitoringPatients}</div>
              <div className="text-sm text-yellow-700">Monitoring Patients</div>
              <div className="text-xs text-yellow-600 mt-1">Medium risk, regular follow-up</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="text-2xl font-bold text-red-600 mb-2">{highRiskPatients}</div>
              <div className="text-sm text-red-700">High Risk Patients</div>
              <div className="text-xs text-red-600 mt-1">Requires immediate attention</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Access Status</span>
                <span className="text-xs text-gray-500">{accessiblePatients}/{totalPatients}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(accessiblePatients / totalPatients) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {accessiblePatients} patients with granted access
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Risk Distribution</span>
                <span className="text-xs text-gray-500">Based on assessment</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">Low Risk</span>
                  <span className="text-gray-600">{patients.filter(p => getPatientRisk(p) === 'low').length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-600">Medium Risk</span>
                  <span className="text-gray-600">{patients.filter(p => getPatientRisk(p) === 'medium').length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-600">High Risk</span>
                  <span className="text-gray-600">{patients.filter(p => getPatientRisk(p) === 'high' || getPatientRisk(p) === 'critical').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Patients */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Patients
                </h3>
                <p className="text-sm text-gray-600">Latest patient interactions</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => navigate('/doctor/patients')}>
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div 
                  key={patient.id} 
                  className={`flex items-center p-4 rounded-xl border transition-colors cursor-pointer ${
                    patient.hasAccess 
                      ? 'bg-gray-50 border-gray-100 hover:bg-gray-100' 
                      : 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 ${
                    patient.hasAccess 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-orange-500'
                  }`}>
                    {patient.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {patient.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={patient.status === 'stable' ? 'success' : patient.status === 'monitoring' ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {patient.status}
                        </Badge>
                        {!patient.hasAccess && (
                          <Badge variant="warning" size="sm">
                            Access Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Age: {patient.age} • {patient.condition}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" 
                      title="View patient details" 
                      aria-label="View patient details"
                      onClick={() => navigate(`/doctor/patients`)}
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    {!patient.hasAccess && (
                      <button 
                        className="p-2 text-orange-600 hover:text-orange-700 rounded-lg hover:bg-orange-100 transition-colors" 
                        title="Request access" 
                        aria-label="Request access"
                        onClick={() => navigate('/doctor/access-requests')}
                      >
                        <ShieldCheckIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Alert System */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Patient Alerts & Notifications
                </h3>
                <p className="text-sm text-gray-600">Real-time patient health alerts</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/doctor/risk-predictor')}>
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className={`w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0 ${
                    alert.severity === 'high' 
                      ? 'bg-red-500' 
                      : alert.severity === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}></div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">
                        {alert.patient}
                      </p>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-lg">
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {alert.message}
                    </p>
                    <Badge 
                      variant={
                        alert.severity === 'high' ? 'danger' : 
                        alert.severity === 'medium' ? 'warning' : 
                        'info'
                      }
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="View alert details" aria-label="View alert details">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              {/* Add patient-specific alerts based on risk assessment */}
              {patients.filter(p => getPatientRisk(p) === 'high' || getPatientRisk(p) === 'critical').slice(0, 2).map((patient) => (
                <div 
                  key={`risk-${patient.id}`}
                  className="flex items-start p-4 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <div className="w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0 bg-red-500"></div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-red-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <span className="text-xs text-red-600 bg-red-200 px-2 py-1 rounded-lg">
                        High Risk
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      Patient requires immediate attention - Risk Score: {patient.riskAssessment?.riskScore}
                    </p>
                    <Badge variant="danger" size="sm">
                      Critical
                    </Badge>
                  </div>
                  
                  <button 
                    className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-200 transition-colors" 
                    title="View patient details" 
                    aria-label="View patient details"
                    onClick={() => navigate('/doctor/patients')}
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Today's Schedule
              </h3>
              <p className="text-sm text-gray-600">Your appointments for today</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsCalendarOpen(true)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { time: '09:00 AM', patient: 'Priya Sharma', type: 'Follow-up' },
              { time: '10:30 AM', patient: 'Raj Patel', type: 'Consultation' },
              { time: '02:00 PM', patient: 'Ananya Kumar', type: 'Check-up' },
              { time: '03:30 PM', patient: 'Arjun Singh', type: 'Emergency' },
              { time: '04:45 PM', patient: 'Meera Reddy', type: 'Follow-up' }
            ].map((appointment, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    {appointment.time}
                  </span>
                  <Badge variant="info" size="sm">
                    {appointment.type}
                  </Badge>
                </div>
                <p className="font-semibold text-gray-900">
                  {appointment.patient}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Calendar View</h2>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Calendar Navigation */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900">{getMonthName(currentDate)}</h3>
                  <Button variant="secondary" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                </div>
                
                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {getDayNames().map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
                  const days = [];
                  
                  // Add empty cells for days before the first day of the month
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg"></div>);
                  }
                  
                  // Add cells for each day of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const appointments = getAppointmentsForDate(date);
                    
                    days.push(
                      <div
                        key={day}
                        className={`h-24 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                          isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${
                            isToday ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {day}
                          </span>
                          {appointments.length > 0 && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        
                        {appointments.slice(0, 2).map((apt, index) => (
                          <div
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-1 truncate"
                            title={`${apt.time} - ${apt.patient} (${apt.type})`}
                          >
                            {apt.time} - {apt.patient}
                          </div>
                        ))}
                        
                        {appointments.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{appointments.length - 2} more
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return days;
                })()}
              </div>
            </div>

            {/* Appointments List */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Upcoming Appointments</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {(() => {
                  const upcomingAppointments = [];
                  const today = new Date();
                  
                  for (let i = 0; i < 7; i++) {
                    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
                    const appointments = getAppointmentsForDate(date);
                    
                    appointments.forEach(apt => {
                      upcomingAppointments.push({
                        ...apt,
                        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      });
                    });
                  }
                  
                  return upcomingAppointments.slice(0, 5).map((apt, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">{apt.date}</span>
                        <span className="text-gray-900 font-medium">{apt.patient}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{apt.time}</span>
                        <Badge variant="info" size="sm">
                          {apt.type}
                        </Badge>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Summary Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Patient Summary</h3>
            <p className="text-sm text-gray-600">Comprehensive overview of your patient population</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/doctor/patients')}>
            View Full Patient List
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <UsersIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{totalPatients}</div>
            <div className="text-sm text-blue-800">Total Patients</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{accessiblePatients}</div>
            <div className="text-sm text-green-800">With Access</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
            <ShieldCheckIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">{totalPatients - accessiblePatients}</div>
            <div className="text-sm text-orange-800">Need Access</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">{highRiskPatients}</div>
            <div className="text-sm text-red-800">High Risk</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Recent Patient Activity</h4>
          <div className="space-y-3">
            {patients.slice(0, 3).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                    patient.hasAccess 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-orange-500'
                  }`}>
                    {patient.firstName?.[0]}{patient.lastName?.[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.chronicConditions?.[0] || 'No conditions'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={getPatientStatus(patient) === 'stable' ? 'success' : getPatientStatus(patient) === 'monitoring' ? 'warning' : 'danger'}
                    size="sm"
                  >
                    {getPatientStatus(patient)}
                  </Badge>
                  {!patient.hasAccess && (
                    <Badge variant="warning" size="sm">
                      Access Required
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Appointments Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Pending Appointment Requests</h3>
            <p className="text-sm text-gray-600">New appointment requests from patients</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/doctor/appointments')}>
            View All
          </Button>
        </div>
        
        {(() => {
          const pendingAppointments = getPendingAppointments('johnson@curapath.com');
          
          if (pendingAppointments.length === 0) {
            return (
              <div className="text-center py-8">
                <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending appointment requests</p>
              </div>
            );
          }
          
          return (
            <div className="space-y-4">
              {pendingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
                    {appointment.patientName?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {appointment.patientName || 'Patient'}
                      </h4>
                      <Badge variant="warning" size="sm">
                        Pending
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {appointment.type} • {appointment.date} at {appointment.time}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reason: {appointment.notes}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-green-600 hover:text-green-700 rounded-lg hover:bg-green-100 transition-colors" 
                      title="Approve appointment"
                      aria-label="Approve appointment"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-100 transition-colors" 
                      title="Reject appointment"
                      aria-label="Reject appointment"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default DoctorDashboard;
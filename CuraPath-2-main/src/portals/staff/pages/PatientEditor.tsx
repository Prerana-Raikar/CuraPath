import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  PencilSquareIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  PlusIcon,
  XMarkIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
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

const PatientEditor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create patient form state
  const [createForm, setCreateForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | 'other' | 'prefer_not_to_say' | '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    bloodType: '',
    allergies: [] as string[],
    chronicConditions: [] as string[],
    currentMedications: [] as string[]
  });

  // Mock patients data - 10 patients matching Doctor Portal
  const mockPatients: Patient[] = [
    {
      id: 'P001',
      email: 'priya.sharma@gmail.com',
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+91-98765-43210',
      dateOfBirth: '1985-03-15',
      gender: 'female',
      medicalRecordNumber: 'MRN001',
      bloodType: 'A+',
      emergencyContactName: 'Raj Sharma',
      emergencyContactPhone: '+91-98765-43211',
      allergies: ['Penicillin', 'Shellfish'],
      chronicConditions: ['Type 1 Diabetes', 'Hypertension'],
      currentMedications: ['Insulin', 'Metformin', 'Lisinopril'],
      createdAt: '2023-01-15',
      hasAccess: true,
      accessLevel: 'full_access',
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
      gender: 'male',
      medicalRecordNumber: 'MRN002',
      bloodType: 'O+',
      emergencyContactName: 'Priya Patel',
      emergencyContactPhone: '+91-98765-43213',
      allergies: ['Latex'],
      chronicConditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
      currentMedications: ['Aspirin', 'Atorvastatin', 'Metoprolol'],
      createdAt: '2023-02-10',
      hasAccess: true,
      accessLevel: 'limited_access',
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
      gender: 'female',
      medicalRecordNumber: 'MRN003',
      bloodType: 'B+',
      emergencyContactName: 'Vikram Kumar',
      emergencyContactPhone: '+91-98765-43215',
      allergies: ['Dust', 'Pollen'],
      chronicConditions: ['Migraine', 'Anxiety'],
      currentMedications: ['Sumatriptan', 'Escitalopram'],
      createdAt: '2023-03-05',
      hasAccess: true,
      accessLevel: 'emergency_access',
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
      gender: 'male',
      medicalRecordNumber: 'MRN004',
      bloodType: 'AB+',
      emergencyContactName: 'Kavya Singh',
      emergencyContactPhone: '+91-98765-43217',
      allergies: ['Sulfa drugs'],
      chronicConditions: ['Prostate Cancer', 'Hypertension'],
      currentMedications: ['Bicalutamide', 'Lisinopril', 'Tamsulosin'],
      createdAt: '2023-04-20',
      hasAccess: true,
      accessLevel: 'full_access',
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
      gender: 'female',
      medicalRecordNumber: 'MRN005',
      bloodType: 'O-',
      emergencyContactName: 'Suresh Reddy',
      emergencyContactPhone: '+91-98765-43219',
      allergies: ['Ibuprofen'],
      chronicConditions: ['Rheumatoid Arthritis', 'Osteoporosis'],
      currentMedications: ['Methotrexate', 'Calcium Carbonate', 'Vitamin D3'],
      createdAt: '2023-05-15',
      hasAccess: false,
      accessLevel: 'pending',
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
      gender: 'male',
      medicalRecordNumber: 'MRN006',
      bloodType: 'A-',
      emergencyContactName: 'Priya Malhotra',
      emergencyContactPhone: '+91-98765-43221',
      allergies: ['Peanuts', 'Tree nuts'],
      chronicConditions: ['Asthma', 'GERD'],
      currentMedications: ['Albuterol', 'Omeprazole', 'Montelukast'],
      createdAt: '2023-06-10',
      hasAccess: true,
      accessLevel: 'limited_access',
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
      gender: 'female',
      medicalRecordNumber: 'MRN007',
      bloodType: 'B-',
      emergencyContactName: 'Rahul Iyer',
      emergencyContactPhone: '+91-98765-43223',
      allergies: ['Latex', 'Adhesive tape'],
      chronicConditions: ['Eczema', 'Seasonal allergies'],
      currentMedications: ['Cetirizine', 'Hydrocortisone cream', 'Emollient cream'],
      createdAt: '2023-07-05',
      hasAccess: false,
      accessLevel: 'denied',
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
      gender: 'male',
      medicalRecordNumber: 'MRN008',
      bloodType: 'O+',
      emergencyContactName: 'Sunita Gupta',
      emergencyContactPhone: '+91-98765-43225',
      allergies: ['Codeine'],
      chronicConditions: ['Chronic Kidney Disease', 'Hypertension'],
      currentMedications: ['Amlodipine', 'Furosemide', 'Calcitriol'],
      createdAt: '2023-08-12',
      hasAccess: true,
      accessLevel: 'full_access',
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
      gender: 'female',
      medicalRecordNumber: 'MRN009',
      bloodType: 'A+',
      emergencyContactName: 'Amit Verma',
      emergencyContactPhone: '+91-98765-43227',
      allergies: ['Sulfa drugs', 'Aspirin'],
      chronicConditions: ['Multiple Sclerosis', 'Depression'],
      currentMedications: ['Interferon beta-1a', 'Sertraline', 'Baclofen'],
      createdAt: '2023-09-20',
      hasAccess: false,
      accessLevel: 'pending',
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
      gender: 'male',
      medicalRecordNumber: 'MRN010',
      bloodType: 'AB+',
      emergencyContactName: 'Neha Kumar',
      emergencyContactPhone: '+91-98765-43229',
      allergies: ['Shellfish', 'Eggs'],
      chronicConditions: ['Ulcerative Colitis', 'Iron Deficiency Anemia'],
      currentMedications: ['Mesalamine', 'Iron Sulfate', 'Folic Acid'],
      createdAt: '2023-10-15',
      hasAccess: true,
      accessLevel: 'limited_access',
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

  // Load all patients on component mount
  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  // Fetch patients on search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      fetchPatients();
    } else if (searchQuery.length === 0) {
      // Show all patients when search is cleared
      setPatients(mockPatients);
    }
  }, [searchQuery]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const filteredPatients = mockPatients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPatients(filteredPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPatient: Patient = {
        id: Date.now().toString(),
        email: createForm.email,
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        phone: createForm.phone,
        dateOfBirth: createForm.dateOfBirth,
        gender: createForm.gender || undefined,
        emergencyContactName: createForm.emergencyContactName,
        emergencyContactPhone: createForm.emergencyContactPhone,
        bloodType: createForm.bloodType,
        allergies: createForm.allergies.filter(a => a.trim()),
        chronicConditions: createForm.chronicConditions.filter(c => c.trim()),
        currentMedications: createForm.currentMedications.filter(m => m.trim())
      };

      setSuccess(`Patient created successfully! Patient ID: ${newPatient.id}`);
      setShowCreateForm(false);
      setCreateForm({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        bloodType: '',
        allergies: [],
        chronicConditions: [],
        currentMedications: []
      });
    } catch (error) {
      setError('Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  const updateCreateForm = (field: keyof typeof createForm, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayField = (field: 'allergies' | 'chronicConditions' | 'currentMedications') => {
    setCreateForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayField = (field: 'allergies' | 'chronicConditions' | 'currentMedications', index: number, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field: 'allergies' | 'chronicConditions' | 'currentMedications', index: number) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: UserIcon },
    { id: 'medical', name: 'Medical History', icon: ClipboardDocumentListIcon },
    { id: 'vitals', name: 'Vital Signs', icon: HeartIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <UserGroupIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Patient Management
          </h1>
          <p className="text-lg text-gray-600">
            Create new patients and update existing patient records efficiently
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Create Patient Button */}
        <div className="flex justify-center">
          <button 
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700"
          >
            <PlusIcon className="h-6 w-6" />
            <span>Create New Patient</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
                title="Close error message"
                aria-label="Close error message"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-400 hover:text-green-600 transition-colors"
                title="Close success message"
                aria-label="Close success message"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Create Patient Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900">Create New Patient</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  title="Close modal"
                  aria-label="Close create patient modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreatePatient} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                      <span>Basic Information</span>
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="create-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      id="create-email"
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={createForm.email}
                      onChange={(e) => updateCreateForm('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="create-firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      id="create-firstName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={createForm.firstName}
                      onChange={(e) => updateCreateForm('firstName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="create-lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      id="create-lastName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={createForm.lastName}
                      onChange={(e) => updateCreateForm('lastName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="create-phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      id="create-phone"
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={createForm.phone}
                      onChange={(e) => updateCreateForm('phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="create-dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      id="create-dateOfBirth"
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={createForm.dateOfBirth}
                      onChange={(e) => updateCreateForm('dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="create-gender" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select 
                      id="create-gender"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={createForm.gender}
                      onChange={(e) => updateCreateForm('gender', e.target.value as 'male' | 'female' | 'other' | 'prefer_not_to_say')}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="create-bloodType" className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                    <select 
                      id="create-bloodType"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={createForm.bloodType}
                      onChange={(e) => updateCreateForm('bloodType', e.target.value)}
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  {/* Emergency Contact */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6 flex items-center space-x-2">
                      <ShieldCheckIcon className="h-5 w-5 text-red-600" />
                      <span>Emergency Contact</span>
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="create-emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                    <input
                      id="create-emergencyContact"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={createForm.emergencyContactName}
                      onChange={(e) => updateCreateForm('emergencyContactName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="create-emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                    <input
                      id="create-emergencyContactPhone"
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={createForm.emergencyContactPhone}
                      onChange={(e) => updateCreateForm('emergencyContactPhone', e.target.value)}
                    />
                  </div>

                  {/* Medical Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6 flex items-center space-x-2">
                      <ClipboardDocumentListIcon className="h-5 w-5 text-green-600" />
                      <span>Medical Information</span>
                    </h3>
                  </div>

                  {/* Allergies */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                    <div className="space-y-2">
                      {createForm.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={allergy}
                            onChange={(e) => updateArrayField('allergies', index, e.target.value)}
                            placeholder="Enter allergy"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayField('allergies', index)}
                            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            title="Remove allergy"
                            aria-label="Remove allergy"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayField('allergies')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Allergy</span>
                      </button>
                    </div>
                  </div>

                  {/* Chronic Conditions */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                    <div className="space-y-2">
                      {createForm.chronicConditions.map((condition, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={condition}
                            onChange={(e) => updateArrayField('chronicConditions', index, e.target.value)}
                            placeholder="Enter chronic condition"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayField('chronicConditions', index)}
                            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            title="Remove chronic condition"
                            aria-label="Remove chronic condition"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayField('chronicConditions')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Condition</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                    <div className="space-y-2">
                      {createForm.currentMedications.map((medication, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={medication}
                            onChange={(e) => updateArrayField('currentMedications', index, e.target.value)}
                            placeholder="Enter medication"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayField('currentMedications', index)}
                            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            title="Remove medication"
                            aria-label="Remove medication"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayField('currentMedications')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Medication</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Patient Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Total Patients</p>
                  <p className="text-2xl font-bold">{patients.length}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Access Granted</p>
                  <p className="text-2xl font-bold">{patients.filter(p => p.hasAccess).length}</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Pending Access</p>
                  <p className="text-2xl font-bold">{patients.filter(p => p.accessLevel === 'pending').length}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-yellow-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1">Access Denied</p>
                  <p className="text-2xl font-bold">{patients.filter(p => p.accessLevel === 'denied').length}</p>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-red-200" />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <MagnifyingGlassIcon className="h-5 w-5 text-blue-600" />
            <span>Find Patient</span>
          </h3>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email (minimum 2 characters)..."
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Patient List */}
          {loading && searchQuery && (
            <div className="mt-4 text-center text-gray-500 flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Searching patients...</span>
            </div>
          )}

          {patients.length > 0 && (
            <div className="mt-4 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedPatient?.id === patient.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : patient.hasAccess 
                          ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          : 'border-gray-300 bg-gray-50 opacity-75'
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </h4>
                          {patient.hasAccess ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Access Granted
                            </span>
                          ) : patient.accessLevel === 'pending' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                              Access Denied
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          {patient.email} • {patient.phone || 'No phone'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          {patient.medicalRecordNumber && (
                            <span>MRN: {patient.medicalRecordNumber}</span>
                          )}
                          {patient.dateOfBirth && (
                            <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                          )}
                          {patient.gender && (
                            <span>Gender: {patient.gender}</span>
                          )}
                        </div>
                        {patient.riskAssessment && (
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Risk Level:</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              patient.riskAssessment.overallRisk === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : patient.riskAssessment.overallRisk === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {patient.riskAssessment.overallRisk} ({patient.riskAssessment.riskScore})
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm text-gray-500 mb-1">
                          {patient.address?.city}, {patient.address?.state}
                        </div>
                        <div className="text-xs text-gray-400">
                          Created: {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && patients.length === 0 && !loading && (
            <div className="mt-4 text-center text-gray-500 py-8">
              <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No patients found matching your search.</p>
            </div>
          )}
        </div>

        {/* Patient Editor */}
        {selectedPatient && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <span>Patient: {selectedPatient.firstName} {selectedPatient.lastName}</span>
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">MRN: {selectedPatient.medicalRecordNumber}</span>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2">
                  <PencilSquareIcon className="h-5 w-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 inline mr-2" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue={selectedPatient.firstName}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue={selectedPatient.lastName}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue={selectedPatient.email}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue={selectedPatient.phone || ''}
                  />
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue={selectedPatient.dateOfBirth || ''}
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select 
                    id="gender"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    defaultValue={selectedPatient.gender || ''}
                    aria-label="Select gender"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                  <input
                    id="bloodType"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue={selectedPatient.bloodType || ''}
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  <input
                    id="emergencyContact"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue={selectedPatient.emergencyContactName || ''}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                  <input
                    id="emergencyContactPhone"
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    defaultValue={selectedPatient.emergencyContactPhone || ''}
                  />
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    <span>Allergies</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                      selectedPatient.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                          <p className="text-sm font-medium text-gray-900">{allergy}</p>
                          <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Edit</button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-xl">No allergies recorded</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />
                    <span>Chronic Conditions</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedPatient.chronicConditions && selectedPatient.chronicConditions.length > 0 ? (
                      selectedPatient.chronicConditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{condition}</p>
                          <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Edit</button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-xl">No chronic conditions recorded</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <HeartIcon className="h-5 w-5 text-blue-500" />
                    <span>Current Medications</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedPatient.currentMedications && selectedPatient.currentMedications.length > 0 ? (
                      selectedPatient.currentMedications.map((medication, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <p className="text-sm font-medium text-gray-900">{medication}</p>
                          <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Edit</button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-xl">No current medications recorded</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vitals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="systolic" className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure (Systolic)</label>
                  <input
                    id="systolic"
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="120"
                  />
                </div>
                <div>
                  <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure (Diastolic)</label>
                  <input
                    id="diastolic"
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="80"
                  />
                </div>
                <div>
                  <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
                  <input
                    id="heartRate"
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">Temperature (°F)</label>
                  <input
                    id="temperature"
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="98.6"
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                  <input
                    id="weight"
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">Height (inches)</label>
                  <input
                    id="height"
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="68"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    id="notes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows={3}
                    placeholder="Any additional notes about the vital signs..."
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientEditor;

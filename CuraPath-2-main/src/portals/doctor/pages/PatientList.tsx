import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

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

interface PatientAccess {
  patientId: string;
  hasAccess: boolean;
  accessLevel: string;
  lastAccessGranted?: string;
}

const PatientList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientAccess, setPatientAccess] = useState<{ [key: string]: PatientAccess }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  // Mock patient data instead of backend call - 10 patients total
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

  // Mock access requests data - this represents what the current doctor has access to
  const mockAccessRequests = [
    {
      id: 'AR001',
      patientId: 'P001',
      patientName: 'Priya Sharma',
      requesterId: 'DR001',
      requesterName: 'Dr. Current Doctor',
      requesterRole: 'Cardiologist',
      requestType: 'full_access',
      purpose: 'Cardiac consultation and treatment planning',
      requestedData: ['Medical History', 'Lab Results', 'Prescriptions', 'Vital Signs'],
      status: 'approved',
      requestDate: '2024-01-20',
      responseDate: '2024-01-22',
      expiryDate: '2024-07-22',
      notes: 'Approved for cardiac evaluation and ongoing care'
    },
    {
      id: 'AR002',
      patientId: 'P002',
      patientName: 'Raj Patel',
      requesterId: 'DR001',
      requesterName: 'Dr. Current Doctor',
      requesterRole: 'Cardiologist',
      requestType: 'limited_access',
      purpose: 'Diabetes management consultation',
      requestedData: ['Lab Results', 'Current Medications', 'Chronic Conditions'],
      status: 'approved',
      requestDate: '2024-01-18',
      responseDate: '2024-01-20',
      expiryDate: '2024-07-20',
      notes: 'Approved for diabetes care coordination'
    },
    {
      id: 'AR003',
      patientId: 'P003',
      patientName: 'Ananya Kumar',
      requesterId: 'DR001',
      requesterName: 'Dr. Current Doctor',
      requesterRole: 'Cardiologist',
      requestType: 'emergency_access',
      purpose: 'Emergency migraine treatment',
      requestedData: ['Medical History', 'Current Medications', 'Allergies'],
      status: 'approved',
      requestDate: '2024-01-23',
      responseDate: '2024-01-23',
      expiryDate: '2024-01-30',
      notes: 'Emergency access granted for immediate treatment'
    },
    {
      id: 'AR004',
      patientId: 'P004',
      patientName: 'Arjun Singh',
      requesterId: 'DR001',
      requesterName: 'Dr. Current Doctor',
      requesterRole: 'Cardiologist',
      requestType: 'full_access',
      purpose: 'Cancer treatment and monitoring',
      requestedData: ['Medical History', 'Lab Results', 'Imaging', 'Current Medications'],
      status: 'approved',
      requestDate: '2024-01-19',
      responseDate: '2024-01-21',
      expiryDate: '2024-07-21',
      notes: 'Approved for comprehensive cancer care'
    },
    {
      id: 'AR006',
      patientId: 'P006',
      patientName: 'Vikram Malhotra',
      requesterId: 'DR001',
      requesterName: 'Dr. Current Doctor',
      requesterRole: 'Cardiologist',
      requestType: 'limited_access',
      purpose: 'Asthma and respiratory care',
      requestedData: ['Vital Signs', 'Chronic Conditions', 'Current Medications'],
      status: 'approved',
      requestDate: '2024-01-22',
      responseDate: '2024-01-24',
      expiryDate: '2024-07-24',
      notes: 'Approved for respiratory care management'
    },
    {
      id: 'AR008',
      patientId: 'P008',
      patientName: 'Rahul Gupta',
      requesterId: 'DR001',
      requesterName: 'Dr. Current Doctor',
      requesterRole: 'Cardiologist',
      requestType: 'full_access',
      purpose: 'Kidney disease management',
      requestedData: ['Medical History', 'Lab Results', 'Vital Signs', 'Current Medications'],
      status: 'approved',
      requestDate: '2024-01-21',
      responseDate: '2024-01-23',
      expiryDate: '2024-07-23',
      notes: 'Approved for comprehensive nephrology care'
    },
    {
      id: 'AR010',
      patientId: 'P010',
      patientName: 'Amit Kumar',
      requesterId: 'DR001',
      requesterName: 'Dr. Current Doctor',
      requesterRole: 'Cardiologist',
      requestType: 'limited_access',
      purpose: 'Inflammatory bowel disease management',
      requestedData: ['Lab Results', 'Chronic Conditions', 'Current Medications'],
      status: 'approved',
      requestDate: '2024-01-20',
      responseDate: '2024-01-22',
      expiryDate: '2024-07-22',
      notes: 'Approved for gastroenterology care'
    }
  ];

  // Filter patients to only show those the doctor has access to
  const accessiblePatients = mockPatients.filter(patient => {
    const accessRequest = mockAccessRequests.find(ar => ar.patientId === patient.id);
    return accessRequest && accessRequest.status === 'approved';
  });

  // Fetch patients - now showing all 10 patients with access information
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show all 10 patients, but mark which ones are accessible
      const allPatientsWithAccess = mockPatients.map(patient => {
        const accessRequest = mockAccessRequests.find(ar => ar.patientId === patient.id);
        return {
          ...patient,
          hasAccess: accessRequest && accessRequest.status === 'approved',
          accessLevel: accessRequest ? accessRequest.requestType : 'none',
          accessRequest: accessRequest
        };
      });
      
      // Use all patients with access information
      setPatients(allPatientsWithAccess);
      
      // Check access for each patient
      await checkAllPatientAccess(allPatientsWithAccess);
      
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // Check access for all patients
  const checkAllPatientAccess = async (patientList: Patient[]) => {
    const accessMap: { [key: string]: PatientAccess } = {};
    
    for (const patient of patientList) {
      try {
        // Simulate API call for access check
        await new Promise(resolve => setTimeout(resolve, 300));

        // Find the access request for this patient
        const accessRequest = mockAccessRequests.find(ar => ar.patientId === patient.id);
        
        if (accessRequest && accessRequest.status === 'approved') {
          // Set access level based on request type
          let accessLevel = 'limited';
          if (accessRequest.requestType === 'full_access') {
            accessLevel = 'full';
          } else if (accessRequest.requestType === 'emergency_access') {
            accessLevel = 'emergency';
          }
          
          accessMap[patient.id] = {
            patientId: patient.id,
            hasAccess: true,
            accessLevel: accessLevel,
            lastAccessGranted: accessRequest.responseDate
          };
        } else {
          accessMap[patient.id] = {
            patientId: patient.id,
            hasAccess: false,
            accessLevel: 'none'
          };
        }
      } catch (error) {
        accessMap[patient.id] = {
          patientId: patient.id,
          hasAccess: false,
          accessLevel: 'none'
        };
      }
    }
    
    setPatientAccess(accessMap);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

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

  // Use actual risk assessment data instead of hardcoded logic
  const getPatientStatus = (patient: any): string => {
    if (!patient.riskAssessment) return 'unknown';
    
    const overallRisk = patient.riskAssessment.overallRisk.toLowerCase();
    
    if (overallRisk === 'low') return 'stable';
    if (overallRisk === 'medium') return 'monitoring';
    if (overallRisk === 'high' || overallRisk === 'very high' || overallRisk === 'critical') return 'highrisk';
    
    return 'unknown';
  };

  // Use actual risk assessment data instead of hardcoded logic
  const getPatientRisk = (patient: any): string => {
    if (!patient.riskAssessment) return 'unknown';
    
    const overallRisk = patient.riskAssessment.overallRisk.toLowerCase();
    
    if (overallRisk === 'low') return 'low';
    if (overallRisk === 'medium') return 'medium';
    if (overallRisk === 'high') return 'high';
    if (overallRisk === 'very high' || overallRisk === 'critical') return 'critical';
    
    return 'unknown';
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 text-white border border-red-700';
      case 'high': return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'highrisk': return 'bg-red-100 text-red-800 border border-red-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'stable': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const togglePatientExpansion = (patientId: string) => {
    setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
  };

  // SIMPLE FILTERING - THIS WILL WORK
  const getFilteredPatients = () => {
    console.log('🔍 getFilteredPatients called with filterStatus:', filterStatus);
    console.log('🔍 Total patients:', patients.length);
    
    let result = patients;
    
    // Apply status filter
    if (filterStatus === 'accessible') {
      console.log('🔍 Applying accessible filter');
      result = result.filter(patient => patient.hasAccess === true);
      console.log('🔍 After accessible filter:', result.length, 'patients');
    } else if (filterStatus !== 'all') {
      console.log('🔍 Applying status filter for:', filterStatus);
      result = result.filter(patient => {
        const status = getPatientStatus(patient);
        const matches = status === filterStatus;
        console.log(`🔍 Patient ${patient.firstName} ${patient.lastName} (${patient.id}): Status=${status}, Filter=${filterStatus}, Match=${matches}`);
        return matches;
      });
      console.log('🔍 After status filter:', result.length, 'patients');
    } else {
      console.log('🔍 No status filter applied (showing all)');
    }
    
    // Apply search filter
    if (searchQuery) {
      console.log('🔍 Applying search filter for:', searchQuery);
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(patient => {
        const matches = (
          patient.firstName?.toLowerCase().includes(searchLower) ||
          patient.lastName?.toLowerCase().includes(searchLower) ||
          patient.email?.toLowerCase().includes(searchLower) ||
          patient.medicalRecordNumber?.toLowerCase().includes(searchLower)
        );
        console.log(`🔍 Patient ${patient.firstName} ${patient.lastName}: Search match=${matches}`);
        return matches;
      });
      console.log('🔍 After search filter:', result.length, 'patients');
    }
    
    console.log('🔍 Final filtered result:', result.length, 'patients');
    return result;
  };

  const filteredPatients = getFilteredPatients();

  // Debug effect to see when filterStatus changes
  useEffect(() => {
    console.log('🔍 filterStatus changed to:', filterStatus);
    console.log('🔍 Current filteredPatients count:', filteredPatients.length);
  }, [filterStatus, filteredPatients.length]);

  // Get counts for display
  const getStatusCounts = () => {
    const counts = { stable: 0, monitoring: 0, highrisk: 0 };
    patients.forEach(patient => {
      const status = getPatientStatus(patient);
      counts[status as keyof typeof counts]++;
    });
    console.log('📊 Status counts calculated:', counts);
    return counts;
  };

  const getRiskCounts = () => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    patients.forEach(patient => {
      const risk = getPatientRisk(patient);
      counts[risk as keyof typeof counts]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const riskCounts = getRiskCounts();

  // Debug: Log when cards should update
  useEffect(() => {
    console.log('📊 Cards updated - Status counts:', statusCounts);
    console.log('📊 Cards updated - Filtered patients count:', filteredPatients.length);
    console.log('📊 Cards updated - Current filter:', filterStatus);
  }, [statusCounts, filteredPatients.length, filterStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <UsersIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Management
          </h1>
          <p className="text-lg text-gray-600">
            View and manage all patients with access control
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients by name, email, or MRN..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={filterStatus}
                  onChange={(e) => {
                    console.log('🔍 Filter changed from', filterStatus, 'to', e.target.value);
                    setFilterStatus(e.target.value);
                  }}
                  aria-label="Filter by patient status"
                >
                  <option value="all">All Status</option>
                  <option value="stable">Stable</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="highrisk">High Risk Status</option>
                </select>
              </div>
              
              <Button 
                variant="primary" 
                onClick={fetchPatients}
                className="rounded-xl"
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Click to Filter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div 
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              filterStatus === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => {
              console.log('🔍 Card clicked: All Status');
              setFilterStatus('all');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
                <p className="text-xs text-gray-500 mt-1">All patients</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              filterStatus === 'accessible' ? 'ring-2 ring-green-500 bg-green-50' : ''
            }`}
            onClick={() => {
              console.log('🔍 Card clicked: Accessible');
              setFilterStatus('accessible');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Accessible</p>
                <p className="text-3xl font-bold text-gray-900">{patients.filter(p => p.hasAccess).length}</p>
                <p className="text-xs text-gray-500 mt-1">With access</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              filterStatus === 'stable' ? 'ring-2 ring-green-500 bg-green-50' : ''
            }`}
            onClick={() => {
              console.log('🔍 Card clicked: Stable');
              setFilterStatus('stable');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Stable</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts.stable}</p>
                <p className="text-xs text-gray-500 mt-1">Total stable patients</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div 
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              filterStatus === 'monitoring' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
            }`}
            onClick={() => {
              console.log('🔍 Card clicked: Monitoring');
              setFilterStatus('monitoring');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Monitoring</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts.monitoring}</p>
                <p className="text-xs text-gray-500 mt-1">Total monitoring patients</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div 
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              filterStatus === 'highrisk' ? 'ring-2 ring-red-500 bg-red-50' : ''
            }`}
            onClick={() => {
              console.log('🔍 Card clicked: High Risk Status');
              setFilterStatus('highrisk');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">High Risk Status</p>
                <p className="text-3xl font-bold text-gray-900">{statusCounts.highrisk}</p>
                <p className="text-xs text-gray-500 mt-1">Total high risk patients</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600">
                <ShieldExclamationIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>



        {/* Access Control Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <ShieldExclamationIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Patient Data Access Control
              </h3>
              <p className="text-blue-700 mb-3">
                To protect patient privacy, detailed medical information is only available after access has been granted. 
                Patients without granted access will show limited information and require an access request.
              </p>
              <div className="flex items-center space-x-4 text-sm text-blue-600">
                <span className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  {patients.filter(p => p.hasAccess).length} patients with granted access
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {patients.filter(p => !p.hasAccess).length} patients requiring access request
                </span>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.open('/doctor/access-requests', '_blank')}
              className="rounded-xl"
            >
              <ShieldExclamationIcon className="h-4 w-4 mr-2" />
              Manage Access Requests
            </Button>
          </div>
        </div>

        {/* Patient Records Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Patient Records
                </h3>
                <p className="text-sm text-gray-600">Comprehensive patient information and status (limited by access permissions)</p>
              </div>
            </div>
            

            
            {/* Search Results Indicator */}
            {searchQuery && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-sm text-green-800">
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  <span>
                    Showing {filteredPatients.length} result{filteredPatients.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-auto text-green-600 hover:text-green-800 underline text-xs"
                  >
                    Clear search
                  </button>
                </div>
              </div>
            )}
            
            {/* Filter Status Indicator */}

          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-gray-500 text-lg">Loading patients...</div>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <Button variant="primary" onClick={fetchPatients}>
                Retry
              </Button>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-gray-500 text-lg">
                {searchQuery ? 'No patients found matching your search.' : 'No patients available.'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Age/Gender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Conditions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPatients.map((patient) => {
                    const riskLevel = getPatientRisk(patient);
                    const status = getPatientStatus(patient);
                    const hasAccess = patient.hasAccess === true;
                    
                    return (
                      <React.Fragment key={patient.id}>
                        <tr className={`transition-colors ${
                          hasAccess ? 'hover:bg-gray-50' : 'bg-gray-50 opacity-75'
                        }`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-md ${
                                  hasAccess 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                                    : 'bg-gray-400'
                                }`}>
                                  <span className={`text-sm font-bold ${
                                    hasAccess ? 'text-white' : 'text-gray-600'
                                  }`}>
                                    {patient.firstName?.[0]}{patient.lastName?.[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className={`text-sm font-semibold ${
                                  hasAccess ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {patient.firstName} {patient.lastName}
                                </div>
                                <div className={`text-sm ${
                                  hasAccess ? 'text-gray-600' : 'text-gray-400'
                                }`}>{patient.email}</div>
                                                                {patient.medicalRecordNumber && (
                                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                                    hasAccess 
                                      ? 'text-gray-500 bg-gray-100' 
                                      : 'text-gray-400 bg-gray-200'
                                  }`}>
                                    MRN: {patient.medicalRecordNumber}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasAccess ? (
                              <>
                                <div className="text-sm font-medium text-gray-900">{getAge(patient.dateOfBirth)}</div>
                                <div className="text-sm text-gray-500">{patient.gender || 'Not specified'}</div>
                              </>
                            ) : (
                              <div className="text-sm text-gray-400 italic">Access required</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {hasAccess ? (
                              patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                                <div className="space-y-1">
                                  {patient.chronicConditions.slice(0, 2).map((condition, index) => (
                                    <div key={index} className="text-sm bg-gray-100 px-2 py-1 rounded-lg inline-block mr-1">
                                      {condition}
                                    </div>
                                  ))}
                                  {patient.chronicConditions.length > 2 && (
                                    <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-lg inline-block">
                                      +{patient.chronicConditions.length - 2} more
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500 text-sm">No conditions</span>
                              )
                            ) : (
                              <span className="text-gray-400 italic text-sm">Access required</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasAccess ? (
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRiskBadgeColor(riskLevel)}`}>
                                {riskLevel}
                              </span>
                            ) : (
                              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-500 border border-gray-300">
                                Access Required
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {hasAccess ? (
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="rounded-xl"
                                onClick={() => togglePatientExpansion(patient.id)}
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                {expandedPatientId === patient.id ? 'Hide' : 'View'}
                              </Button>
                            ) : (
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="rounded-xl"
                                onClick={() => window.open('/doctor/access-requests', '_blank')}
                              >
                                <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                                Request Access
                              </Button>
                            )}
                          </td>
                        </tr>
                        
                        {/* Expanded Patient Details Row */}
                        {expandedPatientId === patient.id && patientAccess[patient.id]?.hasAccess && (
                          <tr className="bg-blue-50">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Personal Information */}
                                <div className="bg-white p-4 rounded-lg border border-blue-200">
                                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                    <UserIcon className="h-4 w-4 mr-2" />
                                    Personal Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Blood Type:</span> {patient.bloodType || 'Not specified'}</div>
                                    <div><span className="font-medium">Address:</span> {patient.address?.street}, {patient.address?.city}, {patient.address?.state} {patient.address?.zipCode}</div>
                                    <div><span className="font-medium">Email:</span> {patient.email}</div>
                                  </div>
                                </div>
                                
                                {/* Medical Information */}
                                <div className="bg-white p-4 rounded-lg border border-blue-200">
                                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                    <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                                    Medical Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Allergies:</span> {patient.allergies?.length ? patient.allergies.join(', ') : 'None'}</div>
                                    <div><span className="font-medium">Current Medications:</span> {patient.currentMedications?.length ? patient.currentMedications.join(', ') : 'None'}</div>
                                  </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-blue-200">
                                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                    <HeartIcon className="h-4 w-4 mr-2" />
                                    Latest Vitals
                                  </h4>
                                  {patient.vitals && patient.vitals.length > 0 ? (
                                    <div className="space-y-2 text-sm">
                                      <div><span className="font-medium">BP:</span> {patient.vitals[0].bloodPressure?.systolic}/{patient.vitals[0].bloodPressure?.diastolic} mmHg</div>
                                      <div><span className="font-medium">HR:</span> {patient.vitals[0].heartRate} bpm</div>
                                      <div><span className="font-medium">Temp:</span> {patient.vitals[0].temperature}°F</div>
                                      <div><span className="font-medium">Weight:</span> {patient.vitals[0].weight} kg</div>
                                      <div><span className="font-medium">Height:</span> {patient.vitals[0].height} cm</div>
                                      <div><span className="font-medium">BMI:</span> {patient.vitals[0].bmi}</div>
                                    </div>
                                  ) : (
                                    <div className="text-gray-500 text-sm">No vitals recorded</div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientList;
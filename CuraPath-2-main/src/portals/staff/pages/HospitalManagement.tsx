import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  UserIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  CalendarIcon,
  EnvelopeIcon,
  MapPinIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import ReactECharts from 'echarts-for-react';

interface Staff {
  id: string;
  name: string;
  role: 'doctor' | 'nurse' | 'admin';
  department: string;
  email: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  patientsAssigned: number;
  workload: number;
  specialization?: string;
  shift?: string;
}

interface Patient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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
  // Hospital management specific fields
  status?: 'admitted' | 'discharged' | 'stable' | 'critical' | 'monitoring';
  assignedDoctor?: string;
  assignedNurse?: string;
  admissionDate?: string;
  department?: string;
  roomNumber?: string;
  lastUpdated?: string;
  hasAccess?: boolean;
  accessLevel?: string;
}

interface Department {
  id: string;
  name: string;
  doctorCount: number;
  nurseCount: number;
  patientCount: number;
  capacity: number;
  utilization: number;
}

const HospitalManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterPatientStatus, setFilterPatientStatus] = useState('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState('all');
  const [filterAgeRange, setFilterAgeRange] = useState('all');
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockStaff: Staff[] = [
      {
        id: '1',
        name: 'Dr. Sanjana Sharma',
        role: 'doctor',
        department: 'Cardiology',
        email: 'sanjana.sharma@hospital.com',
        status: 'active',
        joinDate: '2020-03-15',
        patientsAssigned: 6,
        workload: 85,
        specialization: 'Interventional Cardiology'
      },
      {
        id: '2',
        name: 'Dr. Kumar',
        role: 'doctor',
        department: 'Neurology',
        email: 'kumar@hospital.com',
        status: 'active',
        joinDate: '2018-07-22',
        patientsAssigned: 4,
        workload: 70,
        specialization: 'Stroke Neurology'
      },
      {
        id: '3',
        name: 'Ms Sharma',
        role: 'nurse',
        department: 'Cardiology',
        email: 'sharma@hospital.com',

        status: 'active',
        joinDate: '2021-01-10',
        patientsAssigned: 3,
        workload: 90,
        shift: 'Day'
      },
      {
        id: '4',
        name: 'Ms Tejasvi',
        role: 'nurse',
        department: 'Neurology',
        email: 'tejasvi@hospital.com',

        status: 'active',
        joinDate: '2019-11-05',
        patientsAssigned: 3,
        workload: 75,
        shift: 'Night'
      },
      {
        id: '5',
        name: 'Ms chandana',
        role: 'nurse',
        department: 'Cardiology',
        email: 'chandana@hospital.com',

        status: 'on_leave',
        joinDate: '2020-09-12',
        patientsAssigned: 0,
        workload: 0,
        shift: 'Day'
      }
    ];

         const mockPatients: Patient[] = [
       {
         id: 'P001',
         email: 'priya.sharma@gmail.com',
         firstName: 'Priya',
         lastName: 'Sharma',
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
         },
         status: 'stable',
         assignedDoctor: 'Dr. Sanjana Sharma',
         assignedNurse: 'Ms Sharma',
         admissionDate: '2024-01-15',
         department: 'Cardiology',
         roomNumber: 'C-101',
         lastUpdated: '2024-01-20'
       },
       {
         id: 'P002',
         email: 'raj.patel@gmail.com',
         firstName: 'Raj',
         lastName: 'Patel',
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
         },
         status: 'monitoring',
         assignedDoctor: 'Dr. Sanjana Sharma',
         assignedNurse: 'Ms Sharma',
         admissionDate: '2024-01-18',
         department: 'Cardiology',
         roomNumber: 'C-102',
         lastUpdated: '2024-01-18'
       },
       {
         id: 'P003',
         email: 'ananya.kumar@gmail.com',
         firstName: 'Ananya',
         lastName: 'Kumar',
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
         },
         status: 'stable',
         assignedDoctor: 'Dr. Kumar',
         assignedNurse: 'Ms Tejasvi',
         admissionDate: '2024-01-22',
         department: 'Neurology',
         roomNumber: 'N-101',
         lastUpdated: '2024-01-22'
       },
       {
         id: 'P004',
         email: 'arjun.singh@gmail.com',
         firstName: 'Arjun',
         lastName: 'Singh',
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
         },
         status: 'critical',
         assignedDoctor: 'Dr. Kumar',
         assignedNurse: 'Ms Tejasvi',
         admissionDate: '2024-01-19',
         department: 'Neurology',
         roomNumber: 'N-102',
         lastUpdated: '2024-01-19'
       },
       {
         id: 'P005',
         email: 'meera.reddy@gmail.com',
         firstName: 'Meera',
         lastName: 'Reddy',
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
         },
         status: 'stable',
         assignedDoctor: 'Dr. Sanjana Sharma',
         assignedNurse: 'Ms chandana',
         admissionDate: '2024-01-21',
         department: 'Cardiology',
         roomNumber: 'C-103',
         lastUpdated: '2024-01-21'
       }
     ];

    const mockDepartments: Department[] = [
      {
        id: '1',
        name: 'Cardiology',
        doctorCount: 1,
        nurseCount: 2,
        patientCount: 2,
        capacity: 20,
        utilization: 10
      },
      {
        id: '2',
        name: 'Neurology',
        doctorCount: 1,
        nurseCount: 1,
        patientCount: 1,
        capacity: 15,
        utilization: 6.7
      }
    ];

    setStaff(mockStaff);
    setPatients(mockPatients);
    setDepartments(mockDepartments);
  }, []);

  const getStaffRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return <UserIcon className="h-5 w-5 text-blue-600" />;
      case 'nurse':
        return <HeartIcon className="h-5 w-5 text-green-600" />;
      case 'admin':
        return <UserGroupIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <UserIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPatientStatusColor = (status: string) => {
    switch (status) {
      case 'admitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'discharged':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'stable':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get patient status based on risk assessment (matching PatientList logic)
  const getPatientStatus = (patient: Patient): string => {
    if (!patient.riskAssessment) return 'unknown';
    
    const overallRisk = patient.riskAssessment.overallRisk.toLowerCase();
    
    if (overallRisk === 'low') return 'stable';
    if (overallRisk === 'medium') return 'monitoring';
    if (overallRisk === 'high' || overallRisk === 'very high' || overallRisk === 'critical') return 'highrisk';
    
    return 'unknown';
  };

  // Get patient risk level based on risk assessment (matching PatientList logic)
  const getPatientRisk = (patient: Patient): string => {
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

  const togglePatientExpansion = (patientId: string) => {
    setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return 'text-red-600';
    if (workload >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesRole;
  });

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (patient.medicalRecordNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || patient.department === filterDepartment;
    const matchesStatus = filterPatientStatus === 'all' || patient.status === filterPatientStatus;
    
    // Risk level filtering
    const patientRisk = getPatientRisk(patient);
    const matchesRisk = filterRiskLevel === 'all' || patientRisk === filterRiskLevel;
    
    // Age range filtering
    const patientAge = getAge(patient.dateOfBirth);
    const matchesAge = filterAgeRange === 'all' || (() => {
      if (patientAge === 'N/A') return false;
      const age = parseInt(patientAge.toString());
      switch (filterAgeRange) {
        case '0-18': return age >= 0 && age <= 18;
        case '19-30': return age >= 19 && age <= 30;
        case '31-50': return age >= 31 && age <= 50;
        case '51-65': return age >= 51 && age <= 65;
        case '65+': return age >= 65;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesRisk && matchesAge;
  });

  // ECharts configuration for staff distribution
  const getStaffDistributionOption = () => ({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E7EB',
      borderWidth: 2,
      textStyle: { color: '#1F2937' },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { 
        color: '#374151',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    series: [{
      name: 'Staff Distribution',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      data: [
        { 
          value: staff.filter(s => s.role === 'doctor').length, 
          name: 'Doctors',
          itemStyle: { 
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: '#3B82F6' },
                { offset: 1, color: '#1D4ED8' }
              ]
            }
          }
        },
        { 
          value: staff.filter(s => s.role === 'nurse').length, 
          name: 'Nurses',
          itemStyle: { 
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: '#10B981' },
                { offset: 1, color: '#059669' }
              ]
            }
          }
        },
        { 
          value: staff.filter(s => s.role === 'admin').length, 
          name: 'Admin',
          itemStyle: { 
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: '#8B5CF6' },
                { offset: 1, color: '#7C3AED' }
              ]
            }
          }
        }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0,0,0,0.5)'
        }
      }
    }]
  });

  // ECharts configuration for department utilization
  const getDepartmentUtilizationOption = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E5E7EB',
      borderWidth: 2,
      textStyle: { color: '#1F2937' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: departments.map(d => d.name),
      axisLabel: { color: '#6B7280', fontSize: 12, rotate: 45 }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: { color: '#6B7280', fontSize: 12 }
    },
    series: [{
      name: 'Utilization %',
      type: 'bar',
      data: departments.map(d => ({
        value: d.utilization,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: d.utilization > 80 ? '#EF4444' : d.utilization > 60 ? '#F59E0B' : '#10B981' },
              { offset: 1, color: d.utilization > 80 ? '#DC2626' : d.utilization > 60 ? '#D97706' : '#059669' }
            ]
          }
        }
      })),
      barWidth: '60%'
    }]
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <UserGroupIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Management</h1>
        <p className="text-gray-600 mb-4">Comprehensive staff and patient management system</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{staff.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
              <UserGroupIcon className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
            <span className="text-blue-600 font-medium">{staff.filter(s => s.role === 'doctor').length}</span> Doctors • 
            <span className="text-green-600 font-medium ml-1">{staff.filter(s => s.role === 'nurse').length}</span> Nurses
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-gray-500">Click to view staff details</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-green-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1 group-hover:text-green-600 transition-colors">Active Patients</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">{patients.filter(p => p.status !== 'discharged').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
              <HeartIcon className="h-6 w-6 text-green-600 group-hover:text-green-700" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
            <span className="text-blue-600 font-medium">{patients.filter(p => p.status === 'admitted').length}</span> Admitted • 
            <span className="text-yellow-600 font-medium ml-1">{patients.filter(p => p.status === 'monitoring').length}</span> Monitoring
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-gray-500">Click to view patient details</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-purple-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1 group-hover:text-purple-600 transition-colors">Departments</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{departments.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
              <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600 group-hover:text-purple-700" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
            Avg Utilization: <span className="text-purple-600 font-medium">
              {Math.round(departments.reduce((acc, d) => acc + d.utilization, 0) / departments.length)}%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-gray-500">Click to view department details</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-orange-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1 group-hover:text-orange-600 transition-colors">Staff Ratio</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">1:3:1</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-300">
              <ChartBarIcon className="h-6 w-6 text-orange-600 group-hover:text-orange-700" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
            <span className="text-blue-600 font-medium">1</span> Doctor : 
            <span className="text-green-600 font-medium ml-1">3</span> Nurses : 
            <span className="text-purple-600 font-medium ml-1">1</span> Patient
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-gray-500">Click to view ratio details</p>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
            <FunnelIcon className="h-5 w-5 text-blue-600 mr-2" />
            Advanced Search & Filtering
          </h3>
          <p className="text-sm text-gray-600">Use multiple filters to find specific staff or patients</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Staff/Patients
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Search by name, department, or MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Staff Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Staff Role
            </label>
            <select
              id="role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctors</option>
              <option value="nurse">Nurses</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex-1">
            <label htmlFor="patientStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Patient Status
            </label>
            <select
              id="patientStatus"
              value={filterPatientStatus}
              onChange={(e) => setFilterPatientStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Patient Status</option>
              <option value="admitted">Admitted</option>
              <option value="monitoring">Monitoring</option>
              <option value="stable">Stable</option>
              <option value="critical">Critical</option>
              <option value="discharged">Discharged</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Risk Level
            </label>
            <select
              id="riskLevel"
              value={filterRiskLevel}
              onChange={(e) => setFilterRiskLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-2">
              Age Range
            </label>
            <select
              id="ageRange"
              value={filterAgeRange}
              onChange={(e) => setFilterAgeRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Ages</option>
              <option value="0-18">0-18 years</option>
              <option value="19-30">19-30 years</option>
              <option value="31-50">31-50 years</option>
              <option value="51-65">51-65 years</option>
              <option value="65+">65+ years</option>
            </select>
          </div>
        </div>
        
        {/* Filter Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active Filters:</span>
              {filterDepartment !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Dept: {filterDepartment}
                  <button
                    onClick={() => setFilterDepartment('all')}
                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {filterStatus}
                  <button
                    onClick={() => setFilterStatus('all')}
                    className="ml-1.5 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterRole !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Role: {filterRole}
                  <button
                    onClick={() => setFilterRole('all')}
                    className="ml-1.5 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterPatientStatus !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Patient: {filterPatientStatus}
                  <button
                    onClick={() => setFilterPatientStatus('all')}
                    className="ml-1.5 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterRiskLevel !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Risk: {filterRiskLevel}
                  <button
                    onClick={() => setFilterRiskLevel('all')}
                    className="ml-1.5 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterAgeRange !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Age: {filterAgeRange}
                  <button
                    onClick={() => setFilterAgeRange('all')}
                    className="ml-1.5 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            
            {(filterDepartment !== 'all' || filterStatus !== 'all' || filterRole !== 'all' || 
              filterPatientStatus !== 'all' || filterRiskLevel !== 'all' || filterAgeRange !== 'all') && (
              <button
                onClick={() => {
                  setFilterDepartment('all');
                  setFilterStatus('all');
                  setFilterRole('all');
                  setFilterPatientStatus('all');
                  setFilterRiskLevel('all');
                  setFilterAgeRange('all');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear All Filters
              </button>
            )}
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            Showing <span className="font-medium">{filteredStaff.length}</span> staff members and{' '}
            <span className="font-medium">{filteredPatients.length}</span> patients
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Staff Distribution</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ReactECharts 
                option={getStaffDistributionOption()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Department Utilization</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ReactECharts 
                option={getDepartmentUtilizationOption()} 
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Staff Management Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Staff Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage doctors, nurses, and administrative staff</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <div key={member.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStaffRoleIcon(member.role)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                    {member.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span>{member.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span>{member.email}</span>
                  </div>
                  
                  {member.specialization && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ClipboardDocumentListIcon className="h-4 w-4 text-gray-400" />
                      <span>{member.specialization}</span>
                    </div>
                  )}
                  {member.shift && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span>{member.shift} Shift</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Patients Assigned:</span>
                    <span className="font-medium text-gray-900">{member.patientsAssigned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Workload:</span>
                    <span className={`font-medium ${getWorkloadColor(member.workload)}`}>
                      {member.workload}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Join Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedStaff(member)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {member.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Management Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Patient Management</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor patient status and assignments</p>
        </div>
        <div className="p-6">
          {filteredPatients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-gray-500 text-lg">No patients found matching your criteria.</div>
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
                    
                    return (
                      <React.Fragment key={patient.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                                  <span className="text-sm font-bold text-white">
                                    {patient.firstName?.[0]}{patient.lastName?.[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  {patient.firstName} {patient.lastName}
                                </div>
                                <div className="text-sm text-gray-600">{patient.email}</div>
                                {patient.medicalRecordNumber && (
                                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">
                                    MRN: {patient.medicalRecordNumber}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{getAge(patient.dateOfBirth)}</div>
                            <div className="text-sm text-gray-500">{patient.gender || 'Not specified'}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
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
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRiskBadgeColor(riskLevel)}`}>
                              {riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => togglePatientExpansion(patient.id)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                {expandedPatientId === patient.id ? 'Hide' : 'View'}
                              </button>
                              <button
                                onClick={() => setSelectedPatient(patient)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded Patient Details Row */}
                        {expandedPatientId === patient.id && (
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
                                
                                {/* Latest Vitals */}
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

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Staff Details</h2>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Close staff details"
                  title="Close staff details"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedStaff.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium capitalize">{selectedStaff.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{selectedStaff.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">{selectedStaff.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedStaff.email}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Join Date:</span>
                      <span className="font-medium">{new Date(selectedStaff.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedStaff.specialization && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Specialization</h3>
                  <p className="text-sm text-gray-600">{selectedStaff.specialization}</p>
                </div>
              )}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Patients Assigned</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedStaff.patientsAssigned}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Workload</p>
                  <p className={`text-2xl font-bold ${getWorkloadColor(selectedStaff.workload)}`}>
                    {selectedStaff.workload}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Patient Details</h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Close patient details"
                  title="Close patient details"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedPatient.firstName} {selectedPatient.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{selectedPatient.dateOfBirth ? `${new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} years` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{selectedPatient.gender || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MRN:</span>
                      <span className="font-medium">{selectedPatient.medicalRecordNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hospital Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">{selectedPatient.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{selectedPatient.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-medium">{selectedPatient.roomNumber}</span>
                    </div>
                                         <div className="flex justify-between">
                       <span className="text-gray-600">Admission:</span>
                       <span className="font-medium">{selectedPatient.admissionDate ? new Date(selectedPatient.admissionDate).toLocaleDateString() : 'N/A'}</span>
                     </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Care Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Assigned Doctor</p>
                    <p className="text-lg font-semibold text-blue-900">{selectedPatient.assignedDoctor || 'N/A'}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Assigned Nurse</p>
                    <p className="text-lg font-semibold text-green-900">{selectedPatient.assignedNurse || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Additional Patient Information */}
              {selectedPatient.bloodType && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Medical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Blood Type</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedPatient.bloodType}</p>
                    </div>
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium">Allergies</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedPatient.allergies.map((allergy, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedPatient.currentMedications && selectedPatient.currentMedications.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Current Medications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.currentMedications.map((medication, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {medication}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPatient.riskAssessment && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">Overall Risk</p>
                      <p className="text-lg font-semibold text-red-900">{selectedPatient.riskAssessment.overallRisk}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Risk Score</p>
                      <p className="text-lg font-semibold text-orange-900">{selectedPatient.riskAssessment.riskScore}</p>
                    </div>
                  </div>
                  {selectedPatient.riskAssessment.recommendations && selectedPatient.riskAssessment.recommendations.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 font-medium mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {selectedPatient.riskAssessment.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {selectedPatient.chronicConditions && selectedPatient.chronicConditions.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Chronic Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.chronicConditions.map((condition, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalManagement;
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ExclamationTriangleIcon,
  HeartIcon,
  UserIcon, 
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';
import ReactECharts from 'echarts-for-react';

interface RiskAssessment {
  overallRisk: string;
  riskScore: number;
  lastAssessed: string;
  recommendations: string[];
  [key: string]: string | number | string[];
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  medicalRecordNumber: string;
  chronicConditions: string[];
  riskAssessment?: RiskAssessment;
  hasAccess?: boolean;
  accessLevel?: string;
  accessRequest?: {
    id: string;
    patientId: string;
    patientName: string;
    status: string;
    requestDate: string;
    responseDate?: string;
    purpose: string;
  };
}

interface AccessRequest {
  id: string;
  patientId: string;
  patientName: string;
  status: string;
  requestDate: string;
  responseDate?: string;
  purpose: string;
}

const RiskPredictor: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showCharts, setShowCharts] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  // Real-time update interval (every 2 minutes)
  const REFRESH_INTERVAL = 120000;

  // Fetch all patients and access requests on component mount
  useEffect(() => {
    fetchPatients();
    fetchAccessRequests();
    
    const interval = setInterval(() => {
      refreshData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Refresh data function
  const refreshData = useCallback(async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      await Promise.all([fetchPatients(), fetchAccessRequests()]);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  // Mock patients data instead of backend call - 10 patients total
  const mockPatients: Patient[] = [
    {
      id: 'P001',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@gmail.com',
      dateOfBirth: '1985-03-15',
      gender: 'Female',
      medicalRecordNumber: 'MRN001',
      chronicConditions: ['Type 1 Diabetes', 'Hypertension'],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 65,
        lastAssessed: '2024-01-20',
        cardiovascularRisk: 'Medium',
        diabetesRisk: 'High',
        cancerRisk: 'Low',
        respiratoryRisk: 'Low',
        kidneyRisk: 'Low',
        recommendations: ['Monitor blood sugar daily', 'Regular exercise', 'Diet consultation']
      }
    },
    {
      id: 'P002',
      firstName: 'Raj',
      lastName: 'Patel',
      email: 'raj.patel@gmail.com',
      dateOfBirth: '1978-07-22',
      gender: 'Male',
      medicalRecordNumber: 'MRN002',
      chronicConditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
      riskAssessment: {
        overallRisk: 'High',
        riskScore: 78,
        lastAssessed: '2024-01-18',
        cardiovascularRisk: 'High',
        diabetesRisk: 'Medium',
        cancerRisk: 'Low',
        respiratoryRisk: 'Low',
        kidneyRisk: 'Medium',
        recommendations: ['Cardiac monitoring', 'Low-fat diet', 'Regular exercise']
      }
    },
    {
      id: 'P003',
      firstName: 'Ananya',
      lastName: 'Kumar',
      email: 'ananya.kumar@gmail.com',
      dateOfBirth: '1992-11-08',
      gender: 'Female',
      medicalRecordNumber: 'MRN003',
      chronicConditions: ['Migraine', 'Anxiety'],
      riskAssessment: {
        overallRisk: 'Low',
        riskScore: 35,
        lastAssessed: '2024-01-22',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        respiratoryRisk: 'Low',
        kidneyRisk: 'Low',
        recommendations: ['Vitamin D supplements', 'Stress management', 'Regular sleep']
      }
    },
    {
      id: 'P004',
      firstName: 'Arjun',
      lastName: 'Singh',
      email: 'arjun.singh@gmail.com',
      dateOfBirth: '1972-05-12',
      gender: 'Male',
      medicalRecordNumber: 'MRN004',
      chronicConditions: ['Prostate Cancer', 'Hypertension'],
      riskAssessment: {
        overallRisk: 'High',
        riskScore: 82,
        lastAssessed: '2024-01-19',
        cardiovascularRisk: 'High',
        diabetesRisk: 'Low',
        cancerRisk: 'High',
        respiratoryRisk: 'Low',
        kidneyRisk: 'Medium',
        recommendations: ['Oncological monitoring', 'Regular PSA tests', 'Lifestyle modifications']
      }
    },
    {
      id: 'P005',
      firstName: 'Meera',
      lastName: 'Reddy',
      email: 'meera.reddy@gmail.com',
      dateOfBirth: '1988-09-30',
      gender: 'Female',
      medicalRecordNumber: 'MRN005',
      chronicConditions: ['Rheumatoid Arthritis', 'Osteoporosis'],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 58,
        lastAssessed: '2024-01-21',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        respiratoryRisk: 'Low',
        kidneyRisk: 'Low',
        recommendations: ['Joint protection', 'Calcium supplements', 'Physical therapy']
      }
    },
    {
      id: 'P006',
      firstName: 'Vikram',
      lastName: 'Malhotra',
      email: 'vikram.malhotra@gmail.com',
      dateOfBirth: '1980-12-03',
      gender: 'Male',
      medicalRecordNumber: 'MRN006',
      chronicConditions: ['Asthma', 'GERD'],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 52,
        lastAssessed: '2024-01-23',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        respiratoryRisk: 'High',
        kidneyRisk: 'Low',
        recommendations: ['Avoid allergens', 'Regular inhaler use', 'Monitor peak flow']
      }
    },
    {
      id: 'P007',
      firstName: 'Kavya',
      lastName: 'Iyer',
      email: 'kavya.iyer@gmail.com',
      dateOfBirth: '1995-04-18',
      gender: 'Female',
      medicalRecordNumber: 'MRN007',
      chronicConditions: ['Eczema', 'Seasonal allergies'],
      riskAssessment: {
        overallRisk: 'Low',
        riskScore: 28,
        lastAssessed: '2024-01-24',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        respiratoryRisk: 'Medium',
        kidneyRisk: 'Low',
        recommendations: ['Avoid triggers', 'Regular moisturizing', 'Allergy management']
      }
    },
    {
      id: 'P008',
      firstName: 'Rahul',
      lastName: 'Gupta',
      email: 'rahul.gupta@gmail.com',
      dateOfBirth: '1975-08-25',
      gender: 'Male',
      medicalRecordNumber: 'MRN008',
      chronicConditions: ['Chronic Kidney Disease', 'Hypertension'],
      riskAssessment: {
        overallRisk: 'High',
        riskScore: 75,
        lastAssessed: '2024-01-25',
        cardiovascularRisk: 'High',
        diabetesRisk: 'Medium',
        cancerRisk: 'Low',
        respiratoryRisk: 'Low',
        kidneyRisk: 'High',
        recommendations: ['Kidney function monitoring', 'Low-sodium diet', 'Regular nephrology follow-up']
      }
    },
    {
      id: 'P009',
      firstName: 'Sunita',
      lastName: 'Verma',
      email: 'sunita.verma@gmail.com',
      dateOfBirth: '1982-11-14',
      gender: 'Female',
      medicalRecordNumber: 'MRN009',
      chronicConditions: ['Multiple Sclerosis', 'Depression'],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 62,
        lastAssessed: '2024-01-26',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Low',
        respiratoryRisk: 'Low',
        kidneyRisk: 'Low',
        recommendations: ['Neurological monitoring', 'Vitamin B12 supplements', 'Physical therapy']
      }
    },
    {
      id: 'P010',
      firstName: 'Amit',
      lastName: 'Kumar',
      email: 'amit.kumar@gmail.com',
      dateOfBirth: '1990-06-08',
      gender: 'Male',
      medicalRecordNumber: 'MRN010',
      chronicConditions: ['Ulcerative Colitis', 'Iron Deficiency Anemia'],
      riskAssessment: {
        overallRisk: 'Medium',
        riskScore: 48,
        lastAssessed: '2024-01-27',
        cardiovascularRisk: 'Low',
        diabetesRisk: 'Low',
        cancerRisk: 'Medium',
        respiratoryRisk: 'Low',
        kidneyRisk: 'Low',
        recommendations: ['Iron supplementation', 'Colonoscopy monitoring', 'Balanced diet']
      }
    }
  ];

  // Mock access requests data - 10 requests for all patients
  const mockAccessRequests: AccessRequest[] = [
    {
      id: 'AR001',
      patientId: 'P001',
      patientName: 'Priya Sharma',
      status: 'approved',
      requestDate: '2024-01-20',
      responseDate: '2024-01-22',
      purpose: 'Cardiac consultation'
    },
    {
      id: 'AR002',
      patientId: 'P002',
      patientName: 'Raj Patel',
      status: 'approved',
      requestDate: '2024-01-18',
      responseDate: '2024-01-20',
      purpose: 'Diabetes management'
    },
    {
      id: 'AR003',
      patientId: 'P003',
      patientName: 'Ananya Kumar',
      status: 'approved',
      requestDate: '2024-01-23',
      responseDate: '2024-01-23',
      purpose: 'Emergency treatment'
    },
    {
      id: 'AR004',
      patientId: 'P004',
      patientName: 'Arjun Singh',
      status: 'approved',
      requestDate: '2024-01-19',
      responseDate: '2024-01-21',
      purpose: 'Cancer treatment'
    },
    {
      id: 'AR005',
      patientId: 'P005',
      patientName: 'Meera Reddy',
      status: 'pending',
      requestDate: '2024-01-24',
      purpose: 'Arthritis management'
    },
    {
      id: 'AR006',
      patientId: 'P006',
      patientName: 'Vikram Malhotra',
      status: 'approved',
      requestDate: '2024-01-22',
      responseDate: '2024-01-24',
      purpose: 'Respiratory care'
    },
    {
      id: 'AR007',
      patientId: 'P007',
      patientName: 'Kavya Iyer',
      status: 'denied',
      requestDate: '2024-01-18',
      responseDate: '2024-01-19',
      purpose: 'Dermatology care'
    },
    {
      id: 'AR008',
      patientId: 'P008',
      patientName: 'Rahul Gupta',
      status: 'approved',
      requestDate: '2024-01-21',
      responseDate: '2024-01-23',
      purpose: 'Kidney disease management'
    },
    {
      id: 'AR009',
      patientId: 'P009',
      patientName: 'Sunita Verma',
      status: 'pending',
      requestDate: '2024-01-25',
      purpose: 'Multiple sclerosis management'
    },
    {
      id: 'AR010',
      patientId: 'P010',
      patientName: 'Amit Kumar',
      status: 'approved',
      requestDate: '2024-01-20',
      responseDate: '2024-01-22',
      purpose: 'Gastroenterology care'
    }
  ];

  const fetchPatients = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Show all 10 patients, but mark which ones are accessible
      const allPatientsWithAccess = mockPatients.map(patient => {
        const accessRequest = mockAccessRequests.find(ar => ar.patientId === patient.id);
        return {
          ...patient,
          hasAccess: accessRequest && accessRequest.status === 'approved',
          accessLevel: accessRequest ? accessRequest.status : 'none',
          accessRequest: accessRequest
        };
      });
      
      // Use all patients with access information
      setPatients(allPatientsWithAccess);
      setError(null);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients');
    }
  };

  const fetchAccessRequests = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Use mock data instead of backend call
      setAccessRequests(mockAccessRequests);
    } catch (error) {
      console.error('Error fetching access requests:', error);
    }
  };

  const getPatientAccessStatus = (patientId: string) => {
    const request = accessRequests.find(ar => ar.patientId === patientId);
    if (!request) return 'pending';
    return request.status;
  };

  const getRiskAssessment = async (patientId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

             const patient = mockPatients.find(p => p.id === patientId);
       if (patient && patient.riskAssessment) {
         setRiskAssessment(patient.riskAssessment);
         setSelectedPatient(patient);
       } else {
         setError('Patient not found or no risk assessment available');
         setRiskAssessment(null);
       }
    } catch (error) {
      setError('Error fetching risk assessment');
      setRiskAssessment(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'very high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-blue-600';
    return 'text-green-600';
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.medicalRecordNumber.toLowerCase().includes(searchQuery.toLowerCase());
     
    let matchesFilter = true;
    
    if (filterStatus === 'accessible') {
      matchesFilter = patient.hasAccess === true;
    } else if (filterStatus !== 'all' && patient.riskAssessment) {
      const overallRisk = patient.riskAssessment.overallRisk.toLowerCase();
      
      switch (filterStatus) {
        case 'stable':
          matchesFilter = overallRisk === 'low';
          break;
        case 'monitoring':
          matchesFilter = overallRisk === 'medium';
          break;
        case 'high':
          matchesFilter = overallRisk === 'high' || overallRisk === 'very high' || overallRisk === 'critical';
          break;
        default:
          matchesFilter = true;
      }
    }
     
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      case 'denied':
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return patients.length;
    
    return patients.filter(patient => {
      if (!patient.riskAssessment) return false;
      
      const overallRisk = patient.riskAssessment.overallRisk.toLowerCase();
      
      switch (status) {
        case 'stable':
          return overallRisk === 'low';
        case 'monitoring':
          return overallRisk === 'medium';
        case 'high':
          return overallRisk === 'high' || overallRisk === 'very high' || overallRisk === 'critical';
        default:
          return false;
      }
    }).length;
  };

  // ECharts configuration functions
  const getRadarChartOption = useCallback(() => {
    if (!riskAssessment) return {};
    
    const riskCategories = Object.entries(riskAssessment)
      .filter(([key]) => !['overallRisk', 'riskScore', 'lastAssessed', 'recommendations'].includes(key))
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    
    const riskValues = Object.entries(riskAssessment)
      .filter(([key]) => !['overallRisk', 'riskScore', 'lastAssessed', 'recommendations'].includes(key))
      .map(([, value]) => {
        const riskLevel = value as string;
        switch (riskLevel) {
          case 'Critical': return 100;
          case 'Very High': return 90;
          case 'High': return 75;
          case 'Medium': return 50;
          case 'Low': return 25;
          default: return 0;
        }
      });
    
    const overallRisk = riskAssessment.overallRisk;
    const riskScore = riskAssessment.riskScore;
    
    const getRiskColor = (risk: string) => {
      switch (risk) {
        case 'Critical': return '#EF4444';
        case 'Very High': return '#F97316';
        case 'High': return '#F59E0B';
        case 'Medium': return '#EAB308';
        case 'Low': return '#10B981';
        default: return '#6B7280';
      }
    };
    
    return {
      title: {
        text: 'Risk Assessment Overview',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1F2937'
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: getRiskColor(overallRisk),
        borderWidth: 2,
        textStyle: { color: '#1F2937' },
        formatter: function(params: any) {
          return `<div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>
                  <div>Risk Level: <span style="color: ${getRiskColor(overallRisk)}; font-weight: bold;">${params.value}</span></div>`;
        }
      },
      radar: {
        indicator: riskCategories.map(category => ({
          name: category,
          max: 100
        })),
        radius: '65%',
        splitNumber: 4,
        axisName: { color: '#6B7280', fontSize: 12 },
        splitLine: { lineStyle: { color: '#E5E7EB', width: 1 } },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250, 250, 250, 0.3)', 'rgba(200, 200, 200, 0.3)']
          }
        }
      },
      series: [{
        name: 'Risk Assessment',
        type: 'radar',
        data: [{
          value: riskValues,
          name: `${overallRisk} Risk (Score: ${riskScore})`,
          itemStyle: { color: getRiskColor(overallRisk) },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 1,
              colorStops: [
                { offset: 0, color: getRiskColor(overallRisk) + '40' },
                { offset: 1, color: getRiskColor(overallRisk) + '80' }
              ]
            }
          },
          lineStyle: { width: 3, color: getRiskColor(overallRisk) }
        }]
      }],
      animation: true,
      animationDuration: 2000,
      animationEasing: 'cubicOut'
    };
  }, [riskAssessment]);

  const getRiskComparisonChartOption = useCallback(() => {
    if (!riskAssessment) return {};
    
    const riskCategories = Object.entries(riskAssessment)
      .filter(([key]) => !['overallRisk', 'riskScore', 'lastAssessed', 'recommendations'].includes(key))
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    
    const riskData = Object.entries(riskAssessment)
      .filter(([key]) => !['overallRisk', 'riskScore', 'lastAssessed', 'recommendations'].includes(key))
      .map(([key, value]) => {
        const riskLevel = value as string;
        let riskValue: number;
        let displayRiskLevel: string;
        
        switch (riskLevel.toLowerCase()) {
          case 'critical':
          case 'very high':
            riskValue = 100;
            displayRiskLevel = 'High';
            break;
          case 'high':
            riskValue = 75;
            displayRiskLevel = 'High';
            break;
          case 'medium':
            riskValue = 50;
            displayRiskLevel = 'Medium';
            break;
          case 'low':
            riskValue = 25;
            displayRiskLevel = 'Low';
            break;
          default:
            riskValue = 0;
            displayRiskLevel = 'Low';
            break;
        }
        return { key, name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), riskLevel: displayRiskLevel, riskValue };
      });
    
    const getRiskLevelColor = (riskLevel: string) => {
      switch (riskLevel.toLowerCase()) {
        case 'high': return '#DC2626';
        case 'medium': return '#EAB308';
        case 'low': return '#10B981';
        default: return '#6B7280';
      }
    };
    
    return {
      title: {
        text: 'Risk Category Comparison',
        left: 'center',
        textStyle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderWidth: 2,
        textStyle: { color: '#1F2937' },
        formatter: function(params: any) {
          const data = params[0];
          const category = riskData.find(item => item.name === data.name);
          return `<div style="font-weight: bold; margin-bottom: 8px;">${data.name}</div>
                  <div>Risk Level: <span style="color: ${getRiskLevelColor(category?.riskLevel || '')}; font-weight: bold;">${category?.riskLevel}</span></div>
                  <div>Score: <span style="font-weight: bold;">${data.value}</span></div>`;
        }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: riskCategories,
        axisLabel: { color: '#6B7280', fontSize: 12, rotate: 45 },
        axisLine: { lineStyle: { color: '#E5E7EB' } }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { color: '#6B7280', fontSize: 12 },
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        splitLine: { lineStyle: { color: '#F3F4F6' } }
      },
      series: [{
        name: 'Risk Level',
        type: 'bar',
        data: riskData.map((item) => ({
          value: item.riskValue,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: getRiskLevelColor(item.riskLevel) + '80' },
                { offset: 1, color: getRiskLevelColor(item.riskLevel) + '40' }
              ]
            },
            borderRadius: [4, 4, 0, 0],
            shadowBlur: 10,
            shadowColor: getRiskLevelColor(item.riskLevel) + '30'
          }
        })),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: getRiskLevelColor(riskData[0]?.riskLevel || '') + '50'
          }
        }
      }],
      animation: true,
      animationDuration: 1500,
      animationEasing: 'cubicOut'
    };
  }, [riskAssessment]);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ExclamationTriangleIcon className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Predictor</h1>
        <p className="text-gray-600 mb-4">AI-powered health risk assessment for patients you have access to</p>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Patients
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or MRN..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
              Risk Status
            </label>
            <select
              id="filter"
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Patients</option>
              <option value="stable">Stable</option>
              <option value="monitoring">Monitoring</option>
              <option value="high">High Risk</option>
              <option value="accessible">Accessible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <button
          onClick={() => setFilterStatus('all')}
          className={`bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            filterStatus === 'all' ? 'ring-2 ring-blue-500 border-blue-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setFilterStatus('stable')}
          className={`bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            filterStatus === 'stable' ? 'ring-2 ring-green-500 border-green-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Stable</p>
              <p className="text-3xl font-bold text-gray-900">{getStatusCount('stable')}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setFilterStatus('monitoring')}
          className={`bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            filterStatus === 'monitoring' ? 'ring-2 ring-yellow-500 border-yellow-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Monitoring</p>
              <p className="text-3xl font-bold text-gray-900">{getStatusCount('monitoring')}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setFilterStatus('high')}
          className={`bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            filterStatus === 'high' ? 'ring-2 ring-red-500 border-red-500' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">High Risk</p>
              <p className="text-3xl font-bold text-gray-900">{getStatusCount('high')}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </button>
      </div>

      {/* Risk Summary Dashboard Charts */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Risk Assessment Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution Pie Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">Risk Level Distribution</h3>
              <div className="h-64">
                <ReactECharts 
                  option={{
                    tooltip: {
                      trigger: 'item',
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      borderColor: '#fff',
                      borderWidth: 2,
                      textStyle: { color: '#fff' },
                      formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                      orient: 'vertical',
                      left: 'left',
                      textStyle: { 
                        color: '#374151',
                        fontSize: 12,
                        fontWeight: 'bold'
                      },
                      itemGap: 15
                    },
                    series: [{
                      name: 'Risk Levels',
                      type: 'pie',
                      radius: ['40%', '70%'],
                      center: ['60%', '50%'],
                      data: [
                        { 
                          value: patients.filter(p => p.riskAssessment?.overallRisk === 'High').length, 
                          name: 'High Risk',
                          itemStyle: { 
                            color: {
                              type: 'linear',
                              x: 0, y: 0, x2: 1, y2: 1,
                              colorStops: [
                                { offset: 0, color: '#EF4444' },
                                { offset: 1, color: '#F87171' }
                              ]
                            },
                            borderColor: '#DC2626',
                            borderWidth: 3,
                            shadowBlur: 10,
                            shadowColor: '#EF4444'
                          }
                        },
                        { 
                          value: patients.filter(p => p.riskAssessment?.overallRisk === 'Medium').length, 
                          name: 'Medium Risk',
                          itemStyle: { 
                            color: {
                              type: 'linear',
                              x: 0, y: 0, x2: 1, y2: 1,
                              colorStops: [
                                { offset: 0, color: '#F59E0B' },
                                { offset: 1, color: '#FBBF24' }
                              ]
                            },
                            borderColor: '#D97706',
                            borderWidth: 3,
                            shadowBlur: 10,
                            shadowColor: '#F59E0B'
                          }
                        },
                        { 
                          value: patients.filter(p => p.riskAssessment?.overallRisk === 'Low').length, 
                          name: 'Low Risk',
                          itemStyle: { 
                            color: {
                              type: 'linear',
                              x: 0, y: 0, x2: 1, y2: 1,
                              colorStops: [
                                { offset: 0, color: '#10B981' },
                                { offset: 1, color: '#34D399' }
                              ]
                            },
                            borderColor: '#059669',
                            borderWidth: 3,
                            shadowBlur: 10,
                            shadowColor: '#10B981'
                          }
                        }
                      ],
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 20,
                          shadowColor: 'rgba(0,0,0,0.5)',
                          shadowOffsetX: 0,
                          shadowOffsetY: 0
                        }
                      },
                      animationType: 'scale',
                      animationEasing: 'elasticOut',
                      animationDelay: function (idx: number) {
                        return Math.random() * 200;
                      }
                    }]
                  }} 
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                />
              </div>
            </div>
            
            {/* Access Status vs Risk Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">Access Status vs Risk Level</h3>
              <div className="h-64">
                <ReactECharts 
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: { 
                        type: 'shadow',
                        shadowStyle: {
                          color: 'rgba(0,0,0,0.1)'
                        }
                      },
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      borderColor: '#fff',
                      borderWidth: 2,
                      textStyle: { color: '#fff' }
                    },
                    legend: {
                      data: ['Approved', 'Pending', 'Denied'],
                      textStyle: { 
                        color: '#374151',
                        fontSize: 12,
                        fontWeight: 'bold'
                      },
                      itemGap: 20
                    },
                    grid: {
                      left: '8%',
                      right: '8%',
                      top: '15%',
                      bottom: '15%'
                    },
                    xAxis: {
                      type: 'category',
                      data: ['High Risk', 'Medium Risk', 'Low Risk'],
                      axisLabel: { 
                        color: '#374151',
                        fontSize: 12,
                        fontWeight: 'bold'
                      },
                      axisLine: {
                        lineStyle: {
                          color: '#E5E7EB',
                          width: 2
                        }
                      }
                    },
                    yAxis: {
                      type: 'value',
                      axisLabel: { 
                        color: '#6B7280',
                        fontSize: 11
                      },
                      splitLine: {
                        lineStyle: {
                          color: '#E5E7EB',
                          width: 1,
                          type: 'dashed'
                        }
                      }
                    },
                    series: [
                      {
                        name: 'Approved',
                        type: 'bar',
                        stack: 'total',
                        data: [
                          patients.filter(p => getPatientAccessStatus(p.id) === 'approved' && p.riskAssessment?.overallRisk === 'High').length,
                          patients.filter(p => getPatientAccessStatus(p.id) === 'approved' && p.riskAssessment?.overallRisk === 'Medium').length,
                          patients.filter(p => getPatientAccessStatus(p.id) === 'approved' && p.riskAssessment?.overallRisk === 'Low').length
                        ],
                        itemStyle: { 
                          color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                              { offset: 0, color: '#10B981' },
                              { offset: 1, color: '#059669' }
                            ]
                          },
                          borderRadius: [4, 4, 0, 0],
                          shadowBlur: 8,
                          shadowColor: 'rgba(16, 185, 129, 0.3)'
                        }
                      },
                      {
                        name: 'Pending',
                        type: 'bar',
                        stack: 'total',
                        data: [
                          patients.filter(p => getPatientAccessStatus(p.id) === 'pending' && p.riskAssessment?.overallRisk === 'High').length,
                          patients.filter(p => getPatientAccessStatus(p.id) === 'pending' && p.riskAssessment?.overallRisk === 'Medium').length,
                          patients.filter(p => getPatientAccessStatus(p.id) === 'pending' && p.riskAssessment?.overallRisk === 'Low').length
                        ],
                        itemStyle: { 
                          color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                              { offset: 0, color: '#F59E0B' },
                              { offset: 1, color: '#D97706' }
                            ]
                          },
                          borderRadius: [4, 4, 0, 0],
                          shadowBlur: 8,
                          shadowColor: 'rgba(245, 158, 11, 0.3)'
                        }
                      },
                      {
                        name: 'Denied',
                        type: 'bar',
                        stack: 'total',
                        data: [
                          patients.filter(p => getPatientAccessStatus(p.id) === 'denied' && p.riskAssessment?.overallRisk === 'High').length,
                          patients.filter(p => getPatientAccessStatus(p.id) === 'denied' && p.riskAssessment?.overallRisk === 'Medium').length,
                          patients.filter(p => getPatientAccessStatus(p.id) === 'denied' && p.riskAssessment?.overallRisk === 'Low').length
                        ],
                        itemStyle: { 
                          color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                              { offset: 0, color: '#EF4444' },
                              { offset: 1, color: '#DC2626' }
                            ]
                          },
                          borderRadius: [4, 4, 0, 0],
                          shadowBlur: 8,
                          shadowColor: 'rgba(239, 68, 68, 0.3)'
                        }
                      }
                    ],
                    animation: true,
                    animationDuration: 1500,
                    animationEasing: 'cubicOut'
                  }} 
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Patient Risk Assessment</h2>
          <p className="text-sm text-gray-600 mt-1">Click on patients with approved access to view detailed risk assessments</p>
        </div>
        <div className="p-6">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500">No patients match your current search criteria or filter selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPatients.map((patient) => {
                const accessStatus = getPatientAccessStatus(patient.id);
                const hasRiskAssessment = patient.riskAssessment;
                const riskLevel = patient.riskAssessment?.overallRisk || 'Unknown';
                const hasAccess = patient.hasAccess === true;
                
                return (
                  <div key={patient.id} className={`bg-white border border-gray-200 rounded-xl p-6 transition-all duration-200 ${
                    hasAccess 
                      ? 'hover:shadow-lg hover:border-blue-200' 
                      : 'opacity-60 bg-gray-50 border-gray-300'
                  }`}>
                    {/* Patient Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                          hasAccess 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                            : 'bg-gray-400'
                        }`}>
                          <span className={`font-bold text-lg ${
                            hasAccess ? 'text-white' : 'text-gray-600'
                          }`}>
                            {patient.firstName[0]}{patient.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold mb-1 ${
                            hasAccess ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <div className={`flex items-center space-x-3 text-sm ${
                            hasAccess ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            <span className="font-medium">{patient.medicalRecordNumber}</span>
                            <span>•</span>
                            <span>{patient.gender}</span>
                            <span>•</span>
                            <span>{new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          hasAccess 
                            ? (accessStatus === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                               accessStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                               accessStatus === 'denied' ? 'bg-red-100 text-red-800 border border-red-200' :
                               'bg-gray-100 text-gray-800 border border-gray-200')
                            : 'bg-gray-200 text-gray-500 border border-gray-300'
                        }`}>
                          {hasAccess ? getStatusIcon(accessStatus) : <UserIcon className="h-4 w-4 text-gray-400" />}
                          <span className="ml-1.5 capitalize">
                            {hasAccess ? accessStatus : 'No Access'}
                          </span>
                        </div>
                        
                        {/* Risk Level Badge */}
                        {hasAccess && hasRiskAssessment && (
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            riskLevel === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
                            riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                            riskLevel === 'Low' ? 'bg-green-100 text-green-700 border border-green-200' :
                            'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            {riskLevel} Risk
                          </div>
                        )}
                        
                        {!hasAccess && (
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-500 border border-gray-300">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            Access Required
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Patient Details */}
                    <div className="space-y-3 mb-4">
                      <div className={`flex items-center space-x-2 text-sm ${
                        hasAccess ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        <CalendarIcon className={`h-4 w-4 ${
                          hasAccess ? 'text-gray-400' : 'text-gray-300'
                        }`} />
                        <span>Email: {patient.email}</span>
                      </div>
                      
                      {hasAccess && patient.chronicConditions.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <ExclamationTriangleIcon className="h-4 w-4 text-orange-400 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Conditions:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {patient.chronicConditions.map((condition, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                  {condition}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!hasAccess && (
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <ExclamationTriangleIcon className="h-4 w-4 text-gray-300" />
                          <span>Patient details require access approval</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${
                          hasAccess 
                            ? (accessStatus === 'approved' ? 'bg-green-400' :
                               accessStatus === 'pending' ? 'bg-yellow-400' :
                               accessStatus === 'denied' ? 'bg-red-400' :
                               'bg-gray-400')
                            : 'bg-gray-300'
                        }`}></div>
                        <span className="capitalize">
                          {hasAccess ? `${accessStatus} access` : 'No access'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {hasAccess && hasRiskAssessment && (
                          <button
                            onClick={() => getRiskAssessment(patient.id)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                            View Risk Assessment
                          </button>
                        )}
                        
                        {hasAccess && !hasRiskAssessment && (
                          <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            Risk Data Pending
                          </span>
                        )}
                        
                        {hasAccess && accessStatus === 'pending' && (
                          <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            Access Pending
                          </span>
                        )}
                        
                        {hasAccess && accessStatus === 'denied' && (
                          <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-700 bg-red-50 border border-red-200">
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            Access Denied
                          </span>
                        )}
                        
                        {!hasAccess && (
                          <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-gray-100 border border-gray-200 cursor-not-allowed">
                            <ShieldExclamationIcon className="h-4 w-4 mr-2" />
                            Request Access Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Loading risk assessment...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <div className="text-center">
              <XCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button onClick={() => setError(null)} className="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment Modal */}
      {selectedPatient && riskAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-blue-200 relative z-[10000]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-t-2xl z-[10001]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">
                    Risk Assessment: {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <p className="text-blue-100 mt-2">Comprehensive health risk analysis and recommendations</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    setRiskAssessment(null);
                  }}
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white hover:text-gray-100"
                  title="Close"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-8 relative z-[10000]">
              {/* Patient Info Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-lg relative z-[10001]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                    Patient Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">MRN:</span>
                      <span className="font-semibold text-gray-900">{selectedPatient.medicalRecordNumber}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Age:</span>
                      <span className="font-semibold text-gray-900">{new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} years</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Gender:</span>
                      <span className="font-semibold text-gray-900 capitalize">{selectedPatient.gender}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600">Last Assessed:</span>
                      <span className="font-semibold text-gray-900">{new Date(riskAssessment.lastAssessed).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-lg relative z-[10001]">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
                    Chronic Conditions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedPatient.chronicConditions.map((condition, index) => (
                      <span key={index} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-300 shadow-sm">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Score Section */}
              <div className="text-center mb-8 relative z-[10001]">
                <div className="relative inline-block">
                  {/* Main Risk Score Circle */}
                  <div className="relative w-48 h-48 mb-20">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      
                      {/* Risk Score Progress */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#riskGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(riskAssessment.riskScore / 100) * 251.2} 251.2`}
                        className="transition-all duration-2000 ease-out"
                        style={{
                          filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
                        }}
                      />
                      
                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="50%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                                         
                     {/* Center Content */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <div className={`text-4xl font-bold mb-2 ${getRiskScoreColor(riskAssessment.riskScore)}`}>
                         {riskAssessment.riskScore}
                       </div>
                       <div className="text-base text-gray-600 font-medium">Risk Score</div>
                       
                       {/* Risk Level Indicator */}
                       <div className="mt-3">
                         <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getRiskColor(riskAssessment.overallRisk)}`}>
                           <div className={`w-2 h-2 rounded-full mr-2 ${
                             riskAssessment.overallRisk === 'High' ? 'bg-red-500' :
                             riskAssessment.overallRisk === 'Medium' ? 'bg-yellow-500' :
                             'bg-green-500'
                           }`}></div>
                           {riskAssessment.overallRisk} Risk Level
                         </div>
                       </div>
                     </div>
                  </div>
                  
                  {/* Risk Level Indicators */}
                  <div className="flex justify-center items-center space-x-12 mb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mb-3 animate-pulse"></div>
                      <div className="bg-green-100 border-2 border-green-300 rounded-full px-4 py-2 text-sm font-medium text-green-800 shadow-md">
                        Low Risk
                      </div>
                      <div className="text-xs text-green-600 mt-1">0-30</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mb-3 animate-pulse"></div>
                      <div className="bg-yellow-100 border-2 border-yellow-300 rounded-full px-4 py-2 text-sm font-medium text-yellow-800 shadow-md">
                        Medium Risk
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">31-70</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mb-3 animate-pulse"></div>
                      <div className="bg-red-100 border-2 border-red-300 rounded-full px-4 py-2 text-sm font-medium text-red-800 shadow-md">
                        High Risk
                      </div>
                      <div className="text-xs text-red-600 mt-1">71-100</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Categories Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-[10001]">
                {Object.entries(riskAssessment).map(([key, value]) => {
                  if (['overallRisk', 'riskScore', 'lastAssessed', 'recommendations'].includes(key)) {
                    return null;
                  }
                  
                  const categoryName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  const riskLevel = value as string;
                  
                  return (
                    <div key={key} className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{categoryName}</h3>
                        <div className={`w-3 h-3 rounded-full ${
                          riskLevel === 'Critical' || riskLevel === 'Very High' ? 'bg-red-500' :
                          riskLevel === 'High' ? 'bg-orange-500' :
                          riskLevel === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        } animate-pulse`}></div>
                      </div>
                      
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-md ${getRiskColor(riskLevel)}`}>
                        {riskLevel} Risk
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Recommendations Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8 shadow-lg relative z-[10001]">
                <h4 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  AI Recommendations
                </h4>
                <ul className="space-y-3">
                  {riskAssessment.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg border border-blue-100">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-blue-800 font-medium">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chart Toggle Button */}
              <div className="text-center mb-8 relative z-[10001]">
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  {showCharts ? 'Hide Analytics Charts' : 'Show Analytics Charts'}
                </button>
              </div>

              {/* Risk Assessment Charts */}
              {showCharts && (
                <div className="space-y-8 relative z-[10001]">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Risk Assessment Analytics</h3>
                    <p className="text-gray-600">Visual representation of patient risk factors and trends</p>
                  </div>
                  
                  {/* Radar Chart */}
                  <div className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 shadow-xl">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">Risk Assessment Overview</h4>
                    <div className="h-96">
                      {chartLoading ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
                          <span className="ml-3 text-gray-600 text-lg">Loading chart...</span>
                        </div>
                      ) : (
                        <ReactECharts 
                          option={getRadarChartOption()} 
                          style={{ height: '100%', width: '100%' }}
                          opts={{ renderer: 'canvas' }}
                          onChartReady={() => setChartLoading(false)}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Risk Category Comparison Chart */}
                  <div className="bg-white/90 backdrop-blur-sm border-2 border-green-200 rounded-xl p-6 shadow-xl">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">Risk Category Comparison</h4>
                    <div className="h-80">
                      <ReactECharts 
                        option={getRiskComparisonChartOption()} 
                        style={{ height: '100%', width: '100%' }}
                        opts={{ renderer: 'canvas' }}
                      />
                    </div>
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

export default RiskPredictor;

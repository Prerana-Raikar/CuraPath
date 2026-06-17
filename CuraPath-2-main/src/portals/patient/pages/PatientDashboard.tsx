import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HeartIcon,
  UserIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ChevronRightIcon,
  BeakerIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  vitals: any[];
  labResults: any[];
  riskAssessment: any;
}

const PatientDashboard: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Check if patient data exists in localStorage
        const storedPatient = localStorage.getItem('patient_data');
        const storedToken = localStorage.getItem('patient_token');
        
        if (storedPatient && storedToken && storedToken.includes(patientId!)) {
          setPatient(JSON.parse(storedPatient));
          setLoading(false);
        } else {
          // Fetch from API if not in localStorage
          const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
          const data = await response.json();
          
          if (data.success && data.data.patient) {
            setPatient(data.data.patient);
            localStorage.setItem('patient_data', JSON.stringify(data.data.patient));
            localStorage.setItem('patient_token', `patient_${patientId}_${Date.now()}`);
          } else {
            setError('Patient not found');
          }
        }
      } catch (error) {
        setError('Failed to fetch patient data');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Patient not found'}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <HeartIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome back, {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-lg text-gray-600">
            Here's your health overview and recent activity
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Age</p>
                <p className="text-3xl font-bold text-gray-900">
                  {getAge(patient.dateOfBirth)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Blood Type</p>
                <p className="text-3xl font-bold text-gray-900">
                  {patient.bloodType}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Risk Level</p>
                <p className="text-3xl font-bold text-gray-900">
                  {patient.riskAssessment?.overallRisk || 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Medications</p>
                <p className="text-3xl font-bold text-gray-900">
                  {patient.currentMedications?.length || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600">
                <BeakerIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600">Access your essential health tools</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => navigate(`/patient/health-records/${patientId}`)}
              className="group block w-full text-left"
            >
              <div className="bg-blue-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group-hover:border-gray-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Health Records
                </h3>
                
                <p className="text-sm text-gray-600 text-center mb-4">
                  View your medical history
                </p>
                
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    View Records →
                  </span>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate(`/patient/prescriptions/${patientId}`)}
              className="group block w-full text-left"
            >
              <div className="bg-green-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group-hover:border-gray-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <BeakerIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Prescriptions
                </h3>
                
                <p className="text-sm text-gray-600 text-center mb-4">
                  Manage your medications
                </p>
                
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    View Medications →
                  </span>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate(`/patient/appointments/${patientId}`)}
              className="group block w-full text-left"
            >
              <div className="bg-purple-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group-hover:border-gray-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CalendarIcon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Appointments
                </h3>
                
                <p className="text-sm text-gray-600 text-center mb-4">
                  Schedule and view visits
                </p>
                
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    Manage Schedule →
                  </span>
                </div>
              </div>
            </button>

          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h3>
                <p className="text-sm text-gray-600">Latest health updates</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mr-4">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      Last Visit
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    January 25, 2024
                  </p>
                  <p className="text-xs text-gray-500">
                    Routine checkup completed
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mr-4">
                  <BeakerIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      Lab Results
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    HbA1c: 6.8% (High)
                  </p>
                  <p className="text-xs text-gray-500">
                    Blood test results available
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mr-4">
                  <HeartIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      Vitals Updated
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Blood Pressure: 128/82
                  </p>
                  <p className="text-xs text-gray-500">
                    Vital signs recorded
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Health Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Health Summary
                </h3>
                <p className="text-sm text-gray-600">Your current health status</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm text-gray-700">Risk Score</span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(patient.riskAssessment?.overallRisk || 'low')}`}>
                  {patient.riskAssessment?.riskScore || 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm text-gray-700">Chronic Conditions</span>
                <span className="text-sm font-medium text-gray-900">{patient.chronicConditions?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm text-gray-700">Allergies</span>
                <span className="text-sm font-medium text-gray-900">{patient.allergies?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm text-gray-700">Current Medications</span>
                <span className="text-sm font-medium text-gray-900">{patient.currentMedications?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon,
  BeakerIcon,
  HeartIcon,
  ChartBarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  vitals: any[];
  labResults: any[];
  medicalHistory: any[];
  allergies: string[];
  chronicConditions: string[];
}

const HealthRecords: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'vitals' | 'labResults' | 'medicalHistory'>('vitals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const storedPatient = localStorage.getItem('patient_data');
        if (storedPatient) {
          setPatient(JSON.parse(storedPatient));
        } else {
          const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
          const data = await response.json();
          if (data.success) {
            setPatient(data.data.patient);
          }
        }
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const getVitalStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'high':
      case 'low':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getLabResultColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'high':
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (value: number, reference: string) => {
    const refValue = parseFloat(reference.split('-')[0]);
    if (value > refValue) return <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />;
    if (value < refValue) return <ArrowTrendingDownIcon className="h-4 w-4 text-blue-500" />;
    return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading health records...</p>
          </div>
        </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
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
            <DocumentTextIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Health Records & History
          </h1>
          <p className="text-lg text-gray-600">
            Access your vital signs, lab results, and medical history
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('vitals')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'vitals'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <HeartIcon className="h-5 w-5" />
                <span>Vital Signs</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('labResults')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'labResults'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BeakerIcon className="h-5 w-5" />
                <span>Lab Results</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('medicalHistory')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'medicalHistory'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <DocumentTextIcon className="h-5 w-5" />
                <span>Medical History</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'vitals' && (
        <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
                  <div className="text-sm text-gray-500">Last updated: January 25, 2024</div>
                </div>
                {patient.vitals && patient.vitals.length > 0 ? (
                  <div className="space-y-4">
                    {patient.vitals.map((vital: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{vital.testName || 'Vital Sign'}</h4>
                          {getVitalStatusIcon(vital.status || 'normal')}
                        </div>
                        <div className="space-y-3">
                          {vital.bloodPressure && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-sm text-gray-600 mb-1">Blood Pressure</p>
                              <p className="text-lg font-bold text-gray-900">
                                {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic} mmHg
                              </p>
                            </div>
                          )}
                          {vital.heartRate && (
                            <div className="bg-green-50 rounded-lg p-3">
                              <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
                              <p className="text-lg font-bold text-gray-900">{vital.heartRate} bpm</p>
                            </div>
                          )}
                          {vital.temperature && (
                            <div className="bg-orange-50 rounded-lg p-3">
                              <p className="text-sm text-gray-600 mb-1">Temperature</p>
                              <p className="text-lg font-bold text-gray-900">{vital.temperature}°F</p>
                            </div>
                          )}
                          {vital.weight && (
                            <div className="bg-purple-50 rounded-lg p-3">
                              <p className="text-sm text-gray-600 mb-1">Weight</p>
                              <p className="text-lg font-bold text-gray-900">{vital.weight} kg</p>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                            Recorded: {new Date(vital.timestamp).toLocaleDateString()}
                          </div>
                      </div>
                    </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No vital signs recorded yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'labResults' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Laboratory Results</h3>
                  <div className="text-sm text-gray-500">Latest results from Austin Medical Labs</div>
                </div>
                {patient.labResults && patient.labResults.length > 0 ? (
                  <div className="space-y-4">
                    {patient.labResults.map((result: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{result.testName}</h4>
                            <p className="text-sm text-gray-600">{result.testType}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getLabResultColor(result.status)}`}>
                            {result.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Result</p>
                            <p className="font-semibold text-gray-900">{result.value} {result.unit}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Normal Range</p>
                            <p className="font-semibold text-gray-900">{result.referenceRange}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Lab</p>
                            <p className="font-semibold text-gray-900">{result.lab}</p>
                          </div>
                        </div>
                        {result.notes && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-blue-800">{result.notes}</p>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                          Result Date: {new Date(result.resultDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BeakerIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No lab results available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'medicalHistory' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
                
                {/* Allergies */}
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                    Allergies
                  </h4>
                  {patient.allergies && patient.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-700">No known allergies</p>
                  )}
                  </div>

                {/* Chronic Conditions */}
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                    <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
                    Chronic Conditions
                  </h4>
                  {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                    <div className="space-y-2">
                      {patient.chronicConditions.map((condition: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-800">{condition}</span>
                </div>
                      ))}
              </div>
                  ) : (
                    <p className="text-yellow-700">No chronic conditions recorded</p>
                  )}
        </div>

                {/* Medical Records */}
                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {patient.medicalHistory.map((record: any, index: number) => (
                      <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{record.title}</h4>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            record.severity === 'low' ? 'bg-green-100 text-green-800' :
                            record.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.severity}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{record.description}</p>
                        <div className="text-xs text-gray-500">
                          Date: {new Date(record.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No medical history records available</p>
            </div>
                )}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  BeakerIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  InformationCircleIcon,
  PlusIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  currentMedications: string[];
}

interface PrescriptionRequest {
  id: string;
  medicationName: string;
  reason: string;
  dosage: string;
  frequency: string;
  route: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  requestedDate: string;
  notes: string;
}

const Prescriptions: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'request'>('current');
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    medicationName: '',
    reason: '',
    dosage: '',
    frequency: '',
    route: '',
    urgency: 'low' as 'low' | 'medium' | 'high',
    notes: ''
  });

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

  // Mock prescription request data
  const prescriptionRequests: PrescriptionRequest[] = [
    {
      id: '1',
      medicationName: 'Metformin 500mg',
      reason: 'Blood sugar control',
      dosage: '500mg',
      frequency: 'Twice daily',
      route: 'Oral tablet',
      urgency: 'medium',
      status: 'pending',
      requestedDate: '2024-01-25',
      notes: 'Need refill for diabetes management'
    },
    {
      id: '2',
      medicationName: 'Lisinopril 5mg',
      reason: 'Blood pressure management',
      dosage: '5mg',
      frequency: 'Once daily',
      route: 'Oral tablet',
      urgency: 'low',
      status: 'approved',
      requestedDate: '2024-01-20',
      notes: 'New prescription for hypertension'
    }
  ];

  // Mock prescription data - in real app this would come from backend
  const currentMedications = [
    {
      id: '1',
      name: 'Insulin Glargine',
      dosage: '10 units',
      frequency: 'Once daily',
      route: 'Subcutaneous injection',
              prescribedBy: 'Dr. Priya Sharma',
        prescribedDate: '2024-01-15',
      status: 'active',
      instructions: 'Inject at bedtime, rotate injection sites',
      sideEffects: ['Hypoglycemia', 'Weight gain'],
      refills: 2
    },
    {
      id: '2',
      name: 'Levothyroxine 75mcg',
      dosage: '75mcg',
      frequency: 'Once daily',
      route: 'Oral tablet',
              prescribedBy: 'Dr. Priya Sharma',
        prescribedDate: '2024-01-10',
      status: 'active',
      instructions: 'Take on empty stomach, 30 minutes before breakfast',
      sideEffects: ['Palpitations', 'Insomnia'],
      refills: 3
    },
    {
      id: '3',
      name: 'Vitamin D3 2000IU',
      dosage: '2000IU',
      frequency: 'Once daily',
      route: 'Oral capsule',
      prescribedBy: 'Dr. Priya Sharma',
      prescribedDate: '2024-01-20',
      status: 'active',
      instructions: 'Take with food for better absorption',
      sideEffects: ['Nausea', 'Constipation'],
      refills: 4
    }
  ];

  const prescriptionHistory = [
    {
      id: '4',
      name: 'Metformin 500mg',
      dosage: '500mg',
      frequency: 'Twice daily',
      route: 'Oral tablet',
      prescribedBy: 'Dr. Sanjana Sharma',
      prescribedDate: '2023-12-01',
      discontinuedDate: '2024-01-10',
      status: 'discontinued',
      reason: 'Switched to insulin therapy',
      instructions: 'Take with meals to reduce stomach upset'
    },
    {
      id: '5',
      name: 'Lisinopril 10mg',
      dosage: '10mg',
      frequency: 'Once daily',
      route: 'Oral tablet',
      prescribedBy: 'Dr. Robert Wilson',
      prescribedDate: '2023-11-15',
      discontinuedDate: '2024-01-05',
      status: 'discontinued',
      reason: 'Blood pressure well controlled',
      instructions: 'Take in the morning'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'discontinued':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'discontinued':
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
      case 'expired':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the request to the backend
    const newRequest: PrescriptionRequest = {
      id: Date.now().toString(),
      ...requestForm,
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0]
    };

    // Add to requests list (in real app, this would be saved to backend)
    prescriptionRequests.unshift(newRequest);
    
    // Reset form and close
    setRequestForm({
      medicationName: '',
      reason: '',
      dosage: '',
      frequency: '',
      route: '',
      urgency: 'low',
      notes: ''
    });
    setShowRequestForm(false);
    setActiveTab('request');
  };

  const handleInputChange = (field: string, value: string) => {
    setRequestForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prescriptions...</p>
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
            <BeakerIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Prescriptions & Requests
          </h1>
          <p className="text-lg text-gray-600">
            Manage your medications and request new prescriptions
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'current'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BeakerIcon className="h-5 w-5" />
                <span>Current ({currentMedications.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'request'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <DocumentTextIcon className="h-5 w-5" />
                <span>Requests ({prescriptionRequests.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span>History ({prescriptionHistory.length})</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Current Medications Tab */}
            {activeTab === 'current' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
                  <div className="text-sm text-gray-500">Active prescriptions</div>
                </div>
                {currentMedications.length > 0 ? (
                  <div className="space-y-4">
                    {currentMedications.map((medication) => (
                      <div key={medication.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{medication.name}</h4>
                            <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(medication.status)}`}>
                            {medication.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Route</p>
                            <p className="font-semibold text-gray-900">{medication.route}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Prescribed By</p>
                            <p className="font-semibold text-gray-900">{medication.prescribedBy}</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Refills Left</p>
                            <p className="font-semibold text-gray-900">{medication.refills}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                            <InformationCircleIcon className="h-4 w-4 mr-2 text-blue-600" />
                            Instructions
                          </h5>
                          <p className="text-gray-700">{medication.instructions}</p>
                        </div>
                        
                        {medication.sideEffects && medication.sideEffects.length > 0 && (
                          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                            <h5 className="font-medium text-yellow-900 mb-2">Side Effects</h5>
                            <div className="flex flex-wrap gap-2">
                              {medication.sideEffects.map((effect, index) => (
                                <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                  {effect}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                          Prescribed: {new Date(medication.prescribedDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BeakerIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No current medications</p>
                  </div>
                )}
              </div>
            )}

            {/* Prescription Requests Tab */}
            {activeTab === 'request' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Prescription Requests</h3>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Request
                  </button>
                </div>

                {prescriptionRequests.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptionRequests.map((request) => (
                      <div key={request.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{request.medicationName}</h4>
                            <p className="text-sm text-gray-600">{request.dosage} • {request.frequency}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getUrgencyColor(request.urgency)}`}>
                              {request.urgency} urgency
                            </span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Route</p>
                            <p className="font-semibold text-gray-900">{request.route}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Reason</p>
                            <p className="font-semibold text-gray-900">{request.reason}</p>
                          </div>
                        </div>
                        
                        {request.notes && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                            <p className="text-gray-700">{request.notes}</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                          Requested: {new Date(request.requestedDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No prescription requests yet</p>
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Make Your First Request
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Prescription History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Prescription History</h3>
                  <div className="text-sm text-gray-500">Discontinued medications</div>
                </div>
                {prescriptionHistory.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptionHistory.map((medication) => (
                      <div key={medication.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{medication.name}</h4>
                            <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(medication.status)}`}>
                            {medication.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Route</p>
                            <p className="font-semibold text-gray-900">{medication.route}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Prescribed By</p>
                            <p className="font-semibold text-gray-900">{medication.prescribedBy}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Reason for Discontinuation</h5>
                          <p className="text-gray-700">{medication.reason}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                          <div>Prescribed: {new Date(medication.prescribedDate).toLocaleDateString()}</div>
                          <div>Discontinued: {new Date(medication.discontinuedDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No prescription history available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Prescription Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Request New Prescription</h2>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                  title="Close form"
                  aria-label="Close prescription request form"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleRequestSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medication Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={requestForm.medicationName}
                      onChange={(e) => handleInputChange('medicationName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Metformin 500mg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      required
                      value={requestForm.dosage}
                      onChange={(e) => handleInputChange('dosage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 500mg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency *
                    </label>
                    <select
                      required
                      value={requestForm.frequency}
                      onChange={(e) => handleInputChange('frequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      title="Select medication frequency"
                      aria-label="Select medication frequency"
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Route *
                    </label>
                    <select
                      required
                      value={requestForm.route}
                      onChange={(e) => handleInputChange('route', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      title="Select medication route"
                      aria-label="Select medication route"
                    >
                      <option value="">Select route</option>
                      <option value="Oral tablet">Oral tablet</option>
                      <option value="Oral capsule">Oral capsule</option>
                      <option value="Oral liquid">Oral liquid</option>
                      <option value="Subcutaneous injection">Subcutaneous injection</option>
                      <option value="Intramuscular injection">Intramuscular injection</option>
                      <option value="Topical cream">Topical cream</option>
                      <option value="Inhaler">Inhaler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={requestForm.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      title="Select urgency level"
                      aria-label="Select urgency level"
                    >
                      <option value="low">Low - Routine refill</option>
                      <option value="medium">Medium - Need within a week</option>
                      <option value="high">High - Urgent need</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Request *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestForm.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Blood sugar control, pain management"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={requestForm.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any additional information for your doctor..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
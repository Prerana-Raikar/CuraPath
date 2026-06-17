import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { 
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  UserIcon,
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface AccessRequest {
  id: string;
  patientId: string;
  patientName: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  requestType: 'full_access' | 'limited_access' | 'emergency_access';
  purpose: string;
  requestedData: string[];
  status: 'pending' | 'approved' | 'denied' | 'expired';
  requestDate: string;
  responseDate?: string;
  expiryDate?: string;
  notes?: string;
}

interface NewAccessRequest {
  patientId: string;
  patientName: string;
  requestType: 'full_access' | 'limited_access' | 'emergency_access';
  purpose: string;
  requestedData: string[];
  notes?: string;
}

const AccessRequests: React.FC = () => {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [newRequest, setNewRequest] = useState<NewAccessRequest>({
    patientId: '',
    patientName: '',
    requestType: 'limited_access',
    purpose: '',
    requestedData: [],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<any>(null);

  // Available data types for selection
  const availableDataTypes = [
    'Medical History',
    'Lab Results', 
    'Prescriptions',
    'Vital Signs',
    'Imaging',
    'Allergies',
    'Chronic Conditions',
    'Current Medications'
  ];

  // Filter access requests based on selected status
  const filteredAccessRequests = accessRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  // Mock access requests data instead of backend call - 10 requests for all patients
  const mockAccessRequests: AccessRequest[] = [
    {
      id: 'AR001',
      patientId: 'P001',
      patientName: 'Priya Sharma',
      requesterId: 'DR001',
      requesterName: 'Dr. Amit Kumar',
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
      requesterId: 'DR002',
      requesterName: 'Dr. Meera Singh',
      requesterRole: 'Endocrinologist',
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
      requesterId: 'DR003',
      requesterName: 'Dr. Vikram Malhotra',
      requesterRole: 'Neurologist',
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
      requesterId: 'DR004',
      requesterName: 'Dr. Kavya Iyer',
      requesterRole: 'Oncologist',
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
      id: 'AR005',
      patientId: 'P005',
      patientName: 'Meera Reddy',
      requesterId: 'DR005',
      requesterName: 'Dr. Rahul Gupta',
      requesterRole: 'Rheumatologist',
      requestType: 'limited_access',
      purpose: 'Arthritis management and rehabilitation',
      requestedData: ['Vital Signs', 'Chronic Conditions', 'Lab Results'],
      status: 'pending',
      requestDate: '2024-01-24',
      notes: 'Awaiting patient consent for rheumatology care'
    },
    {
      id: 'AR006',
      patientId: 'P006',
      patientName: 'Vikram Malhotra',
      requesterId: 'DR006',
      requesterName: 'Dr. Sunita Verma',
      requesterRole: 'Pulmonologist',
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
      id: 'AR007',
      patientId: 'P007',
      patientName: 'Kavya Iyer',
      requesterId: 'DR007',
      requesterName: 'Dr. Amit Kumar',
      requesterRole: 'Dermatologist',
      requestType: 'limited_access',
      purpose: 'Skin condition evaluation and treatment',
      requestedData: ['Medical History', 'Allergies', 'Current Medications'],
      status: 'denied',
      requestDate: '2024-01-18',
      responseDate: '2024-01-19',
      notes: 'Denied - insufficient clinical justification'
    },
    {
      id: 'AR008',
      patientId: 'P008',
      patientName: 'Rahul Gupta',
      requesterId: 'DR008',
      requesterName: 'Dr. Neha Sharma',
      requesterRole: 'Nephrologist',
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
      id: 'AR009',
      patientId: 'P009',
      patientName: 'Sunita Verma',
      requesterId: 'DR009',
      requesterName: 'Dr. Rajesh Patel',
      requesterRole: 'Neurologist',
      requestType: 'full_access',
      purpose: 'Multiple sclerosis management',
      requestedData: ['Medical History', 'Lab Results', 'Imaging', 'Current Medications'],
      status: 'pending',
      requestDate: '2024-01-25',
      notes: 'Under review for neurology consultation'
    },
    {
      id: 'AR010',
      patientId: 'P010',
      patientName: 'Amit Kumar',
      requesterId: 'DR010',
      requesterName: 'Dr. Priya Singh',
      requesterRole: 'Gastroenterologist',
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

  // Mock patients data - 10 patients total
  const mockPatients = [
    { id: 'P001', name: 'Priya Sharma', email: 'priya.sharma@gmail.com' },
    { id: 'P002', name: 'Raj Patel', email: 'raj.patel@gmail.com' },
    { id: 'P003', name: 'Ananya Kumar', email: 'ananya.kumar@gmail.com' },
    { id: 'P004', name: 'Arjun Singh', email: 'arjun.singh@gmail.com' },
    { id: 'P005', name: 'Meera Reddy', email: 'meera.reddy@gmail.com' },
    { id: 'P006', name: 'Vikram Malhotra', email: 'vikram.malhotra@gmail.com' },
    { id: 'P007', name: 'Kavya Iyer', email: 'kavya.iyer@gmail.com' },
    { id: 'P008', name: 'Rahul Gupta', email: 'rahul.gupta@gmail.com' },
    { id: 'P009', name: 'Sunita Verma', email: 'sunita.verma@gmail.com' },
    { id: 'P010', name: 'Amit Kumar', email: 'amit.kumar@gmail.com' }
  ];

  // Fetch access requests - now using mock data
  const fetchAccessRequests = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data instead of backend call
      setAccessRequests(mockAccessRequests);
      setPatients(mockPatients);
      setError(null);
    } catch (error) {
      console.error('Error fetching access requests:', error);
      setError('Failed to fetch access requests');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.data.patients);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  // Search patient by ID
  const searchPatientById = async (patientId: string) => {
    if (!patientId.trim()) {
      setNewRequest(prev => ({ ...prev, patientName: '' }));
      return;
    }

    setSearchingPatient(true);
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${patientId}`);
      const data = await response.json();
      
      if (data.success && data.data.patient) {
        const patient = data.data.patient;
        setNewRequest(prev => ({
          ...prev,
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`
        }));
        setError(null);
      } else {
        setNewRequest(prev => ({ ...prev, patientName: '' }));
        setError('Patient not found. Please check the Patient ID.');
      }
    } catch (error) {
      setNewRequest(prev => ({ ...prev, patientName: '' }));
      setError('Failed to search for patient. Please check the Patient ID.');
    } finally {
      setSearchingPatient(false);
    }
  };

  useEffect(() => {
    fetchAccessRequests();
    fetchPatients();
  }, []);

  // Handle viewing request details
  const handleViewRequest = (request: AccessRequest) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  // Handle viewing patient details
  const handleViewPatientDetails = (request: AccessRequest) => {
    // Find the patient data from the mock patients
    const patient = mockPatients.find(p => p.id === request.patientId);
    if (patient) {
      setSelectedPatientForDetails(patient);
      setShowPatientDetailsModal(true);
    }
  };

  // Handle decline request
  const handleDeclineRequest = (request: AccessRequest) => {
    setSelectedRequest(request);
    setShowDeclineModal(true);
  };

  // Submit decline with reason
  const submitDecline = async () => {
    if (!selectedRequest || !declineReason.trim()) {
      setError('Please provide a reason for declining');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/access-requests/${selectedRequest.id}/deny`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: declineReason })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Access request declined successfully');
        setShowDeclineModal(false);
        setDeclineReason('');
        setSelectedRequest(null);
        fetchAccessRequests(); // Refresh the list
      } else {
        setError('Failed to decline access request');
      }
    } catch (error) {
      setError('Failed to decline access request');
    } finally {
      setLoading(false);
    }
  };

  // Create new access request
  const createAccessRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/access-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Access request created successfully!');
        setIsCreateModalOpen(false);
        setNewRequest({
          patientId: '',
          patientName: '',
      requestType: 'limited_access',
          purpose: '',
          requestedData: [],
          notes: ''
        });
        fetchAccessRequests(); // Refresh the list
      } else {
        setError(data.message || 'Failed to create access request');
      }
    } catch (error) {
      setError('Failed to create access request');
    } finally {
      setLoading(false);
    }
  };

  // Handle data type selection
  const toggleDataType = (dataType: string) => {
    setNewRequest(prev => ({
      ...prev,
      requestedData: prev.requestedData.includes(dataType)
        ? prev.requestedData.filter(type => type !== dataType)
        : [...prev.requestedData, dataType]
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRequest.requestedData.length === 0) {
      setError('Please select at least one data type');
      return;
    }
    createAccessRequest();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'denied':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  // Get request type color
  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'emergency_access':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'full_access':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'limited_access':
        return 'bg-purple-100 text-purple-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Access Requests
          </h1>
          <p className="text-lg text-gray-600">
            Request and manage access to patient medical records
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-xl"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Access Request
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            {filterStatus === 'all' 
              ? `${accessRequests.length} total requests`
              : `${filteredAccessRequests.length} ${filterStatus} requests`
            }
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'all' ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{accessRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setFilterStatus('pending')}
            className={`bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'pending' ? 'ring-2 ring-yellow-500 border-yellow-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">
                  {accessRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setFilterStatus('approved')}
            className={`bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'approved' ? 'ring-2 ring-green-500 border-green-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Approved</p>
                <p className="text-3xl font-bold text-gray-900">
                  {accessRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setFilterStatus('denied')}
            className={`bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
              filterStatus === 'denied' ? 'ring-2 ring-red-500 border-red-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Denied</p>
                <p className="text-3xl font-bold text-gray-900">
                  {accessRequests.filter(r => r.status === 'denied').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XMarkIcon className="h-6 w-6 text-red-600" />
          </div>
            </div>
          </button>
        </div>

        {/* Access Requests List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <h3 className="text-xl font-bold text-gray-900">My Access Requests</h3>
            <p className="text-gray-600 mt-1">Track the status of your patient access requests</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-gray-500 text-lg">Loading access requests...</div>
            </div>
          ) : filteredAccessRequests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-gray-500 text-lg">No access requests found</div>
              <p className="text-gray-400 mt-2">Create your first access request to get started</p>
            </div>
          ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Request Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAccessRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                          <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {request.patientName}
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-block">
                            ID: {request.patientId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRequestTypeColor(request.requestType)}`}>
                        {request.requestType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {request.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.requestDate).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleViewPatientDetails(request)}
                          className="rounded-xl"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Patient
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                             onClick={() => handleDeclineRequest(request)}
                          className="rounded-xl"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                             Decline
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Create New Access Request Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Access Request"
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
                         {/* Patient Information */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Patient ID *
                 </label>
                 <div className="relative">
                   <input
                     type="text"
                     value={newRequest.patientId}
                     onChange={(e) => {
                       const value = e.target.value;
                       setNewRequest(prev => ({ ...prev, patientId: value }));
                       // Auto-search when patient ID is entered
                       if (value.length >= 2) {
                         searchPatientById(value);
                       } else if (value.length === 0) {
                         setNewRequest(prev => ({ ...prev, patientName: '' }));
                         setError(null);
                       }
                     }}
                     onBlur={() => {
                       if (newRequest.patientId.trim()) {
                         searchPatientById(newRequest.patientId);
                       }
                     }}
                     className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Enter patient ID (e.g., P001)"
                     required
                   />
                   {searchingPatient && (
                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                       <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                     </div>
                   )}
                 </div>
                 
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Patient Name *
                 </label>
                 <input
                   type="text"
                   value={newRequest.patientName}
                   onChange={(e) => setNewRequest(prev => ({ ...prev, patientName: e.target.value }))}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Will auto-fill when Patient ID is entered"
                   required
                   readOnly
                 />
                 
               </div>
             </div>

            {/* Request Type and Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type *
                </label>
                <select
                  value={newRequest.requestType}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, requestType: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  aria-label="Select request type"
                >
                  <option value="limited_access">Limited Access</option>
                  <option value="full_access">Full Access</option>
                  <option value="emergency_access">Emergency Access</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose *
                </label>
                <input
                  type="text"
                  value={newRequest.purpose}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Emergency consultation, Follow-up"
                  required
                />
              </div>
            </div>

            {/* Requested Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Data Types *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableDataTypes.map((dataType) => (
                  <label key={dataType} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRequest.requestedData.includes(dataType)}
                      onChange={() => toggleDataType(dataType)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{dataType}</span>
                  </label>
                ))}
              </div>
            </div>

                         {/* Notes */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Additional Notes
               </label>
               <textarea
                 value={newRequest.notes}
                 onChange={(e) => setNewRequest(prev => ({ ...prev, notes: e.target.value }))}
                 rows={3}
                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="Provide additional context for your request..."
               />
             </div>

             {/* Available Patients List */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Available Patients
               </label>
               <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                   {patients.map((patient) => (
                     <div
                       key={patient.id}
                       className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                       onClick={() => {
                         setNewRequest(prev => ({
                           ...prev,
                           patientId: patient.id,
                           patientName: `${patient.firstName} ${patient.lastName}`
                         }));
                         setError(null);
                       }}
                     >
                       <div className="flex items-center space-x-2">
                         <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                           <span className="text-xs font-medium text-blue-600">{patient.id}</span>
                         </div>
                         <span className="text-sm text-gray-700">{patient.firstName} {patient.lastName}</span>
                       </div>
                       <span className="text-xs text-gray-500">{patient.gender}</span>
                     </div>
                   ))}
                 </div>
                 <p className="text-xs text-gray-500 mt-2 text-center">
                   Click on any patient to auto-fill the form
                 </p>
          </div>
        </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="rounded-xl"
              >
                {loading ? 'Creating...' : 'Create Request'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Request Details Modal */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Access Request Details"
          size="lg"
        >
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedRequest.patientName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <p className="text-sm font-semibold text-gray-900">{selectedRequest.patientId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRequestTypeColor(selectedRequest.requestType)}`}>
                    {selectedRequest.requestType.replace('_', ' ')}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <p className="text-sm text-gray-900">{selectedRequest.purpose}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">Requested Data</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedRequest.requestedData.map((data, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      <DocumentTextIcon className="h-3 w-3 mr-1" />
                      {data}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRequest.notes && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <p className="text-sm text-gray-900">{selectedRequest.notes}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">Request Date</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedRequest.requestDate).toLocaleDateString()} at{' '}
                  {new Date(selectedRequest.requestDate).toLocaleTimeString()}
                </p>
              </div>

              {selectedRequest.responseDate && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedRequest.responseDate).toLocaleDateString()} at{' '}
                    {new Date(selectedRequest.responseDate).toLocaleTimeString()}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={() => setShowViewModal(false)} className="rounded-xl">
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Decline Request Modal */}
        <Modal
          isOpen={showDeclineModal}
          onClose={() => setShowDeclineModal(false)}
          title="Decline Access Request"
          size="md"
        >
          {selectedRequest && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">
                    Are you sure you want to decline access for <strong>{selectedRequest.patientName}</strong>?
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Declining *
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Please provide a reason for declining this access request..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setShowDeclineModal(false);
                    setDeclineReason('');
                    setSelectedRequest(null);
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger"
                  onClick={submitDecline}
                  disabled={loading || !declineReason.trim()}
                  className="rounded-xl"
                >
                  {loading ? 'Declining...' : 'Decline Request'}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Patient Details Modal */}
        <Modal
          isOpen={showPatientDetailsModal}
          onClose={() => setShowPatientDetailsModal(false)}
          title="Patient Details"
          size="full"
        >
          {selectedPatientForDetails && (
            <div className="space-y-6">
              {/* Patient Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">
                      {selectedPatientForDetails.firstName?.[0]}{selectedPatientForDetails.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedPatientForDetails.firstName} {selectedPatientForDetails.lastName}
                    </h2>
                    <p className="text-gray-600">Medical Record: {selectedPatientForDetails.medicalRecordNumber}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Age: {new Date().getFullYear() - new Date(selectedPatientForDetails.dateOfBirth).getFullYear()} years</span>
                      <span>•</span>
                      <span>Gender: {selectedPatientForDetails.gender}</span>
                      <span>•</span>
                      <span>Blood Type: {selectedPatientForDetails.bloodType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="font-semibold text-gray-900">{selectedPatientForDetails.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-900">{selectedPatientForDetails.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Emergency Contact:</span>
                      <span className="font-semibold text-gray-900">{selectedPatientForDetails.emergencyContactName}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600">Emergency Phone:</span>
                      <span className="font-semibold text-gray-900">{selectedPatientForDetails.emergencyContactPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-green-600 mr-2" />
                    Address
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-900">{selectedPatientForDetails.address?.street}</p>
                    <p className="text-gray-900">{selectedPatientForDetails.address?.city}, {selectedPatientForDetails.address?.state}</p>
                    <p className="text-gray-900">ZIP: {selectedPatientForDetails.address?.zipCode}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chronic Conditions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
                    Chronic Conditions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatientForDetails.chronicConditions?.map((condition: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ShieldExclamationIcon className="h-5 w-5 text-red-600 mr-2" />
                    Allergies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatientForDetails.allergies?.map((allergy: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-purple-600 mr-2" />
                  Current Medications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedPatientForDetails.currentMedications?.map((medication: string, index: number) => (
                    <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <span className="text-purple-800 font-medium">{medication}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vital Signs */}
              {selectedPatientForDetails.vitals && selectedPatientForDetails.vitals.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <HeartIcon className="h-5 w-5 text-red-600 mr-2" />
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {selectedPatientForDetails.vitals[0]?.bloodPressure?.systolic}/{selectedPatientForDetails.vitals[0]?.bloodPressure?.diastolic}
                      </div>
                      <div className="text-sm text-gray-600">Blood Pressure (mmHg)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedPatientForDetails.vitals[0]?.heartRate}
                      </div>
                      <div className="text-sm text-gray-600">Heart Rate (bpm)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedPatientForDetails.vitals[0]?.temperature}°F
                      </div>
                      <div className="text-sm text-gray-600">Temperature</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedPatientForDetails.vitals[0]?.bmi}
                      </div>
                      <div className="text-sm text-gray-600">BMI</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lab Results */}
              {selectedPatientForDetails.labResults && selectedPatientForDetails.labResults.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    Recent Lab Results
                  </h3>
                  <div className="space-y-3">
                    {selectedPatientForDetails.labResults.map((lab: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{lab.testName}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            lab.status === 'High' ? 'bg-red-100 text-red-800' :
                            lab.status === 'Low' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {lab.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Value:</span>
                            <span className="ml-2 font-semibold text-gray-900">{lab.value} {lab.unit}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Reference:</span>
                            <span className="ml-2 text-gray-900">{lab.referenceRange}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Date:</span>
                            <span className="ml-2 text-gray-900">{new Date(lab.resultDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Notes:</span>
                            <span className="ml-2 text-gray-900">{lab.notes}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Assessment */}
              {selectedPatientForDetails.riskAssessment && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    Risk Assessment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${
                        selectedPatientForDetails.riskAssessment.riskScore >= 80 ? 'text-red-600' :
                        selectedPatientForDetails.riskAssessment.riskScore >= 60 ? 'text-orange-600' :
                        selectedPatientForDetails.riskAssessment.riskScore >= 40 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {selectedPatientForDetails.riskAssessment.riskScore}
                      </div>
                      <div className="text-sm text-gray-600">Risk Score</div>
                    </div>
                    <div className="text-center">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedPatientForDetails.riskAssessment.overallRisk === 'High' ? 'bg-red-100 text-red-800 border border-red-200' :
                        selectedPatientForDetails.riskAssessment.overallRisk === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {selectedPatientForDetails.riskAssessment.overallRisk} Risk
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Overall Risk Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Last Assessed</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(selectedPatientForDetails.riskAssessment.lastAssessed).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Risk Categories */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Risk Categories</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(selectedPatientForDetails.riskAssessment).map(([key, value]) => {
                        if (['overallRisk', 'riskScore', 'lastAssessed', 'recommendations'].includes(key)) {
                          return null;
                        }
                        const categoryName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        const riskLevel = value as string;
                        return (
                          <div key={key} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">{categoryName}</span>
                              <div className={`w-3 h-3 rounded-full ${
                                riskLevel === 'High' ? 'bg-red-500' :
                                riskLevel === 'Medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}></div>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              riskLevel === 'High' ? 'bg-red-100 text-red-800 border border-red-200' :
                              riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              'bg-green-100 text-green-800 border border-green-200'
                            }`}>
                              {riskLevel} Risk
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {selectedPatientForDetails.riskAssessment.recommendations.map((recommendation: string, index: number) => (
                        <li key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-blue-800 font-medium">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={() => setShowPatientDetailsModal(false)} className="rounded-xl">
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AccessRequests;
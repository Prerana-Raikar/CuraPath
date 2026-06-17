import React, { useState, useEffect } from 'react';
import { 
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UserIcon,
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface PrescriptionRequest {
  id: string;
  patientName: string;
  patientId: string;
  medicationName: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  reasonForRequest: string;
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  requestType: 'new' | 'refill' | 'dosage_change';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  pharmacyPreference?: string;
  staffNotes?: string;
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}

const PrescriptionRequests: React.FC = () => {
  const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PrescriptionRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for prescription requests
  const mockRequests: PrescriptionRequest[] = [
    {
      id: '1',
      patientName: 'Priya Sharma',
      patientId: 'P001',
      medicationName: 'Insulin Glargine',
      dosage: '20 units',
      frequency: 'Once daily at bedtime',
      duration: '30 days',
      reasonForRequest: 'Diabetes management - insulin refill',
      urgency: 'high',
      requestType: 'refill',
      status: 'pending',
      pharmacyPreference: 'Hospital Pharmacy',
      staffNotes: 'Patient requires immediate refill',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      patientName: 'Raj Patel',
      patientId: 'P002',
      medicationName: 'Atorvastatin',
      dosage: '40mg',
      frequency: 'Once daily',
      duration: '90 days',
      reasonForRequest: 'Cholesterol management refill',
      urgency: 'normal',
      requestType: 'refill',
      status: 'approved',
      staffNotes: 'Approved after consultation with Dr. Sanjana Sharma',
      processedAt: '2024-01-19T16:45:00Z',
      processedBy: 'Dr. Sanjana Sharma',
      createdAt: '2024-01-18T09:15:00Z'
    },
    {
      id: '3',
      patientName: 'Ananya Kumar',
      patientId: 'P003',
      medicationName: 'Vitamin D3',
      dosage: '2000 IU',
      frequency: 'Once daily',
      duration: '60 days',
      reasonForRequest: 'Vitamin D deficiency treatment',
      urgency: 'normal',
      requestType: 'new',
      status: 'pending',
      pharmacyPreference: 'Wellness Pharmacy',
      createdAt: '2024-01-22T14:20:00Z'
    },
    {
      id: '4',
      patientName: 'Arjun Singh',
      patientId: 'P004',
      medicationName: 'Bicalutamide',
      dosage: '50mg',
      frequency: 'Once daily',
      duration: '30 days',
      reasonForRequest: 'Prostate cancer treatment refill',
      urgency: 'urgent',
      requestType: 'refill',
      status: 'approved',
      staffNotes: 'Critical medication for cancer treatment',
      processedAt: '2024-01-20T11:30:00Z',
      processedBy: 'Dr. Kumar',
      createdAt: '2024-01-19T08:45:00Z'
    },
    {
      id: '5',
      patientName: 'Meera Reddy',
      patientId: 'P005',
      medicationName: 'Methotrexate',
      dosage: '15mg',
      frequency: 'Once weekly',
      duration: '30 days',
      reasonForRequest: 'Rheumatoid arthritis treatment',
      urgency: 'high',
      requestType: 'refill',
      status: 'pending',
      pharmacyPreference: 'Specialty Pharmacy',
      staffNotes: 'Immunosuppressant medication - requires monitoring',
      createdAt: '2024-01-21T13:15:00Z'
    },
    {
      id: '6',
      patientName: 'Vikram Malhotra',
      patientId: 'P006',
      medicationName: 'Albuterol Inhaler',
      dosage: '90mcg',
      frequency: 'As needed',
      duration: '60 days',
      reasonForRequest: 'Asthma rescue medication refill',
      urgency: 'high',
      requestType: 'refill',
      status: 'approved',
      staffNotes: 'Essential rescue medication approved',
      processedAt: '2024-01-23T10:20:00Z',
      processedBy: 'Dr. Sanjana Sharma',
      createdAt: '2024-01-22T15:30:00Z'
    },
    {
      id: '7',
      patientName: 'Kavya Iyer',
      patientId: 'P007',
      medicationName: 'Cetirizine',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      reasonForRequest: 'Seasonal allergy management',
      urgency: 'low',
      requestType: 'refill',
      status: 'pending',
      pharmacyPreference: 'Local Pharmacy',
      createdAt: '2024-01-24T09:45:00Z'
    },
    {
      id: '8',
      patientName: 'Rahul Gupta',
      patientId: 'P008',
      medicationName: 'Furosemide',
      dosage: '40mg',
      frequency: 'Once daily',
      duration: '30 days',
      reasonForRequest: 'Kidney disease management refill',
      urgency: 'normal',
      requestType: 'refill',
      status: 'approved',
      staffNotes: 'Diuretic medication for fluid management',
      processedAt: '2024-01-25T14:15:00Z',
      processedBy: 'Dr. Sanjana Sharma',
      createdAt: '2024-01-24T11:20:00Z'
    },
    {
      id: '9',
      patientName: 'Sunita Verma',
      patientId: 'P009',
      medicationName: 'Vitamin B12',
      dosage: '1000mcg',
      frequency: 'Once daily',
      duration: '60 days',
      reasonForRequest: 'B12 deficiency treatment',
      urgency: 'normal',
      requestType: 'new',
      status: 'pending',
      pharmacyPreference: 'Hospital Pharmacy',
      createdAt: '2024-01-26T16:30:00Z'
    },
    {
      id: '10',
      patientName: 'Amit Kumar',
      patientId: 'P010',
      medicationName: 'Iron Sulfate',
      dosage: '325mg',
      frequency: 'Twice daily',
      duration: '90 days',
      reasonForRequest: 'Iron deficiency anemia treatment',
      urgency: 'normal',
      requestType: 'new',
      status: 'pending',
      pharmacyPreference: 'Local Pharmacy',
      createdAt: '2024-01-27T12:45:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests(mockRequests);
    }, 1000);
  }, []);

  const handleApproveRequest = async (requestId: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { 
          ...req, 
          status: 'approved', 
          processedAt: new Date().toISOString(),
          processedBy: 'Current Staff Member'
        } : req
      ));
      setSuccess('Prescription request approved successfully');
    } catch (err) {
      setError('Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { 
          ...req, 
          status: 'rejected', 
          processedAt: new Date().toISOString(),
          processedBy: 'Current Staff Member'
        } : req
      ));
      setSuccess('Prescription request rejected successfully');
    } catch (err) {
      setError('Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request: PrescriptionRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'new':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'refill':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'dosage_change':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.medicationName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <BeakerIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Prescription Requests
          </h1>
          <p className="text-lg text-gray-600">
            Manage and process patient prescription requests efficiently
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Enhanced Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600">
                <XMarkIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Requests
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by patient name or medication..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                title="Filter by request status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Requests List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <UserGroupIcon className="h-6 w-6 text-purple-600 mr-2" />
            Request List
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <p className="text-gray-600 text-lg">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mb-4">
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600 text-lg">No requests found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-xl p-5 ${
                    request.status === 'pending' ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' :
                    request.status === 'approved' ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' :
                    request.status === 'rejected' ? 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50' :
                    'border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{request.patientName}</h3>
                        <p className="text-sm text-gray-600">ID: {request.patientId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRequestTypeColor(request.requestType)}`}>
                        {request.requestType}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Medication Details</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Medication:</span> {request.medicationName}
                        </p>
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Dosage:</span> {request.dosage} - {request.frequency}
                        </p>
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Duration:</span> {request.duration}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Request Information</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Reason:</span> {request.reasonForRequest}
                        </p>
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Requested:</span> {formatDate(request.createdAt)}
                        </p>
                        {request.pharmacyPreference && (
                          <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                            <span className="font-medium">Pharmacy:</span> {request.pharmacyPreference}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {request.staffNotes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                        <span className="font-medium">Staff Notes:</span> {request.staffNotes}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors flex items-center space-x-2"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View Details</span>
                      </button>

                      {request.status === 'pending' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
                          >
                            <XMarkIcon className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Details Modal */}
        {showDetailsModal && selectedRequest && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-8 border w-full max-w-2xl shadow-2xl rounded-2xl bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Request Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {selectedRequest.patientName}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">ID:</span> {selectedRequest.patientId}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Request Status</h4>
                    <div className="space-y-2">
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${getUrgencyColor(selectedRequest.urgency)}`}>
                        {selectedRequest.urgency}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Medication Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-gray-700"><span className="font-medium">Medication:</span> {selectedRequest.medicationName}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Dosage:</span> {selectedRequest.dosage}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Frequency:</span> {selectedRequest.frequency}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Duration:</span> {selectedRequest.duration}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Reason for Request</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedRequest.reasonForRequest}</p>
                </div>

                {selectedRequest.pharmacyPreference && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Pharmacy Preference</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedRequest.pharmacyPreference}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Timestamps</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600"><span className="font-medium">Created:</span> {formatDate(selectedRequest.createdAt)}</p>
                      {selectedRequest.processedAt && (
                        <p className="text-sm text-gray-600"><span className="font-medium">Processed:</span> {formatDate(selectedRequest.processedAt)}</p>
                      )}
                    </div>
                  </div>

                  {selectedRequest.processedBy && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Processed By</h4>
                      <p className="text-gray-700">{selectedRequest.processedBy}</p>
                    </div>
                  )}
                </div>

                {selectedRequest.status === 'pending' && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                         <button
                       onClick={() => handleApproveRequest(selectedRequest.id)}
                       disabled={loading}
                       className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
                       title="Approve prescription request"
                     >
                       Approve Request
                     </button>
                                         <button
                       onClick={() => handleRejectRequest(selectedRequest.id)}
                       disabled={loading}
                       className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
                       title="Reject prescription request"
                     >
                       Reject Request
                     </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionRequests;
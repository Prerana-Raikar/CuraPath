import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon,
  UserIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface AccessRequest {
  id: string;
  requesterName: string;
  requesterRole: string;
  requestType: 'view' | 'edit' | 'full';
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedData: string[];
  reason: string;
  requestedAt: string;
  expiresAt?: string;
  processedAt?: string;
  staffNotes?: string;
}

interface DataAccess {
  id: string;
  name: string;
  type: 'personal' | 'medical' | 'financial' | 'administrative';
  accessLevel: 'none' | 'view' | 'edit' | 'full';
  lastAccessed?: string;
  lastAccessedBy?: string;
}

const AccessControl: React.FC = () => {
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [dataAccess, setDataAccess] = useState<DataAccess[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock data for access requests
  const mockAccessRequests: AccessRequest[] = [
    {
      id: '1',
              requesterName: 'Dr. Priya Sharma',
      requesterRole: 'Primary Care Physician',
      requestType: 'view',
      urgency: 'normal',
      status: 'pending',
      requestedData: ['Medical History', 'Lab Results', 'Current Medications'],
      reason: 'Routine patient care and treatment planning',
      requestedAt: '2024-01-15T10:30:00Z',
      expiresAt: '2024-02-15T10:30:00Z'
    },
    {
      id: '2',
              requesterName: 'Dr. Rajesh Kumar',
      requesterRole: 'Cardiologist',
      requestType: 'view',
      urgency: 'high',
      status: 'approved',
      requestedData: ['Cardiac Test Results', 'ECG Reports', 'Medication History'],
      reason: 'Cardiac consultation and treatment',
      requestedAt: '2024-01-12T14:20:00Z',
      expiresAt: '2024-02-12T14:20:00Z',
      processedAt: '2024-01-13T09:15:00Z',
      staffNotes: 'Approved for cardiac consultation'
    },
    {
      id: '3',
      requesterName: 'Nurse Emily Davis',
      requesterRole: 'Registered Nurse',
      requestType: 'view',
      urgency: 'normal',
      status: 'rejected',
      requestedData: ['Vital Signs', 'Medication Schedule'],
      reason: 'Daily patient monitoring',
      requestedAt: '2024-01-10T08:45:00Z',
      processedAt: '2024-01-10T16:30:00Z',
      staffNotes: 'Rejected - insufficient justification for access level'
    }
  ];

  // Mock data for current data access
  const mockDataAccess: DataAccess[] = [
    {
      id: '1',
      name: 'Personal Information',
      type: 'personal',
      accessLevel: 'full',
      lastAccessed: '2024-01-15T10:30:00Z',
      lastAccessedBy: 'Dr. Priya Sharma'
    },
    {
      id: '2',
      name: 'Medical Records',
      type: 'medical',
      accessLevel: 'view',
      lastAccessed: '2024-01-12T14:20:00Z',
      lastAccessedBy: 'Dr. Rajesh Kumar'
    },
    {
      id: '3',
      name: 'Lab Results',
      type: 'medical',
      accessLevel: 'view',
      lastAccessed: '2024-01-15T10:30:00Z',
      lastAccessedBy: 'Dr. Priya Sharma'
    },
    {
      id: '4',
      name: 'Financial Information',
      type: 'financial',
      accessLevel: 'none'
    },
    {
      id: '5',
      name: 'Prescription History',
      type: 'medical',
      accessLevel: 'view',
      lastAccessed: '2024-01-14T09:20:00Z',
      lastAccessedBy: 'Pharmacy Staff'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccessRequests(mockAccessRequests);
      setDataAccess(mockDataAccess);
    }, 1000);
  }, []);

  const handleApproveRequest = async (requestId: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccessRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved', processedAt: new Date().toISOString() } : req
      ));
      setSuccess('Access request approved successfully');
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
      
      setAccessRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected', processedAt: new Date().toISOString() } : req
      ));
      setSuccess('Access request rejected successfully');
    } catch (err) {
      setError('Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'expired':
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

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'edit':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'view':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'none':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return <UserIcon className="h-5 w-5 text-blue-500" />;
      case 'medical':
        return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
      case 'financial':
        return <DocumentTextIcon className="h-5 w-5 text-purple-500" />;
      case 'administrative':
        return <DocumentTextIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <ShieldCheckIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Privacy & Access Control
          </h1>
          <p className="text-lg text-gray-600">
            Manage who can access your health information and control your data privacy
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

        {/* Current Data Access Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <LockClosedIcon className="h-6 w-6 text-blue-600 mr-2" />
              Current Data Access
            </h2>
            <button
              onClick={() => setShowRequestForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Request Access
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataAccess.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getDataTypeIcon(item.type)}
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${getAccessLevelColor(item.accessLevel)}`}>
                    {item.accessLevel}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Type:</span> {item.type}</p>
                  {item.lastAccessed && (
                    <p><span className="font-medium">Last accessed:</span> {formatDate(item.lastAccessed)}</p>
                  )}
                  {item.lastAccessedBy && (
                    <p><span className="font-medium">By:</span> {item.lastAccessedBy}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      View
                    </button>
                    <button className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <EyeSlashIcon className="h-3 w-3 mr-1" />
                      Hide
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <UserGroupIcon className="h-6 w-6 text-purple-600 mr-2" />
            Access Requests
          </h2>

          {accessRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600 text-lg">No access requests found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {accessRequests.map((request) => (
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
                        <h3 className="font-semibold text-gray-900 text-lg">{request.requesterName}</h3>
                        <p className="text-sm text-gray-600">{request.requesterRole}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Type:</span> {request.requestType} access
                        </p>
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Reason:</span> {request.reason}
                        </p>
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Requested:</span> {formatDate(request.requestedAt)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requested Data</h4>
                      <div className="space-y-1">
                        {request.requestedData.map((data, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{data}</span>
                          </div>
                        ))}
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

                  {request.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <LockClosedIcon className="h-6 w-6 text-green-600 mr-2" />
            Privacy Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">Personal Information</h4>
                    <p className="text-sm text-gray-600">Control access to personal details</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  Configure
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">Medical Records</h4>
                    <p className="text-sm text-gray-600">Manage medical data access</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                  Configure
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">Financial Information</h4>
                    <p className="text-sm text-gray-600">Control billing data access</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                  Configure
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-orange-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">Access History</h4>
                    <p className="text-sm text-gray-600">View who accessed your data</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;
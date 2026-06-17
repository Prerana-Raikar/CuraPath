import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  privacySettings: any;
}

const PrivacyControl: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'accessHistory'>('overview');
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

  // Mock privacy data - in real app this would come from backend
  const privacySettings = {
    dataSharing: {
      healthRecords: { enabled: true, level: 'restricted' },
      labResults: { enabled: true, level: 'restricted' },
      prescriptions: { enabled: false, level: 'none' },
      appointments: { enabled: true, level: 'basic' }
    },
    accessControl: {
              doctors: ['Dr. Priya Sharma', 'Dr. Rajesh Kumar'],
      staff: ['Nurse Maria Garcia', 'Admin John Smith'],
      family: ['Priya Sharma (Emergency Contact)']
    },
    notifications: {
      accessAlerts: true,
      dataBreach: true,
      policyUpdates: false
    }
  };

  const accessHistory = [
    {
      id: '1',
      date: '2024-01-25',
      time: '10:30 AM',
              user: 'Dr. Priya Sharma',
      role: 'Primary Care Physician',
      action: 'Viewed Health Records',
      dataAccessed: 'Vital signs, lab results',
      status: 'authorized',
      location: 'Hospital Network'
    },
    {
      id: '2',
      date: '2024-01-20',
      time: '2:15 PM',
      user: 'Nurse Maria Garcia',
      role: 'Nursing Staff',
      action: 'Updated Vitals',
      dataAccessed: 'Blood pressure, heart rate',
      status: 'authorized',
      location: 'Hospital Network'
    },
    {
      id: '3',
      date: '2024-01-18',
      time: '9:45 AM',
      user: 'Dr. Robert Wilson',
      role: 'Cardiologist',
      action: 'Viewed Lab Results',
      dataAccessed: 'Cholesterol panel, blood work',
      status: 'authorized',
      location: 'Hospital Network'
    }
  ];

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'restricted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'basic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'none':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'full':
        return <EyeIcon className="h-5 w-5 text-green-500" />;
      case 'restricted':
        return <EyeSlashIcon className="h-5 w-5 text-yellow-500" />;
      case 'basic':
        return <EyeIcon className="h-5 w-5 text-blue-500" />;
      case 'none':
        return <EyeSlashIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <EyeIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authorized':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unauthorized':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading privacy settings...</p>
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
            <ShieldCheckIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Privacy & Access Control
          </h1>
          <p className="text-lg text-gray-600">
            Manage your data sharing preferences and access permissions
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Privacy Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Data Sharing</p>
                <p className="text-3xl font-bold text-gray-900">3/4</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Authorized Users</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Recent Access</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Alerts</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('accessHistory')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'accessHistory'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span>Access History ({accessHistory.length})</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Data Sharing Overview</h3>
                  <div className="text-sm text-gray-500">Current privacy settings</div>
                </div>
                
                {/* Data Sharing Controls */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sharing Controls</h3>
                  <div className="space-y-4">
                    {Object.entries(privacySettings.dataSharing).map(([key, setting]: [string, any]) => (
                      <div key={key} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          {getAccessLevelIcon(setting.level)}
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-gray-700 capitalize transition-colors">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                              {setting.level === 'full' && 'Full access to all data'}
                              {setting.level === 'restricted' && 'Limited access to essential data only'}
                              {setting.level === 'basic' && 'Basic information only'}
                              {setting.level === 'none' && 'No access to this data'}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.enabled}
                            onChange={() => {}}
                            className="sr-only peer"
                            id={`toggle-${key}`}
                            aria-label={`Toggle ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Authorized Users */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Authorized Users</h3>
                  <div className="space-y-4">
                    {Object.entries(privacySettings.accessControl).map(([role, users]: [string, string[]]) => (
                      <div key={role} className="group p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-gray-700 capitalize mb-3 transition-colors">
                          {role.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="space-y-2">
                          {users.map((user, index) => (
                            <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user.charAt(0)}
                              </div>
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{user}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'accessHistory' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Access History</h3>
                  <div className="text-sm text-gray-500">Track who accessed your data and when</div>
                </div>
                
                {accessHistory.length > 0 ? (
                  <div className="space-y-4">
                    {accessHistory.map((access) => (
                      <div key={access.id} className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 text-lg transition-colors">{access.user}</h4>
                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{access.role}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(access.status)}`}>
                            {access.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="text-sm text-gray-600">Action</p>
                              <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{access.action}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <EyeIcon className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-sm text-gray-600">Data Accessed</p>
                              <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{access.dataAccessed}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="text-sm text-gray-600">Date & Time</p>
                              <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                {new Date(access.date).toLocaleDateString()} at {access.time}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-5 w-5 text-orange-500" />
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{access.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No access history available</p>
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

export default PrivacyControl;

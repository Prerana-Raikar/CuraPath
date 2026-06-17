import React from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { DashboardStats } from '@/types';
import { 
  UsersIcon,
  ClipboardDocumentListIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ListBulletIcon,
  BeakerIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const StaffDashboard: React.FC = () => {
  const stats: DashboardStats[] = [
    {
      label: 'Total Patients',
      value: 10,
      change: { value: 0, type: 'increase' },
      icon: UsersIcon
    },
    {
      label: 'Access Granted',
      value: 7,
      change: { value: 0, type: 'increase' },
      icon: CheckCircleIcon
    },
    {
      label: 'Pending Access',
      value: 2,
      change: { value: 0, type: 'increase' },
      icon: ClockIcon
    },
    {
      label: 'Access Denied',
      value: 1,
      change: { value: 0, type: 'increase' },
      icon: ExclamationTriangleIcon
    }
  ];

  const recentTasks = [
    {
      id: '1',
      type: 'data_entry',
      patient: 'Priya Sharma',
      task: 'Update vital signs',
      priority: 'high',
      dueDate: '2024-01-16',
      status: 'pending'
    },
    {
      id: '2',
      type: 'upload',
      patient: 'Raj Patel',
      task: 'Upload lab results',
      priority: 'medium',
      dueDate: '2024-01-17',
      status: 'pending'
    },
    {
      id: '3',
      type: 'monitoring',
      patient: 'Ananya Kumar',
      task: 'Blood pressure check',
      priority: 'medium',
      dueDate: '2024-01-18',
      status: 'completed'
    },
    {
      id: '4',
      type: 'data_entry',
      patient: 'Arjun Singh',
      task: 'Update medication list',
      priority: 'low',
      dueDate: '2024-01-19',
      status: 'pending'
    }
  ];

  const recentActivity = [
    {
      id: '1',
      action: 'Updated patient records',
      patient: 'Priya Sharma',
      timestamp: '10 minutes ago',
      type: 'update'
    },
    {
      id: '2',
      action: 'Uploaded lab report',
      patient: 'Meera Reddy',
      timestamp: '25 minutes ago',
      type: 'upload'
    },
    {
      id: '3',
      action: 'Created monitoring task',
      patient: 'Vikram Malhotra',
      timestamp: '1 hour ago',
      type: 'task'
    },
    {
      id: '4',
      action: 'Updated vital signs',
      patient: 'Kavya Iyer',
      timestamp: '2 hours ago',
      type: 'vitals'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'data_entry':
        return ClipboardDocumentListIcon;
      case 'upload':
        return CloudArrowUpIcon;
      case 'monitoring':
        return ExclamationTriangleIcon;
      default:
        return DocumentTextIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <UserGroupIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Staff Operations Center
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, Rohan. Here's your workload overview for today.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        +{stat.change.value}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${
                  index === 0 ? 'from-blue-500 to-blue-600' :
                  index === 1 ? 'from-purple-500 to-purple-600' :
                  index === 2 ? 'from-green-500 to-green-600' :
                  'from-red-500 to-red-600'
                }`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Today's Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Today's Tasks</h3>
              <a href="/staff/monitoring-tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </a>
            </div>
            <div className="space-y-4">
              {recentTasks.map((task) => {
                const IconComponent = getTaskIcon(task.type);
                return (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{task.task}</h4>
                        <p className="text-sm text-gray-600">Patient: {task.patient}</p>
                        <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-block">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {getStatusIcon(task.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <a href="/staff/patient-editor" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </a>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 mb-1">Patient: {activity.patient}</p>
                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-block">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/staff/patient-editor"
              className="flex items-center p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                <PencilSquareIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Edit Patient Info</h4>
                <p className="text-xs text-gray-600">Update patient records</p>
              </div>
            </a>
            <a
              href="/staff/data-entry"
              className="flex items-center p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Enter Data</h4>
                <p className="text-xs text-gray-600">Add new medical data</p>
              </div>
            </a>
            <a
              href="/staff/prescription-requests"
              className="flex items-center p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <BeakerIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Prescription Requests</h4>
                <p className="text-xs text-gray-600">Review patient requests</p>
              </div>
            </a>
            <a
              href="/staff/upload-reports"
              className="flex items-center p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                <CloudArrowUpIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Upload Reports</h4>
                <p className="text-xs text-gray-600">Add medical documents</p>
              </div>
            </a>
          </div>
        </div>

        {/* Enhanced Urgent Items */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
              Urgent Items
            </h3>
            <span className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full border border-red-200">
              3 items require attention
            </span>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-pink-50 p-5 rounded-r-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-red-800">Missing Lab Results</h4>
                  <p className="text-sm text-red-700 mb-3">Patient Priya Sharma is missing critical lab results due yesterday.</p>
                  <Button variant="danger" size="sm" className="rounded-xl">Review Now</Button>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 p-5 rounded-r-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-yellow-800">Overdue Vital Signs</h4>
                  <p className="text-sm text-yellow-700 mb-3">2 patients have overdue vital sign measurements.</p>
                  <Button variant="outline" size="sm" className="rounded-xl">Update Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
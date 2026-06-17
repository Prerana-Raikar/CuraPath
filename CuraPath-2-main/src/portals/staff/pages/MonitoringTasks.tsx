import React, { useState, useEffect } from 'react';
import { 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface MonitoringTask {
  id: string;
  patientName: string;
  patientId: string;
  taskType: 'vital_signs' | 'medication' | 'appointment' | 'lab_results' | 'follow_up';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
  notes?: string;
  lastUpdated: string;
}

const MonitoringTasks: React.FC = () => {
  const [tasks, setTasks] = useState<MonitoringTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<MonitoringTask | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Add Task form state
  const [newTask, setNewTask] = useState({
    patientId: '',
    taskType: 'vital_signs' as 'vital_signs' | 'medication' | 'appointment' | 'lab_results' | 'follow_up',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    assignedTo: '',
    dueDate: '',
    notes: ''
  });

  // Mock data for monitoring tasks
  const mockTasks: MonitoringTask[] = [
    {
      id: '1',
      patientName: 'Priya Sharma',
      patientId: 'P001',
      taskType: 'vital_signs',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Ms Sharma',
      dueDate: '2024-01-21T14:00:00Z',
      notes: 'Patient has elevated blood pressure (140/90), needs daily monitoring',
      lastUpdated: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      patientName: 'Raj Patel',
      patientId: 'P002',
      taskType: 'medication',
      priority: 'normal',
      status: 'in_progress',
      assignedTo: 'Dr. Sanjana Sharma',
      dueDate: '2024-01-22T16:00:00Z',
      notes: 'Review cholesterol medication effectiveness',
      lastUpdated: '2024-01-20T14:20:00Z'
    },
    {
      id: '3',
      patientName: 'Ananya Kumar',
      patientId: 'P003',
      taskType: 'lab_results',
      priority: 'urgent',
      status: 'overdue',
      assignedTo: 'Dr. Kumar',
      dueDate: '2024-01-21T12:00:00Z',
      notes: 'Vitamin D deficiency - needs immediate supplementation',
      lastUpdated: '2024-01-20T09:15:00Z'
    },
    {
      id: '4',
      patientName: 'Arjun Singh',
      patientId: 'P004',
      taskType: 'follow_up',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'Ms Tejasvi',
      dueDate: '2024-01-22T10:00:00Z',
      notes: 'Prostate cancer monitoring - PSA levels elevated',
      lastUpdated: '2024-01-21T09:30:00Z'
    },
    {
      id: '5',
      patientName: 'Meera Reddy',
      patientId: 'P005',
      taskType: 'appointment',
      priority: 'normal',
      status: 'pending',
      assignedTo: 'Ms chandana',
      dueDate: '2024-01-23T14:00:00Z',
      notes: 'Rheumatoid arthritis follow-up appointment',
      lastUpdated: '2024-01-21T11:20:00Z'
    },
    {
      id: '6',
      patientName: 'Vikram Malhotra',
      patientId: 'P006',
      taskType: 'vital_signs',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Ms Sharma',
      dueDate: '2024-01-22T16:00:00Z',
      notes: 'Asthma peak flow monitoring - below normal range',
      lastUpdated: '2024-01-21T15:30:00Z'
    },
    {
      id: '7',
      patientName: 'Kavya Iyer',
      patientId: 'P007',
      taskType: 'lab_results',
      priority: 'normal',
      status: 'pending',
      assignedTo: 'Dr. Kumar',
      dueDate: '2024-01-24T12:00:00Z',
      notes: 'Allergy testing results review',
      lastUpdated: '2024-01-22T09:45:00Z'
    },
    {
      id: '8',
      patientName: 'Rahul Gupta',
      patientId: 'P008',
      taskType: 'medication',
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'Dr. Sanjana Sharma',
      dueDate: '2024-01-23T14:00:00Z',
      notes: 'Kidney function monitoring - creatinine elevated',
      lastUpdated: '2024-01-22T11:20:00Z'
    },
    {
      id: '9',
      patientName: 'Sunita Verma',
      patientId: 'P009',
      taskType: 'follow_up',
      priority: 'normal',
      status: 'pending',
      assignedTo: 'Ms Tejasvi',
      dueDate: '2024-01-25T10:00:00Z',
      notes: 'Multiple sclerosis neurological assessment',
      lastUpdated: '2024-01-23T16:30:00Z'
    },
    {
      id: '10',
      patientName: 'Amit Kumar',
      patientId: 'P010',
      taskType: 'lab_results',
      priority: 'normal',
      status: 'pending',
      assignedTo: 'Dr. Kumar',
      dueDate: '2024-01-26T12:00:00Z',
      notes: 'Iron deficiency anemia - treatment monitoring',
      lastUpdated: '2024-01-24T12:45:00Z'
    }
  ];

  // Mock patients data for task creation
  const mockPatients = [
    { id: 'P001', name: 'Priya Sharma', mrn: 'MRN001' },
    { id: 'P002', name: 'Raj Patel', mrn: 'MRN002' },
    { id: 'P003', name: 'Ananya Kumar', mrn: 'MRN003' },
    { id: 'P004', name: 'Arjun Singh', mrn: 'MRN004' },
    { id: 'P005', name: 'Meera Reddy', mrn: 'MRN005' },
    { id: 'P006', name: 'Vikram Malhotra', mrn: 'MRN006' },
    { id: 'P007', name: 'Kavya Iyer', mrn: 'MRN007' },
    { id: 'P008', name: 'Rahul Gupta', mrn: 'MRN008' },
    { id: 'P009', name: 'Sunita Verma', mrn: 'MRN009' },
    { id: 'P010', name: 'Amit Kumar', mrn: 'MRN010' }
  ];

  // Mock staff data for task assignment
  const mockStaff = [
    'Dr. Sanjana Sharma',
    'Dr. Kumar',
    'Ms Sharma',
    'Ms Tejasvi',
    'Ms chandana'
  ];

  // Functions for task management
  const handleAddTask = () => {
    setShowAddTaskModal(true);
    setNewTask({
      patientId: '',
      taskType: 'vital_signs',
      priority: 'normal',
      assignedTo: '',
      dueDate: '',
      notes: ''
    });
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedPatient = mockPatients.find(p => p.id === newTask.patientId);
      if (!selectedPatient) {
        throw new Error('Patient not found');
      }

      const newTaskData: MonitoringTask = {
        id: Date.now().toString(),
        patientName: selectedPatient.name,
        patientId: newTask.patientId,
        taskType: newTask.taskType,
        priority: newTask.priority,
        status: 'pending',
        assignedTo: newTask.assignedTo,
        dueDate: new Date(newTask.dueDate).toISOString(),
        notes: newTask.notes,
        lastUpdated: new Date().toISOString()
      };

      setTasks([...tasks, newTaskData]);
      setSuccess('Task created successfully!');
      setShowAddTaskModal(false);
      
      // Reset form
      setNewTask({
        patientId: '',
        taskType: 'vital_signs',
        priority: 'normal',
        assignedTo: '',
        dueDate: '',
        notes: ''
      });
    } catch (error) {
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
    }, 1000);
  }, []);

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { 
          ...task, 
          status: newStatus as any,
          lastUpdated: new Date().toISOString(),
          ...(newStatus === 'completed' && { completedAt: new Date().toISOString() })
        } : task
      ));
      setSuccess('Task status updated successfully');
    } catch (err) {
      setError('Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (task: MonitoringTask) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'vital_signs':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'medication':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'appointment':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'lab_results':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'follow_up':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'vital_signs':
        return <ChartBarIcon className="h-5 w-5 text-purple-500" />;
      case 'medication':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'appointment':
        return <CalendarIcon className="h-5 w-5 text-green-500" />;
      case 'lab_results':
        return <DocumentTextIcon className="h-5 w-5 text-orange-500" />;
      case 'follow_up':
        return <UserIcon className="h-5 w-5 text-indigo-500" />;
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

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = task.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <ClockIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Monitoring Tasks
          </h1>
          <p className="text-lg text-gray-600">
            Track and manage patient monitoring tasks and follow-ups
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <ClockIcon className="h-6 w-6 text-white" />
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
                <p className="text-sm font-medium text-gray-600 mb-2">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
                <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Tasks
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by patient or staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                title="Filter by task status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Priority
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                title="Filter by task priority"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Tasks List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserGroupIcon className="h-6 w-6 text-purple-600 mr-2" />
              Task List
            </h2>
            <button
              onClick={handleAddTask}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              title="Add new monitoring task"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Task</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <p className="text-gray-600 text-lg">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mb-4">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600 text-lg">No tasks found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-xl p-5 ${
                    task.status === 'pending' ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' :
                    task.status === 'in_progress' ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50' :
                    task.status === 'completed' ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' :
                    'border-red-200 bg-gradient-to-r from-red-50 to-pink-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        {getTaskTypeIcon(task.taskType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{task.patientName}</h3>
                        <p className="text-sm text-gray-600">ID: {task.patientId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getTaskTypeColor(task.taskType)}`}>
                        {task.taskType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Task Details</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Assigned to:</span> {task.assignedTo}
                        </p>
                        <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                          <span className="font-medium">Due date:</span> {formatDate(task.dueDate)}
                        </p>
                        {task.completedAt && (
                          <p className="text-sm text-gray-600 bg-white p-2 rounded-lg">
                            <span className="font-medium">Completed:</span> {formatDate(task.completedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                      <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                        {task.notes || 'No notes available'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3" />
                        <span>Last updated: {formatDate(task.lastUpdated)}</span>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewDetails(task)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors flex items-center space-x-2"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>View Details</span>
                        </button>

                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
                          >
                            <ArrowTrendingUpIcon className="h-4 w-4" />
                            <span>Start Task</span>
                          </button>
                        )}

                        {task.status === 'in_progress' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Complete Task</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Task Modal */}
        {showAddTaskModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-8 border w-full max-w-2xl shadow-2xl rounded-2xl bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New Task</h3>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Close add task modal"
                  aria-label="Close add task modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTask.patientId}
                    onChange={(e) => handleInputChange('patientId', e.target.value)}
                    required
                    title="Select patient for the task"
                    aria-label="Select patient for the task"
                  >
                    <option value="">Select Patient</option>
                    {mockPatients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name} (MRN: {patient.mrn})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Type
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTask.taskType}
                    onChange={(e) => handleInputChange('taskType', e.target.value)}
                    required
                    title="Select task type"
                    aria-label="Select task type"
                  >
                    <option value="vital_signs">Vital Signs</option>
                    <option value="medication">Medication</option>
                    <option value="appointment">Appointment</option>
                    <option value="lab_results">Lab Results</option>
                    <option value="follow_up">Follow-up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTask.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    required
                    title="Select task priority"
                    aria-label="Select task priority"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTask.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    required
                    title="Select staff member to assign task to"
                    aria-label="Select staff member to assign task to"
                  >
                    <option value="">Select Staff</option>
                    {mockStaff.map(staff => (
                      <option key={staff} value={staff}>{staff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTask.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    required
                    title="Select due date and time for the task"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={newTask.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter task notes and instructions..."
                    title="Enter task notes and instructions"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                    title="Cancel adding task"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    title="Add new task"
                  >
                    {loading ? 'Adding...' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {showDetailsModal && selectedTask && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-8 border w-full max-w-2xl shadow-2xl rounded-2xl bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Task Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Close task details"
                >
                  <ClockIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {selectedTask.patientName}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">ID:</span> {selectedTask.patientId}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Task Information</h4>
                    <div className="space-y-2">
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${getTaskTypeColor(selectedTask.taskType)}`}>
                        {selectedTask.taskType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Assignment Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-gray-700"><span className="font-medium">Assigned to:</span> {selectedTask.assignedTo}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Due date:</span> {formatDate(selectedTask.dueDate)}</p>
                    {selectedTask.completedAt && (
                      <p className="text-sm text-gray-700"><span className="font-medium">Completed:</span> {formatDate(selectedTask.completedAt)}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                    {selectedTask.notes || 'No notes available'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Timestamps</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600"><span className="font-medium">Last updated:</span> {formatDate(selectedTask.lastUpdated)}</p>
                  </div>
                </div>

                {selectedTask.status === 'pending' && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleUpdateTaskStatus(selectedTask.id, 'in_progress')}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors"
                      title="Start monitoring task"
                    >
                      Start Task
                    </button>
                  </div>
                )}

                {selectedTask.status === 'in_progress' && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleUpdateTaskStatus(selectedTask.id, 'completed')}
                      disabled={loading}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
                      title="Complete monitoring task"
                    >
                      Complete Task
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

export default MonitoringTasks;
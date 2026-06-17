import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  PhoneIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { addAppointmentRequest, sharedAppointments } from '@/data/mockAppointments';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  appointments: any[];
}

const Appointments: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    appointmentType: '',
    preferredDate: '',
    preferredTime: '',
    urgency: '',
    reason: '',
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

  const getAppointmentStatus = (appointment: any) => {
    if (appointment.status === 'scheduled') return 'Scheduled';
    if (appointment.status === 'completed') return 'Completed';
    if (appointment.status === 'cancelled') return 'Cancelled';
    if (appointment.status === 'rescheduled') return 'Rescheduled';
    return 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'rescheduled':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleScheduleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setScheduleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new appointment object
    const newAppointment = {
      id: Date.now().toString(),
      date: scheduleForm.preferredDate,
      time: scheduleForm.preferredTime,
      type: scheduleForm.appointmentType,
              doctor: 'Dr. Priya Sharma',
      location: 'Primary Care Department',
      status: 'pending' as const,
      notes: `${scheduleForm.reason}${scheduleForm.notes ? ' - ' + scheduleForm.notes : ''}`,
      duration: '30 minutes',
      room: 'TBD'
    };

    // In a real app, this would be sent to the backend
    console.log('New appointment request:', newAppointment);
    
    // Add to upcoming appointments (for demo purposes)
    // In real app, this would be added after doctor approval
    addAppointmentRequest(newAppointment);
    
    // Reset form and close modal
    setScheduleForm({
      appointmentType: '',
      preferredDate: '',
      preferredTime: '',
      urgency: '',
      reason: '',
      notes: ''
    });
    setShowScheduleModal(false);
    
    // Show success message (in real app, this would be a proper notification)
    alert('Appointment request submitted successfully! Dr. Johnson will review and confirm your appointment.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
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

  // Mock appointments data - in real app this would come from backend
  const mockAppointments = sharedAppointments;

  const upcomingAppointments = mockAppointments.filter(apt => apt.status === 'scheduled' || apt.status === 'pending');
  const pastAppointments = mockAppointments.filter(apt => apt.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <CalendarIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Appointments & Scheduling
          </h1>
          <p className="text-lg text-gray-600">
            View your appointments and schedule new visits
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total</p>
                <p className="text-3xl font-bold text-gray-900">{mockAppointments.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{pastAppointments.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Next Visit</p>
                <p className="text-3xl font-bold text-gray-900">Feb 15</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule New Appointment Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700"
          >
            <PlusIcon className="h-6 w-6" />
            <span>Schedule New Appointment</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span>Upcoming ({upcomingAppointments.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'past'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <span>Past ({pastAppointments.length})</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
                  <div className="text-sm text-gray-500">Your scheduled visits</div>
                </div>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 text-lg">{appointment.type}</h4>
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                            {getAppointmentStatus(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(appointment.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-sm text-gray-600">Time</p>
                              <p className="font-semibold text-gray-900">{appointment.time}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="text-sm text-gray-600">Doctor</p>
                              <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                            </div>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="bg-blue-100 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-800">{appointment.notes}</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 pt-3 border-t border-blue-200">
                          Scheduled: {new Date(appointment.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming appointments</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Past Appointments</h3>
                  <div className="text-sm text-gray-500">Completed visits</div>
                </div>
                {pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <div key={appointment.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 text-lg">{appointment.type}</h4>
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                            {getAppointmentStatus(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(appointment.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-sm text-gray-600">Doctor</p>
                              <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                            </div>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="bg-gray-100 rounded-lg p-3 mb-4">
                            <p className="text-sm text-gray-700">{appointment.notes}</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500 pt-3 border-t border-gray-200">
                          Completed: {new Date(appointment.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No past appointments</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule New Appointment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Schedule New Appointment</h2>
              <button 
                onClick={() => setShowScheduleModal(false)} 
                className="text-white hover:text-gray-200 transition-colors"
                title="Close modal"
                aria-label="Close appointment scheduling modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type
                  </label>
                  <select
                    id="appointmentType"
                    name="appointmentType"
                    value={scheduleForm.appointmentType}
                    onChange={handleScheduleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    title="Select appointment type"
                    aria-label="Select appointment type"
                  >
                    <option value="">Select type</option>
                    <option value="consultation">Consultation</option>
                    <option value="check-up">Check-up</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                    <option value="routine">Routine Visit</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={scheduleForm.preferredDate}
                    onChange={handleScheduleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    title="Select preferred date"
                    aria-label="Select preferred date"
                  />
                </div>
                
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={scheduleForm.preferredTime}
                    onChange={handleScheduleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    title="Select preferred time"
                    aria-label="Select preferred time"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={scheduleForm.urgency}
                    onChange={handleScheduleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    title="Select urgency level"
                    aria-label="Select urgency level"
                  >
                    <option value="">Select urgency</option>
                    <option value="low">Low - Routine</option>
                    <option value="medium">Medium - Within a week</option>
                    <option value="high">High - Within 2-3 days</option>
                    <option value="urgent">Urgent - Same day</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={scheduleForm.reason}
                  onChange={handleScheduleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  required
                  title="Describe reason for visit"
                  aria-label="Describe reason for visit"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={scheduleForm.notes}
                  onChange={handleScheduleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information or special requests..."
                  title="Add additional notes"
                  aria-label="Add additional notes"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
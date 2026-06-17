// Mock shared appointments data - in real app this would be a database
export interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  doctor: string;
  location: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string;
  duration: string;
  room: string;
  patientName?: string;
  patientId?: string;
  urgency?: string;
  reason?: string;
}

export const sharedAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-02-15',
    time: '10:00 AM',
    type: 'Follow-up Consultation',
    doctor: 'Dr. Sanjana Sharma',
    location: 'Cardiology Department',
    status: 'scheduled',
    notes: 'Regular follow-up for diabetes management',
    duration: '30 minutes',
    room: 'Room 205',
    patientName: 'John Doe',
    patientId: 'P001'
  },
  {
    id: '2',
    date: '2024-02-20',
    time: '2:30 PM',
    type: 'Lab Test',
    doctor: 'Dr. Robert Wilson',
    location: 'Laboratory',
    status: 'scheduled',
    notes: 'Blood work and cholesterol screening',
    duration: '45 minutes',
    room: 'Lab 3',
    patientName: 'Jane Smith',
    patientId: 'P002'
  },
  {
    id: '3',
    date: '2024-01-30',
    time: '9:00 AM',
    type: 'Annual Physical',
    doctor: 'Dr. Sanjana Sharma',
    location: 'Primary Care',
    status: 'completed',
    notes: 'Routine physical examination completed',
    duration: '60 minutes',
    room: 'Room 102',
    patientName: 'Mike Johnson',
    patientId: 'P003'
  }
];

// Function to add new appointment request
export const addAppointmentRequest = (appointment: Omit<Appointment, 'id'>) => {
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString()
  };
  sharedAppointments.push(newAppointment);
  return newAppointment;
};

// Function to get pending appointments for a specific doctor
export const getPendingAppointments = (doctorEmail: string) => {
  return sharedAppointments.filter(apt => 
    apt.status === 'pending' && 
    apt.doctor.toLowerCase().includes(doctorEmail.split('@')[0].toLowerCase())
  );
};

// Function to get all appointments for a specific doctor
export const getDoctorAppointments = (doctorEmail: string) => {
  return sharedAppointments.filter(apt => 
    apt.doctor.toLowerCase().includes(doctorEmail.split('@')[0].toLowerCase())
  );
};

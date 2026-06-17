import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PatientPortalLayout from '@/components/layout/PatientPortalLayout';
import PatientLogin from './pages/PatientLogin';
import PatientDashboard from './pages/PatientDashboard';
import HealthRecords from './pages/HealthRecords';
import Prescriptions from './pages/Prescriptions';
import Appointments from './pages/Appointments';
import SymptomChecker from './pages/SymptomChecker';
import { NavigationItem } from '@/types';
import { 
  HomeIcon,
  DocumentTextIcon,
  BeakerIcon,
  CalendarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const PatientPortal: React.FC = () => {
  const navigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/patient/dashboard', 
      icon: HomeIcon
    },
    { 
      name: 'Health Records', 
      href: '/patient/health-records', 
      icon: DocumentTextIcon
    },
    { 
      name: 'Prescriptions', 
      href: '/patient/prescriptions', 
      icon: BeakerIcon
    },
    { 
      name: 'Appointments', 
      href: '/patient/appointments', 
      icon: CalendarIcon
    },
    { 
      name: 'Symptom Checker', 
      href: '/patient/symptom-checker', 
      icon: HeartIcon
    }
  ];

  return (
    <Routes>
      {/* Patient login - no authentication required */}
      <Route path="login" element={<PatientLogin />} />
      
      {/* Patient portal with layout - require patient ID */}
      <Route path="dashboard/:patientId" element={
        <PatientPortalLayout navigation={navigation} title="Patient Portal">
          <PatientDashboard />
        </PatientPortalLayout>
      } />
      <Route path="health-records/:patientId" element={
        <PatientPortalLayout navigation={navigation} title="Patient Portal">
          <HealthRecords />
        </PatientPortalLayout>
      } />
      <Route path="prescriptions/:patientId" element={
        <PatientPortalLayout navigation={navigation} title="Patient Portal">
          <Prescriptions />
        </PatientPortalLayout>
      } />
      <Route path="appointments/:patientId" element={
        <PatientPortalLayout navigation={navigation} title="Patient Portal">
          <Appointments />
        </PatientPortalLayout>
      } />
      <Route path="symptom-checker/:patientId" element={
        <PatientPortalLayout navigation={navigation} title="Patient Portal">
          <SymptomChecker />
        </PatientPortalLayout>
      } />
      
      {/* Default redirect to login */}
      <Route path="*" element={<Navigate to="/patient/login" replace />} />
    </Routes>
  );
};

export default PatientPortal;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '@/components/layout/PortalLayout';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientList from './pages/PatientList';
import AccessRequests from './pages/AccessRequests';
import RiskPredictor from './pages/RiskPredictor';
import { NavigationItem } from '@/types';
import { 
  HomeIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const DoctorPortal: React.FC = () => {
  console.log('DoctorPortal component rendered');

  const navigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/doctor', 
      icon: HomeIcon
    },
    { 
      name: 'Patients', 
      href: '/doctor/patients', 
      icon: UsersIcon
    },
    { 
      name: 'Access Requests', 
      href: '/doctor/access-requests', 
      icon: ClipboardDocumentCheckIcon
    },
    { 
      name: 'Risk Assessment', 
      href: '/doctor/risk-predictor', 
      icon: ExclamationTriangleIcon
    }
  ];

  console.log('DoctorPortal navigation:', navigation);

  return (
    <PortalLayout navigation={navigation} title="Doctor Portal">
      <Routes>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="access-requests" element={<AccessRequests />} />
        <Route path="risk-predictor" element={<RiskPredictor />} />
        <Route path="*" element={<Navigate to="/doctor" replace />} />
      </Routes>
    </PortalLayout>
  );
};

export default DoctorPortal;
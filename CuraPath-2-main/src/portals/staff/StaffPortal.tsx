import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalLayout from '@/components/layout/PortalLayout';
import StaffDashboard from './pages/StaffDashboard';
import PatientEditor from './pages/PatientEditor';
import PrescriptionRequests from './pages/PrescriptionRequests';
import MonitoringTasks from './pages/MonitoringTasks';
import DataEntry from './pages/DataEntry';
import HospitalManagement from './pages/HospitalManagement';
import { NavigationItem } from '@/types';
import { 
  HomeIcon,
  PencilSquareIcon,
  BeakerIcon,
  ListBulletIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const StaffPortal: React.FC = () => {
  const navigation: NavigationItem[] = [
    { 
      name: 'Dashboard', 
      href: '/staff', 
      icon: HomeIcon
    },
    { 
      name: 'Hospital Management', 
      href: '/staff/hospital-management', 
      icon: UserGroupIcon
    },
    { 
      name: 'Patient Editor', 
      href: '/staff/patient-editor', 
      icon: PencilSquareIcon
    },
    { 
      name: 'Prescription Requests', 
      href: '/staff/prescription-requests', 
      icon: BeakerIcon
    },
    { 
      name: 'Data Entry', 
      href: '/staff/data-entry', 
      icon: ClipboardDocumentListIcon
    },
    { 
      name: 'Monitoring Tasks', 
      href: '/staff/monitoring-tasks', 
      icon: ListBulletIcon, 
      badge: 5
    }
  ];

  return (
    <PortalLayout navigation={navigation} title="Staff Portal">
      <Routes>
        <Route index element={<StaffDashboard />} />
        <Route path="hospital-management" element={<HospitalManagement />} />
        <Route path="patient-editor" element={<PatientEditor />} />
        <Route path="prescription-requests" element={<PrescriptionRequests />} />
        <Route path="data-entry" element={<DataEntry />} />
        <Route path="monitoring-tasks" element={<MonitoringTasks />} />
        <Route path="*" element={<Navigate to="/staff" replace />} />
      </Routes>
    </PortalLayout>
  );
};

export default StaffPortal;
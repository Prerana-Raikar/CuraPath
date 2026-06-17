import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import LoadingSpinner from './components/common/LoadingSpinner';
import { UserRole } from './types';

// Lazy load portal components for better performance
const DoctorPortal = lazy(() => import('./portals/doctor/DoctorPortal'));
const PatientPortal = lazy(() => import('./portals/patient/PatientPortal'));
const StaffPortal = lazy(() => import('./portals/staff/StaffPortal'));

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Route users to their respective portals based on role
  const getPortalRoute = () => {
    switch (user?.role) {
      case UserRole.DOCTOR:
        return '/doctor/*';
      case UserRole.PATIENT:
        return '/patient/*';
      case UserRole.STAFF:
        return '/staff/*';
      default:
        return '/login';
    }
  };

  const getDefaultRedirect = () => {
    switch (user?.role) {
      case UserRole.DOCTOR:
        return '/doctor';
      case UserRole.PATIENT:
        return '/patient';
      case UserRole.STAFF:
        return '/staff';
      default:
        return '/login';
    }
  };

  console.log('=== APP RENDER DEBUG ===');
  console.log('App render:', { user, isAuthenticated, isLoading, userRole: user?.role });
  console.log('Portal route:', getPortalRoute());
  console.log('Default redirect:', getDefaultRedirect());
  console.log('Should show login?', !isAuthenticated);
  console.log('================================');

  if (isLoading) {
    console.log('App is loading, showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-medical-50">
        <div className="text-center">
          <LoadingSpinner size="xl" variant="dots" />
          <p className="mt-4 text-gray-600 font-medium">Loading CuraPath...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, showing login form');
    console.log('Routing to /login');
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        {/* Patient portal routes - no authentication required */}
        <Route path="/patient/*" element={<PatientPortal />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Additional safety check - ensure user went through proper login flow
  if (!user || !user.id || !user.role) {
    console.log('User data incomplete, redirecting to login');
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  console.log('User authenticated, role:', user?.role);
  console.log('Default redirect:', getDefaultRedirect());

  // Loading fallback component
  const PortalLoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <LoadingSpinner size="large" variant="spinner" />
        <p className="mt-4 text-gray-600 font-medium">Loading portal...</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={<PortalLoadingFallback />}>
      <Routes>
        {/* Role-based portal routes */}
        {user?.role === UserRole.DOCTOR && (
          <Route path="/doctor/*" element={<DoctorPortal />} />
        )}
        {user?.role === UserRole.PATIENT && (
          <Route path="/patient/*" element={<PatientPortal />} />
        )}
        {user?.role === UserRole.STAFF && (
          <Route path="/staff/*" element={<StaffPortal />} />
        )}
        
        {/* Default redirect based on user role */}
        <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { NavigationItem } from '@/types';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ArrowRightOnRectangleIcon,
  HeartIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface PatientPortalLayoutProps {
  navigation: NavigationItem[];
  children: React.ReactNode;
  title: string;
}

interface PatientData {
  id: string;
  name: string;
  email: string;
  condition: string;
}

const PatientPortalLayout: React.FC<PatientPortalLayoutProps> = ({ navigation, children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId } = useParams();

  useEffect(() => {
    // Get patient data from localStorage
    const storedPatientData = localStorage.getItem('patient_data');
    if (storedPatientData) {
      try {
        const data = JSON.parse(storedPatientData);
        setPatientData(data);
      } catch (error) {
        console.error('Error parsing patient data:', error);
        navigate('/patient/login');
      }
    } else {
      navigate('/patient/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear patient data and redirect to login
    localStorage.removeItem('patient_data');
    localStorage.removeItem('patient_token');
    navigate('/patient/login');
  };

  const handleNavigationClick = (href: string) => {
    // Add patient ID to navigation URLs
    const fullHref = `${href}/${patientId}`;
    console.log('Navigation clicked:', fullHref);
    navigate(fullHref);
  };

  if (!patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex flex-shrink-0 items-center px-6 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3">
              <HeartIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
          
          <nav className="mt-6 flex-1 space-y-2 px-3">
            {navigation.map((item) => (
              <div
                key={item.name}
                onClick={() => handleNavigationClick(item.href)}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl w-full text-left cursor-pointer transition-all duration-200 ${
                  location.pathname.includes(item.href.replace('/patient/', ''))
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  location.pathname.includes(item.href.replace('/patient/', ''))
                    ? 'text-white'
                    : 'text-gray-500 group-hover:text-blue-600'
                }`} />
                {item.name}
                {item.badge && (
                  <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                    location.pathname.includes(item.href.replace('/patient/', ''))
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>
          
          {/* Patient profile */}
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {patientData.name}
                </p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-xl border-r border-gray-100">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex flex-shrink-0 items-center px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <HeartIcon className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                <p className="text-blue-100 text-sm">Medical Portal</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="mt-8 flex-1 space-y-2 px-4">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  onClick={() => handleNavigationClick(item.href)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-left cursor-pointer transition-all duration-200 ${
                    location.pathname.includes(item.href.replace('/patient/', ''))
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:shadow-md'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    location.pathname.includes(item.href.replace('/patient/', ''))
                      ? 'text-white'
                      : 'text-gray-500 group-hover:text-blue-600'
                  }`} />
                  {item.name}
                  {item.badge && (
                    <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                      location.pathname.includes(item.href.replace('/patient/', ''))
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Patient profile */}
          <div className="flex flex-shrink-0 border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {patientData.name}
                </p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-sm lg:hidden">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <HeartIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PatientPortalLayout;

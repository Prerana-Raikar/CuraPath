import React, { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Badge from '@/components/common/Badge';
import Alert from '@/components/common/Alert';
import { 
  HeartIcon,
  BeakerIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const MedicalUIShowcase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  const medicalMetrics = [
    { label: 'Active Patients', value: '1,247', change: '+12%', trend: 'up', color: 'primary' },
    { label: 'Critical Cases', value: '23', change: '-8%', trend: 'down', color: 'error' },
    { label: 'Appointments Today', value: '89', change: '+5%', trend: 'up', color: 'success' },
    { label: 'Lab Results Pending', value: '156', change: '+15%', trend: 'up', color: 'warning' }
  ];

  const patientData = [
    { id: 1, name: 'Sarah Johnson', condition: 'Diabetes Type 2', status: 'stable', lastVisit: '2024-01-15', risk: 'low' },
    { id: 2, name: 'Michael Chen', condition: 'Hypertension', status: 'monitoring', lastVisit: '2024-01-14', risk: 'medium' },
    { id: 3, name: 'Emily Davis', condition: 'Heart Disease', status: 'critical', lastVisit: '2024-01-13', risk: 'high' },
    { id: 4, name: 'Robert Wilson', condition: 'Asthma', status: 'stable', lastVisit: '2024-01-12', risk: 'low' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'stable': return <Badge variant="success">Stable</Badge>;
      case 'monitoring': return <Badge variant="warning">Monitoring</Badge>;
      case 'critical': return <Badge variant="danger">Critical</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return <span className="status-stable">Low Risk</span>;
      case 'medium': return <span className="status-monitoring">Medium Risk</span>;
      case 'high': return <span className="status-critical">High Risk</span>;
      default: return <span className="status-inactive">{risk}</span>;
    }
  };

  return (
    <div className="space-y-12 animate-medical-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold medical-text-gradient">
          Modern Medical UI Components
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          A comprehensive showcase of our premium medical-grade UI components designed for healthcare applications.
        </p>
      </div>

      {/* Medical Metrics Dashboard */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <ChartBarIcon className="h-8 w-8 text-primary-600" />
          Medical Metrics Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicalMetrics.map((metric, index) => (
            <Card 
              key={metric.label} 
              variant="interactive"
              className="metric-card hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center space-y-3">
                <div className="metric-value text-slate-800">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
                <div className={`flex items-center justify-center gap-1 text-sm font-semibold ${
                  metric.trend === 'up' ? 'text-success-600' : 'text-error-600'
                }`}>
                  <ArrowTrendingUpIcon className={`h-4 w-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  {metric.change}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Button Showcase */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <PlusIcon className="h-8 w-8 text-primary-600" />
          Medical Button System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Primary Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" fullWidth leftIcon={<PlusIcon className="h-5 w-5" />}>
                Add New Patient
              </Button>
              <Button variant="primary" size="lg" loading={loading} onClick={handleAsyncAction}>
                {loading ? 'Processing...' : 'Schedule Appointment'}
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Secondary Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" fullWidth leftIcon={<ClipboardDocumentCheckIcon className="h-5 w-5" />}>
                View Records
              </Button>
              <Button variant="outline" size="lg">
                Generate Report
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Status Actions</h3>
            <div className="space-y-3">
              <Button variant="success" fullWidth leftIcon={<CheckCircleIcon className="h-5 w-5" />}>
                Approve Treatment
              </Button>
              <Button variant="danger" size="lg" leftIcon={<ExclamationTriangleIcon className="h-5 w-5" />}>
                Emergency Alert
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <ClockIcon className="h-8 w-8 text-primary-600" />
          Medical Loading States
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Medical Spinner</h3>
            <LoadingSpinner variant="medical" size="large" />
            <p className="text-sm text-slate-600">Advanced medical spinner</p>
          </Card>

          <Card className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Pulse Animation</h3>
            <LoadingSpinner variant="pulse" size="large" color="success" />
            <p className="text-sm text-slate-600">Heartbeat-like pulse</p>
          </Card>

          <Card className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Dots Animation</h3>
            <LoadingSpinner variant="dots" size="large" color="primary" />
            <p className="text-sm text-slate-600">Smooth dots animation</p>
          </Card>

          <Card className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Classic Spinner</h3>
            <LoadingSpinner variant="spinner" size="large" color="warning" />
            <p className="text-sm text-slate-600">Traditional spinner</p>
          </Card>
        </div>
      </section>

      {/* Medical Alerts */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <InformationCircleIcon className="h-8 w-8 text-primary-600" />
          Medical Alert System
        </h2>
        <div className="space-y-4">
          <Alert variant="success" title="Treatment Completed Successfully">
            Patient's treatment plan has been completed. All vital signs are stable and within normal ranges.
          </Alert>
          <Alert variant="warning" title="Lab Results Require Attention">
            New lab results show elevated glucose levels. Please review and adjust treatment plan accordingly.
          </Alert>
          <Alert variant="danger" title="Critical Patient Alert">
            Patient in Room 302 requires immediate attention. Vital signs are showing concerning patterns.
          </Alert>
          <Alert variant="info" title="System Maintenance Scheduled">
            The medical records system will undergo maintenance tonight from 2:00 AM to 4:00 AM.
          </Alert>
        </div>
      </section>

      {/* Patient Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <UserGroupIcon className="h-8 w-8 text-primary-600" />
          Patient Management Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {patientData.map((patient, index) => (
            <Card 
              key={patient.id}
              variant="interactive"
              className={`hover-medical cursor-pointer transition-all duration-300 ${
                selectedCard === patient.id.toString() ? 'ring-2 ring-primary-500 shadow-medical' : ''
              }`}
              onClick={() => setSelectedCard(selectedCard === patient.id.toString() ? null : patient.id.toString())}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-800">{patient.name}</h3>
                    <p className="text-sm text-slate-600">{patient.condition}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartIcon className="h-5 w-5 text-primary-600" />
                    {getStatusBadge(patient.status)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarIcon className="h-4 w-4" />
                    Last visit: {patient.lastVisit}
                  </div>
                  {getRiskBadge(patient.risk)}
                </div>

                {selectedCard === patient.id.toString() && (
                  <div className="pt-4 border-t border-slate-200 animate-medical-slide-up">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="primary" size="sm" fullWidth>
                        View Details
                      </Button>
                      <Button variant="secondary" size="sm" fullWidth>
                        Schedule Visit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Glass Morphism Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <BeakerIcon className="h-8 w-8 text-primary-600" />
          Glass Morphism Effects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="glass" className="text-center space-y-4 hover-glow">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-xl">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Cardiology</h3>
            <p className="text-sm text-slate-600">Advanced cardiac care and monitoring</p>
          </Card>

          <Card variant="glass" className="text-center space-y-4 hover-glow">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-success-500 to-success-600 rounded-3xl flex items-center justify-center shadow-xl">
              <BeakerIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Laboratory</h3>
            <p className="text-sm text-slate-600">Comprehensive lab testing and analysis</p>
          </Card>

          <Card variant="glass" className="text-center space-y-4 hover-glow">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-warning-500 to-warning-600 rounded-3xl flex items-center justify-center shadow-xl">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Patient Care</h3>
            <p className="text-sm text-slate-600">Personalized patient management</p>
          </Card>
        </div>
      </section>

      {/* Performance Optimized Elements */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Performance Features</h2>
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Optimizations Included:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success-600" />
                GPU-accelerated transforms
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success-600" />
                Optimized CSS animations
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success-600" />
                Reduced motion support
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success-600" />
                Smooth 60fps animations
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success-600" />
                Accessibility-first design
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-success-600" />
                Medical-grade color schemes
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default MedicalUIShowcase;
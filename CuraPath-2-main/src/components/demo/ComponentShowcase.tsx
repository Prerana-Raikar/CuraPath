import React, { useState } from 'react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Alert from '@/components/common/Alert';
import ProgressBar from '@/components/common/ProgressBar';
import DataTable from '@/components/common/DataTable';
import Tabs from '@/components/common/Tabs';
import Dropdown from '@/components/common/Dropdown';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import AreaChart from '@/components/charts/AreaChart';
import VitalSignsChart from '@/components/medical/VitalSignsChart';
import LabResultsChart from '@/components/medical/LabResultsChart';
import { 
  SparklesIcon,
  ChartBarIcon,
  BeakerIcon,
  HeartIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const ComponentShowcase: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Sample data for charts
  const lineChartData = [
    { date: '2024-01-01', systolic: 120, diastolic: 80, heartRate: 72 },
    { date: '2024-01-02', systolic: 118, diastolic: 78, heartRate: 70 },
    { date: '2024-01-03', systolic: 122, diastolic: 82, heartRate: 75 },
    { date: '2024-01-04', systolic: 125, diastolic: 85, heartRate: 78 },
    { date: '2024-01-05', systolic: 119, diastolic: 79, heartRate: 73 }
  ];

  const barChartData = [
    { category: 'Normal', count: 45 },
    { category: 'High', count: 12 },
    { category: 'Critical', count: 3 }
  ];

  const pieChartData = [
    { name: 'Controlled', value: 65 },
    { name: 'Monitoring', value: 25 },
    { name: 'Critical', value: 10 }
  ];

  const areaChartData = [
    { month: 'Jan', patients: 150, visits: 420 },
    { month: 'Feb', patients: 165, visits: 450 },
    { month: 'Mar', patients: 180, visits: 380 },
    { month: 'Apr', patients: 175, visits: 520 },
    { month: 'May', patients: 190, visits: 580 }
  ];

  const tableData = [
    { id: 1, name: 'John Smith', condition: 'Diabetes', status: 'Stable', lastVisit: '2024-01-15' },
    { id: 2, name: 'Alice Johnson', condition: 'Hypertension', status: 'Monitoring', lastVisit: '2024-01-14' },
    { id: 3, name: 'Bob Wilson', condition: 'Heart Disease', status: 'Critical', lastVisit: '2024-01-13' }
  ];

  const tableColumns = [
    { key: 'name', label: 'Patient Name', sortable: true },
    { key: 'condition', label: 'Condition', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value: string) => (
        <Badge variant={value === 'Stable' ? 'success' : value === 'Monitoring' ? 'warning' : 'danger'}>
          {value}
        </Badge>
      )
    },
    { key: 'lastVisit', label: 'Last Visit', sortable: true }
  ];

  const vitalsData = [
    {
      date: '2024-01-10',
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      temperature: 98.6
    },
    {
      date: '2024-01-11',
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 78,
      heartRate: 70,
      temperature: 98.4
    },
    {
      date: '2024-01-12',
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 85,
      heartRate: 75,
      temperature: 98.8
    }
  ];

  const labResults = [
    {
      testName: 'Glucose',
      value: 95,
      normalMin: 70,
      normalMax: 100,
      unit: 'mg/dL',
      date: '2024-01-15',
      status: 'normal' as const
    },
    {
      testName: 'Cholesterol',
      value: 220,
      normalMin: 150,
      normalMax: 200,
      unit: 'mg/dL',
      date: '2024-01-15',
      status: 'high' as const
    },
    {
      testName: 'Hemoglobin',
      value: 14.2,
      normalMin: 12.0,
      normalMax: 16.0,
      unit: 'g/dL',
      date: '2024-01-15',
      status: 'normal' as const
    }
  ];

  const tabs = [
    {
      id: 'charts',
      label: 'Chart Components',
      icon: ChartBarIcon,
      content: (
        <div className="space-y-8">
          {/* Line Chart */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Line Chart - Vital Signs Trend</h4>
            <Card>
              <LineChart
                data={lineChartData}
                xKey="date"
                lines={[
                  { key: 'systolic', color: '#ef4444', name: 'Systolic BP' },
                  { key: 'diastolic', color: '#f97316', name: 'Diastolic BP' },
                  { key: 'heartRate', color: '#3b82f6', name: 'Heart Rate' }
                ]}
                height={300}
              />
            </Card>
          </div>

          {/* Bar Chart */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Bar Chart - Test Results Distribution</h4>
            <Card>
              <BarChart
                data={barChartData}
                xKey="category"
                bars={[
                  { key: 'count', color: '#10b981', name: 'Results Count' }
                ]}
                height={300}
              />
            </Card>
          </div>

          {/* Pie Chart */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Pie Chart - Patient Status Distribution</h4>
            <Card>
              <PieChart
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                colors={['#10b981', '#f59e0b', '#ef4444']}
                height={300}
              />
            </Card>
          </div>

          {/* Area Chart */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Area Chart - Monthly Trends</h4>
            <Card>
              <AreaChart
                data={areaChartData}
                xKey="month"
                areas={[
                  { key: 'patients', color: '#3b82f6', name: 'Patients' },
                  { key: 'visits', color: '#10b981', name: 'Visits' }
                ]}
                height={300}
              />
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'medical',
      label: 'Medical Components',
      icon: BeakerIcon,
      content: (
        <div className="space-y-8">
          {/* Vital Signs Chart */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Vital Signs Chart Component</h4>
            <VitalSignsChart data={vitalsData} height={350} />
          </div>

          {/* Lab Results Chart */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Lab Results Chart Component</h4>
            <LabResultsChart data={labResults} height={350} />
          </div>
        </div>
      )
    },
    {
      id: 'ui',
      label: 'UI Components',
      icon: PresentationChartLineIcon,
      content: (
        <div className="space-y-8">
          {/* Badges */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Badges</h4>
            <Card>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </Card>
          </div>

          {/* Progress Bars */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Progress Bars</h4>
            <Card>
              <div className="space-y-4">
                <ProgressBar value={75} label="Overall Health Score" showLabel color="green" />
                <ProgressBar value={60} label="Risk Assessment" showLabel color="yellow" />
                <ProgressBar value={90} label="Medication Compliance" showLabel color="blue" />
              </div>
            </Card>
          </div>

          {/* Alerts */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Alerts</h4>
            <div className="space-y-4">
              <Alert 
                variant="success" 
                title="Lab Results Available" 
                message="Your latest blood work results are now available for review."
                dismissible
                onDismiss={() => setActiveAlert(null)}
              />
              <Alert 
                variant="warning" 
                message="Please schedule your annual physical examination."
              />
              <Alert 
                variant="danger" 
                title="Critical Alert" 
                message="Immediate attention required for patient monitoring."
              />
              <Alert 
                variant="info" 
                message="System maintenance scheduled for tonight from 2-4 AM."
              />
            </div>
          </div>

          {/* Data Table */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Data Table with Search & Sort</h4>
            <DataTable
              data={tableData}
              columns={tableColumns}
              searchable
              searchPlaceholder="Search patients..."
            />
          </div>

          {/* Dropdown */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Dropdown Menu</h4>
            <Card>
              <Dropdown
                label="Patient Actions"
                items={[
                  { label: 'View Records', onClick: () => console.log('View records') },
                  { label: 'Schedule Appointment', onClick: () => console.log('Schedule') },
                  { label: 'Send Message', onClick: () => console.log('Message') },
                  { label: 'Generate Report', onClick: () => console.log('Report'), divider: true },
                  { label: 'Archive Patient', onClick: () => console.log('Archive'), disabled: true }
                ]}
              />
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <SparklesIcon className="h-8 w-8 text-primary-600 mr-3" />
          Component Showcase
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore our comprehensive library of data visualization and UI components
        </p>
      </div>

      {/* Component Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <ChartBarIcon className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Chart Components</h3>
            <p className="text-sm text-gray-500 mt-2">Line, Bar, Pie, and Area charts for data visualization</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <HeartIcon className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Medical Components</h3>
            <p className="text-sm text-gray-500 mt-2">Specialized components for medical data display</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <PresentationChartLineIcon className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">UI Components</h3>
            <p className="text-sm text-gray-500 mt-2">Reusable interface elements and controls</p>
          </div>
        </Card>
      </div>

      {/* Tabbed Component Display */}
      <Tabs tabs={tabs} defaultTab="charts" />
    </div>
  );
};

export default ComponentShowcase;
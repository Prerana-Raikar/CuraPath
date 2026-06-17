import React from 'react';
import LineChart from '@/components/charts/LineChart';
import Card from '@/components/common/Card';

interface VitalSignsData {
  date: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  weight?: number;
}

interface VitalSignsChartProps {
  data: VitalSignsData[];
  title?: string;
  height?: number;
}

const VitalSignsChart: React.FC<VitalSignsChartProps> = ({
  data,
  title = "Vital Signs Trend",
  height = 400
}) => {
  const chartLines = [
    { key: 'bloodPressureSystolic', color: '#ef4444', name: 'Systolic BP' },
    { key: 'bloodPressureDiastolic', color: '#f97316', name: 'Diastolic BP' },
    { key: 'heartRate', color: '#3b82f6', name: 'Heart Rate' },
    { key: 'temperature', color: '#10b981', name: 'Temperature' }
  ];

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">Track vital signs over time</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {data.length > 0 && (
          <>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-sm text-red-600 font-medium">Latest Systolic BP</div>
              <div className="text-2xl font-bold text-red-700">
                {data[data.length - 1]?.bloodPressureSystolic || '--'}
                <span className="text-sm text-red-500 ml-1">mmHg</span>
              </div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Latest Diastolic BP</div>
              <div className="text-2xl font-bold text-orange-700">
                {data[data.length - 1]?.bloodPressureDiastolic || '--'}
                <span className="text-sm text-orange-500 ml-1">mmHg</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Latest Heart Rate</div>
              <div className="text-2xl font-bold text-blue-700">
                {data[data.length - 1]?.heartRate || '--'}
                <span className="text-sm text-blue-500 ml-1">bpm</span>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Latest Temperature</div>
              <div className="text-2xl font-bold text-green-700">
                {data[data.length - 1]?.temperature || '--'}
                <span className="text-sm text-green-500 ml-1">°F</span>
              </div>
            </div>
          </>
        )}
      </div>

      {data.length > 0 ? (
        <LineChart
          data={data}
          xKey="date"
          lines={chartLines}
          height={height}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No vital signs data available</p>
        </div>
      )}
    </Card>
  );
};

export default VitalSignsChart;
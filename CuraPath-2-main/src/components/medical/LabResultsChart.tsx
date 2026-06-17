import React from 'react';
import BarChart from '@/components/charts/BarChart';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

interface LabResult {
  testName: string;
  value: number;
  normalMin: number;
  normalMax: number;
  unit: string;
  date: string;
  status: 'normal' | 'high' | 'low' | 'critical';
}

interface LabResultsChartProps {
  data: LabResult[];
  title?: string;
  height?: number;
}

const LabResultsChart: React.FC<LabResultsChartProps> = ({
  data,
  title = "Latest Lab Results",
  height = 400
}) => {
  const chartData = data.map(result => ({
    testName: result.testName,
    value: result.value,
    normalMin: result.normalMin,
    normalMax: result.normalMax
  }));

  const chartBars = [
    { key: 'value', color: '#3b82f6', name: 'Current Value' },
    { key: 'normalMin', color: '#e5e7eb', name: 'Normal Min' },
    { key: 'normalMax', color: '#d1d5db', name: 'Normal Max' }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      normal: 'success' as const,
      high: 'warning' as const,
      low: 'warning' as const,
      critical: 'danger' as const
    };
    return variants[status as keyof typeof variants] || 'default' as const;
  };

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">Latest laboratory test results</p>
      </div>

      {data.length > 0 ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {data.slice(0, 3).map((result, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{result.testName}</h4>
                  <Badge variant={getStatusBadge(result.status)} size="sm">
                    {result.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.value}
                  <span className="text-sm text-gray-500 ml-1">{result.unit}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Normal: {result.normalMin}-{result.normalMax} {result.unit}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <BarChart
            data={chartData}
            xKey="testName"
            bars={chartBars}
            height={height}
          />

          {/* Detailed Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Normal Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.testName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.value} {result.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.normalMin}-{result.normalMax} {result.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadge(result.status)} size="sm">
                        {result.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No lab results available</p>
        </div>
      )}
    </Card>
  );
};

export default LabResultsChart;
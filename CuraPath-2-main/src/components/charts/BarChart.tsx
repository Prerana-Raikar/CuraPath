import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: any[];
  xKey: string;
  bars: {
    key: string;
    color: string;
    name: string;
  }[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  layout?: 'horizontal' | 'vertical';
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  bars,
  height = 300,
  showGrid = true,
  showLegend = true,
  layout = 'vertical'
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        layout={layout}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={layout === 'vertical' ? xKey : undefined} type={layout === 'vertical' ? 'category' : 'number'} />
        <YAxis dataKey={layout === 'horizontal' ? xKey : undefined} type={layout === 'vertical' ? 'number' : 'category'} />
        <Tooltip />
        {showLegend && <Legend />}
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color}
            name={bar.name}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
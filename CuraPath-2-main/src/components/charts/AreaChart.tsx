import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AreaChartProps {
  data: any[];
  xKey: string;
  areas: {
    key: string;
    color: string;
    name: string;
  }[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xKey,
  areas,
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {areas.map((area, index) => (
            <linearGradient key={area.key} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={area.color} stopOpacity={0.1}/>
            </linearGradient>
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        {showLegend && <Legend />}
        {areas.map((area, index) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            stackId={stacked ? "1" : area.key}
            stroke={area.color}
            fill={`url(#colorGradient${index})`}
            name={area.name}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;
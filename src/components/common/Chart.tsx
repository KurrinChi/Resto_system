import React from 'react';

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'donut';
  data: any[];
  height?: number;
  className?: string;
}

export const Chart: React.FC<ChartProps> = ({
  type,
  height = 300,
  className = '',
}) => {
  // Placeholder - you'll integrate with recharts or another library
  return (
    <div className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`} style={{ height }}>
      <div className="text-center text-gray-400">
        <p className="font-medium">{type.toUpperCase()} Chart Placeholder</p>
        <p className="text-sm mt-1">Integrate with Recharts library</p>
      </div>
    </div>
  );
};

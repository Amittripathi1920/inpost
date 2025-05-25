import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";

export function PostLengthDistribution({ 
  lengthData, 
  themeColor 
}: { 
  lengthData: { name: string; count: number; id?: string }[];
  themeColor: string;
}) {
  // Generate different colors based on the theme color
  const getColorArray = (baseColor: string, count: number) => {
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Generate array of colors with different brightness
    return Array.from({ length: count }, (_, i) => {
      const factor = 0.7 + (i * 0.15); // Adjust brightness
      const newR = Math.min(255, Math.floor(r * factor));
      const newG = Math.min(255, Math.floor(g * factor));
      const newB = Math.min(255, Math.floor(b * factor));
      
      return `rgb(${newR}, ${newG}, ${newB})`;
    });
  };

  const colors = getColorArray(themeColor, lengthData.length);

  // Calculate total for percentage
  const total = lengthData.reduce((sum, item) => sum + item.count, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.count / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-sm">
          <p className="font-medium">{data.name}</p>
          <p>{`${data.count} posts (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      {lengthData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={lengthData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Posts" 
              radius={[4, 4, 0, 0]}
              animationDuration={500}
              maxBarSize={60}
            >
              {lengthData.map((entry, index) => (
                <Cell key={`cell-${entry.id || index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
}
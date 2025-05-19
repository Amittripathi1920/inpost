import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ToneAnalysisProps {
  toneData: { name: string; count: number; id?: string }[];
  themeColor: string;
}

export function ToneAnalysis({ toneData, themeColor }: ToneAnalysisProps) {
  // Generate different colors based on the theme color
  const getColorArray = (baseColor: string, count: number) => {
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Generate array of colors with different brightness
    return Array.from({ length: count }, (_, i) => {
      const factor = 0.6 + (i * 0.1); // Adjust brightness
      const newR = Math.min(255, Math.floor(r * factor));
      const newG = Math.min(255, Math.floor(g * factor));
      const newB = Math.min(255, Math.floor(b * factor));
      
      return `rgb(${newR}, ${newG}, ${newB})`;
    });
  };

  const colors = getColorArray(themeColor, toneData.length || 1);

  return (
    <div className="h-[300px] w-full">
      {toneData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={toneData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill={themeColor}
              dataKey="count"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              // Remove any animation property or set it correctly
              // animationDuration={500} // Use this instead if you want animation
            >
              {toneData.map((entry, index) => (
                <Cell key={`cell-${entry.id || index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} posts`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
}
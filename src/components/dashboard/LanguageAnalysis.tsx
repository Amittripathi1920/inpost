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

interface LanguageAnalysisProps {
  languageData: { name: string; count: number }[];
  themeColor: string;
}

export function LanguageAnalysis({ 
  languageData, 
  themeColor 
}: { 
  languageData: { name: string; count: number; id?: string }[];
  themeColor: string;
}) {
  // Generate different colors based on the theme color
  const getColorArray = (baseColor: string, count: number) => {
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Generate array of colors with different brightness
    return Array.from({ length: count || 1 }, (_, i) => {
      const factor = 0.5 + (i * 0.15); // Adjust brightness
      const newR = Math.min(255, Math.floor(r * factor));
      const newG = Math.min(255, Math.floor(g * factor));
      const newB = Math.min(255, Math.floor(b * factor));
      
      return `rgb(${newR}, ${newG}, ${newB})`;
    });
  };
  
  const colors = getColorArray(themeColor, languageData.length);
  
  return (
    <div className="h-[300px] w-full">
      {languageData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={languageData} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip formatter={(value) => [`${value} posts`, 'Count']} />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Posts" 
              radius={[0, 4, 4, 0]}
              // Remove animation property or set it correctly
              animationDuration={500}
            >
              {languageData.map((entry, index) => (
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
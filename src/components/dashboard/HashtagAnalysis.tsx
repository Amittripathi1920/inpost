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
import { cn } from "@/lib/utils";

interface HashtagAnalysisProps {
  hashtagData: { tag: string; count: number; id?: string }[];
  themeColor: string;
  className?: string;
}

export function HashtagAnalysis({ 
  hashtagData, 
  themeColor,
  className 
}: HashtagAnalysisProps) {
  // Generate different colors based on the theme color
  const getColorArray = (baseColor: string, count: number) => {
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Generate array of colors with different brightness
    return Array.from({ length: count || 1 }, (_, i) => {
      const factor = 0.7 + (i * 0.1); // Adjust brightness
      const newR = Math.min(255, Math.floor(r * factor));
      const newG = Math.min(255, Math.floor(g * factor));
      const newB = Math.min(255, Math.floor(b * factor));
      
      return `rgb(${newR}, ${newG}, ${newB})`;
    });
  };

  const colors = getColorArray(themeColor, hashtagData.length);

  return (
    <div className={cn("h-[300px] w-full", className)}>
      {hashtagData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hashtagData}>
            <XAxis dataKey="tag" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} occurrences`, 'Count']} />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Occurrences" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              // Remove animation property or set it correctly
              animationDuration={500}
            >
              {hashtagData.map((entry, index) => (
                <Cell key={`cell-${entry.id || index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No hashtags found</p>
        </div>
      )}
    </div>
  );
}
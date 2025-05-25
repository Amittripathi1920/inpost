import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useChartAnimation } from "@/hooks/useChartAnimation";

interface ToneAnalysisProps {
  toneData: { name: string; count: number }[];
  themeColor: string;
  className?: string;
}

export const ToneAnalysis: React.FC<ToneAnalysisProps> = ({
  toneData,
  themeColor,
  className
}) => {
  const animationProps = useChartAnimation(toneData);

  if (!toneData || toneData.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No tone data available</p>
      </div>
    );
  }

  // Generate colors for pie slices
  const generateColors = (baseColor: string, count: number) => {
    const colors = [];
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    for (let i = 0; i < count; i++) {
      const factor = 0.8 + (i * 0.4) / count;
      const newR = Math.min(255, Math.floor(r * factor));
      const newG = Math.min(255, Math.floor(g * factor));
      const newB = Math.min(255, Math.floor(b * factor));
      colors.push(`rgb(${newR}, ${newG}, ${newB})`);
    }
    return colors;
  };

  const colors = generateColors(themeColor, toneData.length);

  return (
    <div className={`h-[300px] w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={toneData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="count"
            {...animationProps}
          >
            {toneData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";

export function TopicDistribution({ 
  topicCounts, 
  themeColor, 
  rgbToHsl 
}: { 
  topicCounts: { name: string; count: number; id?: string }[];
  themeColor: string;
  rgbToHsl: (r: number, g: number, b: number) => [number, number, number];
}) {
  // Generate different colors based on the theme color
  const getColorArray = (baseColor: string, count: number) => {
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Convert to HSL
    const [h, s, l] = rgbToHsl(r, g, b);
    
    // Generate array of colors with different lightness
    return Array.from({ length: count || 1 }, (_, i) => {
      // Adjust lightness for each segment
      const newL = Math.max(35, Math.min(65, l - (i * 3)));
      
      // Convert back to hex
      return `hsl(${h}, ${s}%, ${newL}%)`;
    });
  };

  // Sort data by count in descending order and take top 6
  // Limiting to 6 to ensure enough vertical space for each bar
  const sortedData = [...topicCounts]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const colors = getColorArray(themeColor, sortedData.length);

  // Calculate total for percentage
  const total = topicCounts.reduce((sum, item) => sum + item.count, 0);

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
      {sortedData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120}
                tick={{ 
                  fontSize: 11,
                  width: 110,
                  style: {
                    wordBreak: 'break-word'
                  }
                }}
                tickFormatter={(value) => {
                  return value.length > 15 ? value.substring(0, 13) + '...' : value;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                name="Posts" 
                radius={[0, 4, 4, 0]}
                animationDuration={500}
              >
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${entry.id || index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
                <LabelList 
                  dataKey="count" 
                  position="right" 
                  style={{ fontSize: '12px', fill: '#666' }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Show "Others" category if there are more topics */}
          {topicCounts.length > 6 && (
            <div className="text-xs text-muted-foreground text-center">
              + {topicCounts.length - 6} more topics not shown
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
}
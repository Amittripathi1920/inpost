import { cn } from "@/lib/utils";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

interface TopicTrend {
  month: string;
  [key: string]: string | number; // For dynamic topic keys
}

interface TopicTrendsChartProps {
  data: TopicTrend[];
  themeColor: string;
  className?: string; // Responsive sizing
}

export const TopicTrendsChart: React.FC<TopicTrendsChartProps> = ({
  data, 
  themeColor,
  className
}) => {
  // If no data, return early
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No topic trend data available</p>
      </div>
    );
  }

  // Extract all unique topics from the data
  const allTopics = new Set<string>();
  data.forEach(monthData => {
    Object.keys(monthData).forEach(key => {
      if (key !== 'month') {
        allTopics.add(key);
      }
    });
  });

  // Get top 5 topics by total count across all months
  const topTopics = Array.from(allTopics)
    .map(topic => ({
      topic,
      total: data.reduce((sum, month) => sum + (Number(month[topic]) || 0), 0)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(item => item.topic);

  // Generate colors based on the theme color
  const getColor = (index: number, baseColor: string) => {
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Adjust hue for different colors
    const hueShift = index * 40; // degrees
    const h = (Math.atan2(b - 128, r - 128) * 180 / Math.PI + 180 + hueShift) % 360;
    const s = Math.sqrt((r - 128) * (r - 128) + (b - 128) * (b - 128)) / 128 * 100;
    const l = (r + g + b) / 3 / 255 * 100;
    
    return `hsl(${h}, ${Math.min(100, s + 30)}%, ${Math.min(60, l + 20)}%)`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm text-sm">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}: {entry.value} posts</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer 
      width="100%" 
      height={300} 
      className={cn(
        "w-full h-[250px] md:h-[350px]", 
        className
      )}
    >
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {topTopics.map((topic, index) => (
          <Line
            key={topic}
            type="monotone"
            dataKey={topic}
            name={topic}
            stroke={getColor(index, themeColor)}
            activeDot={{ r: 6 }}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
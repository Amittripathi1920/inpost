import React from "react";
import { Card } from "@/components/ui/card";

interface HeatmapData {
  day: number;
  hour: number;
  value: number;
}

interface ActivityHeatmapChartProps {
  data: HeatmapData[];
  themeColor: string;
}

export function ActivityHeatmapChart({ 
  data, 
  themeColor 
}: ActivityHeatmapChartProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // If no data, return early with placeholder
  if (!data || data.length === 0) {
    // Generate sample data for demonstration
    const sampleData: HeatmapData[] = [];
    
    // Add some random activity patterns
    for (let day = 0; day < 7; day++) {
      for (let hour = 9; hour < 18; hour++) {
        if (day < 5) { // Weekdays have more activity
          sampleData.push({
            day,
            hour,
            value: Math.floor(Math.random() * 5) // 0-4 posts
          });
        } else { // Weekends have less activity
          if (Math.random() > 0.7) { // Only 30% chance of weekend posts
            sampleData.push({
              day,
              hour,
              value: Math.floor(Math.random() * 2) // 0-1 posts
            });
          }
        }
      }
    }
    
    data = sampleData;
  }
  
  // Find max value for color scaling
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  // Convert hex to RGB for the theme color
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const baseColor = hexToRgb(themeColor);
  
  // Get color for a cell based on its value
  const getCellColor = (value: number) => {
    if (value === 0) return '#f9fafb'; // Very light gray for zero
    
    const intensity = value / maxValue;
    return `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${intensity * 0.8 + 0.2})`;
  };
  
  // Get cell data for a specific day and hour
  const getCellData = (day: number, hour: number) => {
    return data.find(d => d.day === day && d.hour === hour) || { day, hour, value: 0 };
  };

  return (
    <div className="h-[300px] w-full overflow-auto">
      <div className="min-w-[600px]">
        {/* Hour labels (top) */}
        <div className="flex">
          <div className="w-12"></div> {/* Empty corner cell */}
          {hours.map(hour => (
            <div key={`hour-${hour}`} className="w-8 text-center text-xs text-muted-foreground">
              {hour}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        {days.map((day, dayIndex) => (
          <div key={`day-${dayIndex}`} className="flex items-center">
            {/* Day label */}
            <div className="w-12 text-xs font-medium">{day}</div>
            
            {/* Hour cells */}
            {hours.map(hour => {
              const cellData = getCellData(dayIndex, hour);
              return (
                <div 
                  key={`cell-${dayIndex}-${hour}`}
                  className="w-8 h-8 m-px rounded-sm flex items-center justify-center text-xs transition-colors"
                  style={{ 
                    backgroundColor: getCellColor(cellData.value),
                    color: cellData.value > maxValue * 0.7 ? 'white' : 'black'
                  }}
                  title={`${day} ${hour}:00 - ${cellData.value} posts`}
                >
                  {cellData.value > 0 ? cellData.value : ''}
                </div>
              );
            })}
          </div>
        ))}
        
        <div className="text-xs text-center text-muted-foreground mt-4">
          Sample data - Actual activity patterns coming soon
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { useChartAnimation } from "@/hooks/useChartAnimation";

interface ActivityHeatmapProps {
  data?: any[];
  themeColor: string;
  posts?: any[]; // Real posts data
}

interface HeatmapData {
  day: string;
  dayIndex: number;
  hour: number;
  value: number;
  date: string;
}

export const ActivityHeatmapChart: React.FC<ActivityHeatmapProps> = ({ 
  data = [], 
  themeColor,
  posts = []
}) => {
  const animation = useChartAnimation(data);

  // Process real posts data into heatmap format
  const processPostsData = (): HeatmapData[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const activityMap = new Map<string, number>();

    // Initialize all slots with 0
    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        const key = `${dayIndex}-${hour}`;
        activityMap.set(key, 0);
      });
    });

    // Process real posts data
    posts.forEach(post => {
      const date = new Date(post.created_at);
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hour = date.getHours();
      const key = `${dayIndex}-${hour}`;
      
      activityMap.set(key, (activityMap.get(key) || 0) + 1);
    });

    // Convert to array format
    const heatmapData: HeatmapData[] = [];
    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        const key = `${dayIndex}-${hour}`;
        const value = activityMap.get(key) || 0;
        
        heatmapData.push({
          day,
          dayIndex,
          hour,
          value,
          date: `${day} ${hour.toString().padStart(2, '0')}:00`
        });
      });
    });

    return heatmapData;
  };

  // Generate sample data for demo purposes
  const generateSampleData = (): HeatmapData[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const heatmapData: HeatmapData[] = [];

    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        let value = 0;
        
        // Realistic patterns: higher activity during work hours on weekdays
        if (dayIndex >= 1 && dayIndex <= 5) { // Monday to Friday
          if (hour >= 9 && hour <= 17) {
            value = Math.floor(Math.random() * 8) + 2; // 2-9 posts
          } else if (hour >= 18 && hour <= 22) {
            value = Math.floor(Math.random() * 5) + 1; // 1-5 posts
          } else {
            value = Math.floor(Math.random() * 2); // 0-1 posts
          }
        } else { // Weekend
          if (hour >= 10 && hour <= 20) {
            value = Math.floor(Math.random() * 4) + 1; // 1-4 posts
          } else {
            value = Math.floor(Math.random() * 2); // 0-1 posts
          }
        }

        heatmapData.push({
          day,
          dayIndex,
          hour,
          value,
          date: `${day} ${hour.toString().padStart(2, '0')}:00`
        });
      });
    });

    return heatmapData;
  };

  const heatmapData = posts.length > 0 ? processPostsData() : generateSampleData();
  const maxValue = Math.max(...heatmapData.map(d => d.value), 1); // Ensure maxValue is at least 1

  // Get color intensity based on value
  const getColorIntensity = (value: number): string => {
    if (value === 0) {
      return '#f3f4f6'; // Light gray for no activity
    }
    
    const intensity = Math.min(value / maxValue, 1); // Ensure intensity doesn't exceed 1
    
    // Convert hex color to RGB
    const hex = themeColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${0.2 + intensity * 0.8})`;
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Calculate summary statistics
  const totalPosts = heatmapData.reduce((sum, d) => sum + d.value, 0);
  const avgPostsPerDay = totalPosts / 7;
  const peakHour = heatmapData.reduce((peak, current) => 
    current.value > peak.value ? current : peak
  );

  // Group data by day for easier rendering
  const dataByDay = days.map((day, dayIndex) => ({
    day,
    dayIndex,
    hours: heatmapData.filter(d => d.dayIndex === dayIndex)
  }));

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header */}
      <div>
        <p className="text-xs text-gray-500">
          {posts.length > 0 
            ? `Based on ${posts.length} posts` 
            : "Sample data showing typical posting patterns"
          }
        </p>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, index) => (
            <div
              key={index}
              className="w-2.5 h-2.5 rounded-sm border border-gray-200"
              style={{
                backgroundColor: intensity === 0 
                  ? '#f3f4f6' 
                  : `rgba(${parseInt(themeColor.slice(1, 3), 16)}, ${parseInt(themeColor.slice(3, 5), 16)}, ${parseInt(themeColor.slice(5, 7), 16)}, ${0.2 + intensity * 0.8})`
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
      
      {/* Heatmap */}
      <div className="space-y-2">
        {/* Hour labels */}
        <div className="flex items-center">
          <div className="w-8"></div> {/* Space for day labels */}
          <div className="flex-1 flex justify-between text-xs text-gray-500 px-1">
            {[0, 6, 12, 18].map(hour => (
              <span key={hour} className="text-center">
                {hour}:00
              </span>
            ))}
          </div>
        </div>
        
        {/* Heatmap rows */}
        <div className="space-y-1">
          {dataByDay.map((dayData) => (
            <div key={dayData.day} className="flex items-center gap-1">
              {/* Day label */}
              <div className="w-8 text-xs text-gray-500 text-right pr-2">
                {dayData.day}
              </div>
              
              {/* Hour cells */}
              <div className="flex-1 flex gap-0.5">
                {dayData.hours.map((cell) => (
                  <div
                    key={`${cell.dayIndex}-${cell.hour}`}
                    className="flex-1 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:border hover:border-gray-600 relative group"
                    style={{
                      backgroundColor: getColorIntensity(cell.value),
                      minWidth: '8px'
                    }}
                    title={`${cell.date}: ${cell.value} posts`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      {cell.date}: {cell.value} posts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">{totalPosts}</div>
          <div className="text-xs text-gray-500">Total Posts</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">{avgPostsPerDay.toFixed(1)}</div>
          <div className="text-xs text-gray-500">Avg/Day</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">{peakHour.hour}:00</div>
          <div className="text-xs text-gray-500">Peak Hour</div>
        </div>
      </div>
    </div>
  );
};

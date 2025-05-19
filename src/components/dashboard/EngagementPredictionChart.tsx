import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from "recharts";

interface EngagementFactor {
  factor: string;
  value: number;
  fullMark: number;
}

interface EngagementPredictionChartProps {
  data: EngagementFactor[];
  themeColor: string;
}

export function EngagementPredictionChart({ 
  data, 
  themeColor 
}: EngagementPredictionChartProps) {
  // If no data, return early with placeholder
  if (!data || data.length === 0) {
    // Generate sample data for demonstration
    const sampleData: EngagementFactor[] = [
      { factor: "Post Length", value: 80, fullMark: 100 },
      { factor: "Hashtag Usage", value: 65, fullMark: 100 },
      { factor: "Topic Relevance", value: 90, fullMark: 100 },
      { factor: "Post Frequency", value: 40, fullMark: 100 },
      { factor: "Time of Day", value: 70, fullMark: 100 },
      { factor: "Media Usage", value: 30, fullMark: 100 },
    ];
    
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sampleData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="factor" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Engagement Potential"
              dataKey="value"
              stroke={themeColor}
              fill={themeColor}
              fillOpacity={0.5}
            />
            <Tooltip formatter={(value) => [`${value}%`, 'Potential']} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="text-xs text-center text-muted-foreground mt-2">
          Sample data - Actual engagement predictions coming soon
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="factor" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Engagement Potential"
            dataKey="value"
            stroke={themeColor}
            fill={themeColor}
            fillOpacity={0.5}
          />
          <Tooltip formatter={(value) => [`${value}%`, 'Potential']} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
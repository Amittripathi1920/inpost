import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function PostsByMonthChart({ 
  postsByMonth, 
  themeColor 
}: { 
  postsByMonth: { name: string; count: number }[];
  themeColor: string;
}) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-sm">
          <p className="font-medium">{label}</p>
          <p>{`${payload[0].value} posts`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      {postsByMonth.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={postsByMonth}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke={themeColor} 
              fill={`${themeColor}40`} // 40 is for 25% opacity
              name="Posts"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )}
    </div>
  );
}
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area
} from "recharts";

// Update PostsByMonthChart to use the theme color
export function PostsByMonthChart({ 
  postsByMonth, 
  themeColor 
}: { 
  postsByMonth: { name: string; count: number; id?: string }[];
  themeColor: string;
}) {
  return (
    <div className="h-[300px] w-full">
      {postsByMonth.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={postsByMonth}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={themeColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} posts`, 'Count']} />
            <Area 
              type="monotone" 
              dataKey="count" 
              name="Posts" 
              stroke={themeColor} 
              fillOpacity={1} 
              fill="url(#colorCount)" 
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
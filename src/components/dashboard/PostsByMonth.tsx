import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartAnimation } from "@/hooks/useChartAnimation";

interface PostsByMonthChartProps {
  postsByMonth: { name: string; count: number }[];
  themeColor: string;
  className?: string;
}

export const PostsByMonthChart: React.FC<PostsByMonthChartProps> = ({
  postsByMonth,
  themeColor,
  className
}) => {
  const animationProps = useChartAnimation(postsByMonth);

  if (!postsByMonth || postsByMonth.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No monthly data available</p>
      </div>
    );
  }

  return (
    <div className={`h-[300px] w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={postsByMonth}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="15%" // Fixed gap between bars
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Bar 
            dataKey="count" 
            fill={themeColor}
            radius={[4, 4, 0, 0]}
            maxBarSize={50} // Fixed maximum bar width
            {...animationProps}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
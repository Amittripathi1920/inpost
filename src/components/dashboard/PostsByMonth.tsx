import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartAnimation } from "@/hooks/useChartAnimation";

interface PostsByMonthProps {
  postsByMonth: { name: string; count: number }[];
  themeColor: string;
}

export function PostsByMonthChart({ postsByMonth, themeColor }: PostsByMonthProps) {
  const animation = useChartAnimation(postsByMonth);
  
  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="card-title">Posts by Month</CardTitle>
        <CardDescription className="card-description">Trend of post generation over time</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {postsByMonth.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={postsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  padding: '8px 12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={themeColor} 
                strokeWidth={2}
                dot={{ r: 4, fill: themeColor, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: themeColor, strokeWidth: 0 }}
                {...animation}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
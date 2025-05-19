import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartAnimation } from "@/hooks/useChartAnimation";

interface PostLengthDistributionProps {
  lengthData: { name: string; count: number }[];
  themeColor: string;
}

export function PostLengthDistribution({ lengthData, themeColor }: PostLengthDistributionProps) {
  const animation = useChartAnimation(lengthData);
  
  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="card-title">Post Length Distribution</CardTitle>
        <CardDescription className="card-description">Distribution of your posts by length categories</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {lengthData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lengthData}>
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
              <Bar 
                dataKey="count" 
                fill={themeColor} 
                radius={[4, 4, 0, 0]}
                {...animation}
              />
            </BarChart>
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
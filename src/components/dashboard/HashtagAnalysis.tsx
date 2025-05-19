import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartAnimation } from "@/hooks/useChartAnimation";
import { cn } from "@/lib/utils";

interface HashtagAnalysisProps {
  hashtagData: { tag: string; count: number }[];
  themeColor: string;
  className?: string;
}

export function HashtagAnalysis({ hashtagData, themeColor, className }: HashtagAnalysisProps) {
  const animation = useChartAnimation(hashtagData);
  
  return (
    <Card className={cn("chart-container", className)}>
      <CardHeader>
        <CardTitle className="card-title">Top Hashtags</CardTitle>
        <CardDescription className="card-description">Most frequently used hashtags in your posts</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {hashtagData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={hashtagData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                type="number"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
              />
              <YAxis 
                type="category" 
                dataKey="tag" 
                width={120}
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
                formatter={(value) => [`${value} posts`, 'Count']}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="count" fill={themeColor} radius={[0, 4, 4, 0]} {...animation} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No hashtags found in your posts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
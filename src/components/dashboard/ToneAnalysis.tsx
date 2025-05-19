import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartAnimation } from "@/hooks/useChartAnimation";

interface ToneAnalysisProps {
  toneData: { name: string; count: number }[];
  themeColor: string;
}

export function ToneAnalysis({ toneData, themeColor }: ToneAnalysisProps) {
  const animation = useChartAnimation(toneData);
  
  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="card-title">Tone Analysis</CardTitle>
        <CardDescription className="card-description">Distribution of tones used in your posts</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {toneData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={toneData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                type="number"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
                width={100}
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
                radius={[0, 4, 4, 0]}
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
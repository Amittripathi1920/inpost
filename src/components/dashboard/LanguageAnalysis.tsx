import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useChartAnimation } from "@/hooks/useChartAnimation";

interface LanguageAnalysisProps {
  languageData: { name: string; count: number }[];
  themeColor: string;
}

export function LanguageAnalysis({ languageData, themeColor }: LanguageAnalysisProps) {
  const animation = useChartAnimation(languageData);
  
  // Generate colors with different opacity levels
  const generateColors = (baseColor: string, count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const opacity = 1 - (i * 0.7) / count;
      colors.push(`${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
    }
    return colors;
  };
  
  const colors = generateColors(themeColor, languageData.length);
  
  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="card-title">Language Distribution</CardTitle>
        <CardDescription className="card-description">Languages used in your posts</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {languageData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="name"
                {...animation}
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  padding: '8px 12px'
                }}
              />
              <Legend />
            </PieChart>
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
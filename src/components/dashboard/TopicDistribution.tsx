import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useChartAnimation } from "@/hooks/useChartAnimation";

interface TopicDistributionProps {
  topicCounts: { name: string; count: number }[];
  themeColor: string;
  rgbToHsl: (r: number, g: number, b: number) => [number, number, number];
}

export function TopicDistribution({ topicCounts, themeColor, rgbToHsl }: TopicDistributionProps) {
  const animation = useChartAnimation(topicCounts);
  
  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="card-title">Topics Distribution</CardTitle>
        <CardDescription className="card-description">Frequency of topics used in your posts</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {topicCounts.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topicCounts.slice(0, 6)}
                cx="50%"
                cy="50%"
                labelLine
                outerRadius={80}
                fill={themeColor}
                dataKey="count"
                nameKey="name"
                label={(entry) => entry.name}
                {...animation}
              >
                {topicCounts.slice(0, 6).map((_, index) => {
                  // Generate color variations by shifting hue
                  const hueRotate = index * 20;
                  const base = document.createElement("div");
                  base.style.color = themeColor;
                  document.body.appendChild(base);
                  const rgb = getComputedStyle(base).color;
                  document.body.removeChild(base);
                
                  const match = rgb.match(/\d+/g);
                  const [r, g, b] = match ? match.map(Number) : [136, 132, 216]; // fallback to default
                  const hsl = rgbToHsl(r, g, b);
                  hsl[0] = (hsl[0] + hueRotate) % 360;
                  const color = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
                
                  return <Cell key={`cell-${index}`} fill={color} />;
                })} 
              </Pie>
              <Tooltip />
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
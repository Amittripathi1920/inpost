import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "./MetricCard";
import { FileTextIcon, HashIcon, TrendingUpIcon } from "lucide-react";

interface DashboardSummaryProps {
  totalPosts: number;
  topicsCount: number;
  mostCommonTopic: string;
  // Optional trend data
  postsTrend?: number;
}

export function DashboardSummary({ 
  totalPosts, 
  topicsCount, 
  mostCommonTopic,
  postsTrend = 0
}: DashboardSummaryProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="card-title">Posts Summary</CardTitle>
        <CardDescription className="card-description">Overview of your LinkedIn post generation activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Total Posts"
            value={totalPosts}
            icon={FileTextIcon}
            trend={postsTrend !== 0 ? { value: postsTrend, isPositive: postsTrend > 0 } : undefined}
          />
          <MetricCard
            title="Topics Used"
            value={topicsCount}
            icon={HashIcon}
          />
          <MetricCard
            title="Most Common Topic"
            value={mostCommonTopic}
            icon={TrendingUpIcon}
          />
        </div>
      </CardContent>
    </Card>
  );
}
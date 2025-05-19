import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  TrendingUpIcon,
  ListIcon,
  FilterIcon,
} from "lucide-react";

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export function DashboardHeader({
  activeTab,
  setActiveTab,
  showFilters,
  setShowFilters,
}: DashboardHeaderProps) {
  return (
    <div className="md:hidden space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1"
        >
          <FilterIcon className="h-4 w-4" />
          Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant={activeTab === "overview" ? "default" : "outline"}
          className="flex flex-col items-center justify-center h-16 p-1"
          onClick={() => setActiveTab("overview")}
        >
          <LayoutDashboardIcon className="h-4 w-4 mb-1" />
          <span className="text-xs">Overview</span>
        </Button>
        <Button
          variant={activeTab === "content" ? "default" : "outline"}
          className="flex flex-col items-center justify-center h-16 p-1"
          onClick={() => setActiveTab("content")}
        >
          <FileTextIcon className="h-4 w-4 mb-1" />
          <span className="text-xs">Content</span>
        </Button>
        <Button
          variant={activeTab === "trends" ? "default" : "outline"}
          className="flex flex-col items-center justify-center h-16 p-1"
          onClick={() => setActiveTab("trends")}
        >
          <TrendingUpIcon className="h-4 w-4 mb-1" />
          <span className="text-xs">Trends</span>
        </Button>
        <Button
          variant={activeTab === "posts" ? "default" : "outline"}
          className="flex flex-col items-center justify-center h-16 p-1"
          onClick={() => setActiveTab("posts")}
        >
          <ListIcon className="h-4 w-4 mb-1" />
          <span className="text-xs">Posts</span>
        </Button>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Filter, Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterPanel } from "./FilterPanel";

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  dateRange?: any;
  setDateRange?: any;
  filters?: any;
  setFilters?: any;
  resetFilters?: () => void;
  filterOptions?: any;
}

export function DashboardHeader({
  activeTab,
  setActiveTab,
  showFilters,
  setShowFilters,
  dateRange,
  setDateRange,
  filters,
  setFilters,
  resetFilters,
  filterOptions = { topics: [], lengths: [], tones: [], languages: [] }
}: DashboardHeaderProps) {
  return (
    <div className="md:hidden border-b p-4 flex justify-between items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowFilters(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <h1 className="text-lg font-semibold">
        {activeTab === "overview" && "Dashboard"}
        {activeTab === "content" && "Content Analysis"}
        {activeTab === "trends" && "Trends"}
        {activeTab === "posts" && "All Posts"}
      </h1>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <h3 className="font-medium">Filter Posts</h3>
            
            {dateRange && setDateRange && filters && setFilters && resetFilters && (
              <>
                <FilterPanel
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  filters={filters}
                  setFilters={setFilters}
                  resetFilters={resetFilters}
                  topicOptions={filterOptions.topics}
                  lengthOptions={filterOptions.lengths}
                  toneOptions={filterOptions.tones}
                  languageOptions={filterOptions.languages}
                />
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
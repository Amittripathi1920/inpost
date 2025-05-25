import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface FilterPanelProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  filters: {
    topic: string;
    length: string;
    tone: string;
    language: string;
  };
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  topicOptions: string[];
  lengthOptions: string[];
  toneOptions: string[];
  languageOptions: string[];
  className?: string;
  onDateRangeComplete?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  dateRange,
  setDateRange,
  filters,
  setFilters,
  resetFilters,
  topicOptions,
  lengthOptions,
  toneOptions,
  languageOptions,
  className,
  onDateRangeComplete,
}: FilterPanelProps) => {
  
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    
    // Check if both start and end dates are selected
    if (range?.from && range?.to) {
      // Call the callback to close the filter panel
      onDateRangeComplete?.();
    }
  };

  const clearDateRange = () => {
    setDateRange(undefined);
  };

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return "Select date range";
    }
    
    if (dateRange.from && !dateRange.to) {
      return format(dateRange.from, "MMM dd, yyyy");
    }
    
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
    }
    
    return "Select date range";
  };

  return (
    <div className={cn("sm:flex-row gap-2 overflow-x-auto", className)}>
      {/* Date Range Selection - Commented Out */}
      {/* 
      <div>
        <h4 className="text-sm font-medium mb-1">Date Range</h4>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
              {dateRange && (
                <X 
                  className="ml-auto h-4 w-4 hover:bg-gray-200 rounded" 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDateRange();
                  }}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      */}
      
      <div>
        <h4 className="text-sm font-medium mb-1">Topic</h4>
        <Select
          value={filters.topic}
          onValueChange={(value) => setFilters({ ...filters, topic: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topicOptions.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-1">Length</h4>
        <Select
          value={filters.length}
          onValueChange={(value) => setFilters({ ...filters, length: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Lengths" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lengths</SelectItem>
            {lengthOptions.map((length) => (
              <SelectItem key={length} value={length}>
                {length}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-1">Tone</h4>
        <Select
          value={filters.tone}
          onValueChange={(value) => setFilters({ ...filters, tone: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Tones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tones</SelectItem>
            {toneOptions.map((tone) => (
              <SelectItem key={tone} value={tone}>
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-1">Language</h4>
        <Select
          value={filters.language}
          onValueChange={(value) => setFilters({ ...filters, language: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languageOptions.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
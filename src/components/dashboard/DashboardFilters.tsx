import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
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
import { CalendarIcon, RefreshCwIcon, DownloadIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardFiltersProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  filters: {
    topic: string;
    length: string;
    tone: string;
    language: string;
  };
  setFilters: (filters: {
    topic: string;
    length: string;
    tone: string;
    language: string;
  }) => void;
  resetFilters: () => void;
  exportToCsv: () => void;
  topicOptions: string[];
  lengthOptions: string[];
  toneOptions: string[];
  languageOptions: string[];
}

export function DashboardFilters({
  dateRange,
  setDateRange,
  filters,
  setFilters,
  resetFilters,
  exportToCsv,
  topicOptions,
  lengthOptions,
  toneOptions,
  languageOptions,
}: DashboardFiltersProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Filter Dashboard</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RefreshCwIcon className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCsv}>
              <DownloadIcon className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Date Range</p>
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
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Topic</p>
            <Select
              value={filters.topic}
              onValueChange={(value) => setFilters({ ...filters, topic: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select topic" />
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
            <p className="text-sm font-medium mb-2">Length</p>
            <Select
              value={filters.length}
              onValueChange={(value) => setFilters({ ...filters, length: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select length" />
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
            <p className="text-sm font-medium mb-2">Tone</p>
            <Select
              value={filters.tone}
              onValueChange={(value) => setFilters({ ...filters, tone: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
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
            <p className="text-sm font-medium mb-2">Language</p>
            <Select
              value={filters.language}
              onValueChange={(value) => setFilters({ ...filters, language: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
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
      </CardContent>
    </Card>
  );
}
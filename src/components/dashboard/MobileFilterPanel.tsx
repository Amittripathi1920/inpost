import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarIcon, RotateCcwIcon, XIcon } from "lucide-react";

interface MobileFilterPanelProps {
  show: boolean;
  onClose: () => void;
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
}

export function MobileFilterPanel({
  show,
  onClose,
  dateRange,
  setDateRange,
  filters,
  setFilters,
  resetFilters,
  topicOptions,
  lengthOptions,
  toneOptions,
  languageOptions,
}: MobileFilterPanelProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 md:hidden overflow-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile-date-range" className="text-sm font-medium">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="mobile-date-range"
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
                  numberOfMonths={1}
                  toDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-topic-filter" className="text-sm font-medium">Topic</Label>
            <Select
              value={filters.topic}
              onValueChange={(value) => setFilters({...filters, topic: value})}
            >
              <SelectTrigger id="mobile-topic-filter" className="w-full">
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

          <div className="space-y-2">
            <Label htmlFor="mobile-length-filter" className="text-sm font-medium">Length</Label>
            <Select
              value={filters.length}
              onValueChange={(value) => setFilters({...filters, length: value})}
            >
              <SelectTrigger id="mobile-length-filter" className="w-full">
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

          <div className="space-y-2">
            <Label htmlFor="mobile-tone-filter" className="text-sm font-medium">Tone</Label>
            <Select
              value={filters.tone}
              onValueChange={(value) => setFilters({...filters, tone: value})}
            >
              <SelectTrigger id="mobile-tone-filter" className="w-full">
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

          <div className="space-y-2">
            <Label htmlFor="mobile-language-filter" className="text-sm font-medium">Language</Label>
            <Select
              value={filters.language}
              onValueChange={(value) => setFilters({...filters, language: value})}
            >
              <SelectTrigger id="mobile-language-filter" className="w-full">
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

                    <div className="pt-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={resetFilters}
            >
              <RotateCcwIcon className="mr-2 h-3.5 w-3.5" />
              Reset Filters
            </Button>
            
            <Button 
              className="w-full"
              onClick={onClose}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
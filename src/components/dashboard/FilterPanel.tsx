import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

export function FilterPanel({
  dateRange,
  setDateRange,
  filters,
  setFilters,
  resetFilters,
  topicOptions,
  lengthOptions,
  toneOptions,
  languageOptions,
}: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-1">Date Range</h4>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          className="border rounded-md p-2"
        />
      </div>
      
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
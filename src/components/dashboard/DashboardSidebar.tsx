import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    CalendarIcon,
    FilterIcon,
    Paintbrush as PaintbrushIcon,
    Download as DownloadIcon,
    RotateCcw as RotateCcwIcon,
    LayoutDashboard as LayoutDashboardIcon,
    FileText as FileTextIcon,
    TrendingUp as TrendingUpIcon,
    List as ListIcon,
    Menu,
    X,
    Settings,
    ChevronLeft
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardSidebarProps {
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
    exportToCsv: () => void;
    topicOptions: string[];
    lengthOptions: string[];
    toneOptions: string[];
    languageOptions: string[];
    themeColor: string;
    setThemeColor: (color: string) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    COLOR_OPTIONS: {name?: string, color: string}[];
}

export function DashboardSidebar({
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
    themeColor,
    setThemeColor,
    activeTab,
    setActiveTab,
    COLOR_OPTIONS
}: DashboardSidebarProps) {
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();
    const [sheetOpen, setSheetOpen] = useState(false);

    const handleDateSelect = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && range?.to) {
            setTimeout(() => setOpen(false), 300);
        }
    };

    // Mobile version - using Sheet component for a bottom drawer
    if (isMobile) {
        return (
            <>
                {/* Fixed bottom navigation bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40 px-2 py-1">
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-4 w-full">
                            <TabsTrigger value="overview" className="flex flex-col items-center text-xs py-1">
                                <LayoutDashboardIcon className="h-4 w-4 mb-1" />
                                <span>Overview</span>
                            </TabsTrigger>
                            <TabsTrigger value="content" className="flex flex-col items-center text-xs py-1">
                                <FileTextIcon className="h-4 w-4 mb-1" />
                                <span>Content</span>
                            </TabsTrigger>
                            <TabsTrigger value="trends" className="flex flex-col items-center text-xs py-1">
                                <TrendingUpIcon className="h-4 w-4 mb-1" />
                                <span>Trends</span>
                            </TabsTrigger>
                            <TabsTrigger value="posts" className="flex flex-col items-center text-xs py-1">
                                <ListIcon className="h-4 w-4 mb-1" />
                                <span>Posts</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Settings button that opens the sheet */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="fixed bottom-20 right-4 z-50 rounded-full shadow-md h-12 w-12"
                        >
                            <Settings className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh] overflow-y-auto pb-16">
                        <SheetHeader className="mb-4">
                            <SheetTitle>Dashboard Settings</SheetTitle>
                        </SheetHeader>
                        
                        <Accordion type="single" collapsible defaultValue="filters">
                            <AccordionItem value="filters" className="border-none">
                                <AccordionTrigger className="py-2">
                                    <div className="flex items-center">
                                        <FilterIcon className="mr-2 h-4 w-4" />
                                        <span>Filters</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date-range" className="text-xs font-medium">Date Range</Label>
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="date-range"
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal transition-all duration-200 hover:border-primary/50",
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
                                                <PopoverContent className="w-auto p-0 shadow-lg border-0" align="start">
                                                    <Calendar
                                                        initialFocus
                                                        mode="range"
                                                        defaultMonth={dateRange?.from}
                                                        selected={dateRange}
                                                        onSelect={handleDateSelect}
                                                        numberOfMonths={1}
                                                        toDate={new Date()}
                                                        className="rounded-md"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="topic-filter" className="text-xs font-medium">Topic</Label>
                                            <Select
                                                value={filters.topic}
                                                onValueChange={(value) => setFilters({...filters, topic: value})}
                                            >
                                                <SelectTrigger id="topic-filter" className="w-full transition-all duration-200 hover:border-primary/50">
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
                                            <Label htmlFor="length-filter" className="text-xs font-medium">Length</Label>
                                            <Select
                                                value={filters.length}
                                                onValueChange={(value) => setFilters({...filters, length: value})}
                                            >
                                                <SelectTrigger id="length-filter" className="w-full transition-all duration-200 hover:border-primary/50">
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
                                            <Label htmlFor="tone-filter" className="text-xs font-medium">Tone</Label>
                                            <Select
                                                value={filters.tone}
                                                onValueChange={(value) => setFilters({...filters, tone: value})}
                                            >
                                                <SelectTrigger id="tone-filter" className="w-full transition-all duration-200 hover:border-primary/50">
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
                                            <Label htmlFor="language-filter" className="text-xs font-medium">Language</Label>
                                            <Select
                                                value={filters.language}
                                                onValueChange={(value) => setFilters({...filters, language: value})}
                                            >
                                                <SelectTrigger id="language-filter" className="w-full transition-all duration-200 hover:border-primary/50">
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

                                        <div className="pt-2 pb-4">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={resetFilters}
                                                className="w-full flex items-center justify-center"
                                            >
                                                <RotateCcwIcon className="mr-2 h-3.5 w-3.5" />
                                                Reset Filters
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Theme */}
                        <Accordion type="single" collapsible>
                            <AccordionItem value="theme" className="border-none">
                                <AccordionTrigger className="py-2">
                                    <div className="flex items-center">
                                        <PaintbrushIcon className="mr-2 h-4 w-4" />
                                        <span>Theme</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium">Chart Color</Label>
                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {COLOR_OPTIONS.map((option, index) => (
                                                <Button
                                                    key={index}
                                                    variant={themeColor === option.color ? "default" : "outline"}
                                                    onClick={() => setThemeColor(option.color)}
                                                    className="w-8 h-8 rounded-full border-2 p-0 transition-all duration-200 hover:scale-110"
                                                    style={{
                                                        backgroundColor: option.color,
                                                        border: themeColor === option.color ? `3px solid ${option.color}` : "none",
                                                        boxShadow: themeColor === option.color ? `0 0 0 2px white, 0 0 0 4px ${option.color}` : "none"
                                                    }}
                                                    title={option.name || option.color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        
                        {/* Export */}
                        <div className="pt-4">
                            <Button 
                                variant="outline" 
                                className="w-full flex items-center justify-center"
                                onClick={() => {
                                    exportToCsv();
                                    setSheetOpen(false);
                                }}
                            >
                                <DownloadIcon className="mr-2 h-4 w-4" />
                                Export to CSV
                            </Button>
                        </div>
                        
                        <SheetClose asChild>
                            <Button 
                                variant="default" 
                                className="w-full mt-4 flex items-center justify-center"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Close Settings
                            </Button>
                        </SheetClose>
                    </SheetContent>
                </Sheet>

                {/* Add padding to the bottom of the page to account for the fixed navigation */}
                <div className="pb-16"></div>
            </>
        );
    }

    // Desktop version - traditional sidebar
    return (
        <div className="h-full border-r bg-background p-4 space-y-6 overflow-auto">
            <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                    Analyze your LinkedIn post activity
                </p>
            </div>

            {/* Navigation */}
            <div className="space-y-1">
                <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("overview")}
                >
                    <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                    Overview
                </Button>
                <Button
                    variant={activeTab === "content" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("content")}
                >
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Content Analysis
                </Button>
                <Button
                    variant={activeTab === "trends" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("trends")}
                >
                    <TrendingUpIcon className="mr-2 h-4 w-4" />
                    Trends
                </Button>
                <Button
                    variant={activeTab === "posts" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("posts")}
                >
                    <ListIcon className="mr-2 h-4 w-4" />
                    All Posts
                </Button>
            </div>

            <div className="border-t my-4"></div>

            {/* Filters */}
            <Accordion type="single" collapsible defaultValue="filters">
                <AccordionItem value="filters" className="border-none">
                    <AccordionTrigger className="py-2">
                        <div className="flex items-center">
                            <FilterIcon className="mr-2 h-4 w-4" />
                            <span>Filters</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="date-range" className="text-xs font-medium">Date Range</Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date-range"
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal transition-all duration-200 hover:border-primary/50",
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
                                    <PopoverContent className="w-auto p-0 shadow-lg border-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={dateRange?.from}
                                            selected={dateRange}
                                            onSelect={handleDateSelect}
                                            numberOfMonths={1}
                                            toDate={new Date()}
                                            className="rounded-md"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="topic-filter" className="text-xs font-medium">Topic</Label>
                                <Select
                                    value={filters.topic}
                                    onValueChange={(value) => setFilters({...filters, topic: value})}
                                >
                                    <SelectTrigger id="topic-filter" className="w-full transition-all duration-200 hover:border-primary/50">
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
                                <Label htmlFor="length-filter" className="text-xs font-medium">Length</Label>
                                <Select
                                    value={filters.length}
                                    onValueChange={(value) => setFilters({...filters, length: value})}
                                >
                                    <SelectTrigger id="length-filter" className="w-full transition-all duration-200 hover:border-primary/50">
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
                                <Label htmlFor="tone-filter" className="text-xs font-medium">Tone</Label>
                                <Select
                                    value={filters.tone}
                                    onValueChange={(value) => setFilters({...filters, tone: value})}
                                >
                                    <SelectTrigger id="tone-filter" className="w-full transition-all duration-200 hover:border-primary/50">
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
                                <Label htmlFor="language-filter" className="text-xs font-medium">Language</Label>
                                <Select
                                    value={filters.language}
                                    onValueChange={(value) => setFilters({...filters, language: value})}
                                >
                                    <SelectTrigger id="language-filter" className="w-full transition-all duration-200 hover:border-primary/50">
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

                            <div className="pt-2 pb-4">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={resetFilters}
                                    className="w-full flex items-center justify-center"
                                >
                                    <RotateCcwIcon className="mr-2 h-3.5 w-3.5" />
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Theme */}
            <Accordion type="single" collapsible>
                <AccordionItem value="theme" className="border-none">
                    <AccordionTrigger className="py-2">
                        <div className="flex items-center">
                            <PaintbrushIcon className="mr-2 h-4 w-4" />
                            <span>Theme</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">Chart Color</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {COLOR_OPTIONS.map((option, index) => (
                                    <Button
                                        key={index}
                                        variant={themeColor === option.color ? "default" : "outline"}
                                        onClick={() => setThemeColor(option.color)}
                                        className="w-6 h-6 rounded-full border-2 p-0 transition-all duration-200 hover:scale-110"
                                        style={{
                                            backgroundColor: option.color,
                                            border: themeColor === option.color ? `3px solid ${option.color}` : "none",
                                            boxShadow: themeColor === option.color ? `0 0 0 2px white, 0 0 0 4px ${option.color}` : "none"
                                        }}
                                        title={option.name || option.color}
                                    />
                                ))}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            {/* Export */}
            <div className="pt-4">
                <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center"
                    onClick={exportToCsv}
                >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Export to CSV
                </Button>
            </div>
        </div>
    );
}

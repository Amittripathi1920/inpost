import { useEffect, useState } from "react";
import { TopicTrendsChart } from "@/components/dashboard/TopicTrendsChart";
import { EngagementPredictionChart } from "@/components/dashboard/EngagementPredictionChart";
import { ActivityHeatmapChart } from "@/components/dashboard/ActivityHeatmapChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/hooks/useAuth";
import { getUserGeneratedPosts, getFilteredPostsByDateRange } from "@/utils/edgeFunctions";
import { COLOR_OPTIONS, rgbToHsl, extractHashtags, exportPostsToCsv } from "@/utils/dashboardUtils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileFilterPanel } from "@/components/dashboard/MobileFilterPanel";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { TopicDistribution } from "@/components/dashboard/TopicDistribution";
import { PostLengthDistribution } from "@/components/dashboard/PostLengthDistribution";
import { PostsByMonthChart } from "@/components/dashboard/PostsByMonth";
import { LanguageAnalysis } from "@/components/dashboard/LanguageAnalysis";
import { ToneAnalysis } from "@/components/dashboard/ToneAnalysis";
import { HashtagAnalysis } from "@/components/dashboard/HashtagAnalysis";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { PostsTable } from "@/components/dashboard/PostsTable";
import { getStorageItem, setStorageItem } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import {
  Home,
  BarChart2,
  TrendingUp,
  FileText,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
  RefreshCw,
  Palette,
  Calendar as CalendarIcon
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FilterPanel } from "@/components/dashboard/FilterPanel";

interface TopicCount {
  name: string;
  count: number;
}

interface LengthData {
  name: string;
  count: number;
}

interface HashtagAnalysisProps {
  hashtagData: { tag: string; count: number }[];
  themeColor: string;
  className?: string;
}

interface PostsByMonth {
  name: string;
  count: number;
}

interface Post {
  id: string;
  generated_post: string;
  created_at: string;
  topic?: {
    topic_name: string;
  };
  tone?: {
    tone_name: string;
  };
  language?: {
    language_name: string;
  };
  length?: {
    length_type: string;
  };
  hashtags?: string;
}

const UserDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [topicCounts, setTopicCounts] = useState<TopicCount[]>([]);
  const [lengthData, setLengthData] = useState<LengthData[]>([]);
  const [postsByMonth, setPostsByMonth] = useState<PostsByMonth[]>([]);
  const [toneData, setToneData] = useState<TopicCount[]>([]);
  const [languageData, setLanguageData] = useState<TopicCount[]>([]);
  const [hashtagData, setHashtagData] = useState<{tag: string; count: number}[]>([]);
  const [themeColor, setThemeColor] = useState<string>("#8884d8");
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    topic: "all",
    length: "all",
    tone: "all",
    language: "all",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showThemePanel, setShowThemePanel] = useState<boolean>(false);
  const [topicTrendsData, setTopicTrendsData] = useState<any[]>([]);

  const { toast } = useToast();
  const { user } = useAuth();

  // Options for filters
  const [filterOptions, setFilterOptions] = useState({
    topics: [] as string[],
    lengths: [] as string[],
    tones: [] as string[],
    languages: [] as string[],
  });

  // Active filters count for badge
  const activeFiltersCount = [
    filters.topic !== "all",
    filters.length !== "all",
    filters.tone !== "all",
    filters.language !== "all",
    dateRange !== undefined
  ].filter(Boolean).length;

  useEffect(() => {
    const saved = getStorageItem("dashboard-theme-color");
    if (saved) setThemeColor(saved);
    
    const savedSidebarState = getStorageItem("dashboard-sidebar-collapsed");
    if (savedSidebarState !== null) {
      setSidebarCollapsed(savedSidebarState === "true");
    }
  }, []);

  useEffect(() => {
    setStorageItem("dashboard-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    const loadPosts = async () => {
      if (!user?.user_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let userPosts: Post[];
        
        if (dateRange?.from && dateRange?.to) {
          // Format dates properly for the API
          const from = dateRange.from.toISOString().split('T')[0]; // YYYY-MM-DD
          const to = dateRange.to.toISOString().split('T')[0]; // YYYY-MM-DD
          
          try {
            userPosts = await getFilteredPostsByDateRange({
              from,
              to
            });
          } catch (error) {
            console.error("Error with date filtering:", error);
            // Fallback to getting all posts if date filtering fails
            userPosts = await getUserGeneratedPosts();
            
            // Show a toast to inform the user
            toast({
              title: "Date filtering failed",
              description: "Showing all posts instead",
              variant: "destructive",
            });
          }
        } else {
          userPosts = await getUserGeneratedPosts();
        }
        
        if (!userPosts || userPosts.length === 0) {
          setPosts([]);
          setFilteredPosts([]);
          setLoading(false);
          return;
        }

        setPosts(userPosts);

        // Initialize expanded state for each post
        const initialExpandedState = userPosts.slice(0, 5).reduce((acc: Record<string, boolean>, post) => {
          acc[post.id] = false;
          return acc;
        }, {});
        setExpandedPosts(initialExpandedState);

        // Extract filter options
        const topicOptions = [...new Set(userPosts.map(post => post.topic?.topic_name || "Unknown"))];
        const lengthOptions = [...new Set(userPosts.map(post => post.length?.length_type || "Unknown"))];
        const toneOptions = [...new Set(userPosts.map(post => post.tone?.tone_name || "Unknown"))];
        const languageOptions = [...new Set(userPosts.map(post => post.language?.language_name || "Unknown"))];
        
        setFilterOptions({
          topics: topicOptions,
          lengths: lengthOptions,
          tones: toneOptions,
          languages: languageOptions,
        });

        // Apply initial filtering
        applyFilters(userPosts);
      } catch (error) {
        console.error("Failed to load posts:", error);
        toast({
          title: "Error Loading Dashboard",
          description: "Failed to load your post history. Please try again later.",
          variant: "destructive",
        });
        
        // Set empty arrays to prevent further errors
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user, toast, dateRange]);

  // Apply filters to posts
  const applyFilters = (postsToFilter = posts) => {
    let filtered = postsToFilter.filter(post => {
      const topicMatch = filters.topic === "all" || post.topic?.topic_name === filters.topic;
      const lengthMatch = filters.length === "all" || post.length?.length_type === filters.length;
      const toneMatch = filters.tone === "all" || post.tone?.tone_name === filters.tone;
      const languageMatch = filters.language === "all" || post.language?.language_name === filters.language;
      
      return topicMatch && lengthMatch && toneMatch && languageMatch;
    });
    
    // Apply search query if present
    if (searchQuery.trim()) {
      filtered = filtered.filter(post => 
        post.generated_post.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.topic?.topic_name && post.topic.topic_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.tone?.tone_name && post.tone.tone_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredPosts(filtered);
    
    // Update analytics based on filtered posts
    updateAnalytics(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      topic: "all",
      length: "all",
      tone: "all",
      language: "all",
    });
    setDateRange(undefined);
    setSearchQuery("");
    
    // Re-apply filters (which will now show all posts)
    applyFilters();
  };

  // Update analytics based on filtered posts
  const updateAnalytics = (filteredPosts: Post[]) => {
    // Topic counts
    const topicMap: Record<string, number> = {};
    filteredPosts.forEach((post) => {
      const topic = post.topic?.topic_name || "Unknown";
      topicMap[topic] = (topicMap[topic] || 0) + 1;
    });
    const topicArray = Object.entries(topicMap)
      .map(([name, count], index) => ({ name, count, id: `topic-${index}` }))
      .sort((a, b) => b.count - a.count);
    setTopicCounts(topicArray);

    // Length categories based on the length types in the posts
    const lengthMap: Record<string, number> = {};

    filteredPosts.forEach((post) => {
      const lengthType = post.length?.length_type || "Unknown";
      lengthMap[lengthType] = (lengthMap[lengthType] || 0) + 1;
    });

    // Convert to array format for the chart
    const lengthArray = Object.entries(lengthMap)
      .map(([name, count]) => ({ name, count }))
      // Optional: sort by a specific order if needed
      .sort((a, b) => {
        // Custom sort order for length types
        const order = ["Short", "Medium", "Long"];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

    setLengthData(lengthArray);

    // Posts by month
    const monthMap: Record<string, number> = {};
    filteredPosts.forEach((post) => {
      const date = new Date(post.created_at);
      const monthName = date.toLocaleString("default", { month: "long" });
      monthMap[monthName] = (monthMap[monthName] || 0) + 1;
    });
    const monthArray = Object.entries(monthMap)
      .map(([name, count], index) => ({ name, count, id: `month-${index}` }))
      .sort((a, b) => {
        const months = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
        return months.indexOf(a.name) - months.indexOf(b.name);
      });
    setPostsByMonth(monthArray);

    // Tone analysis
    const toneMap: Record<string, number> = {};
    filteredPosts.forEach((post) => {
      const tone = post.tone?.tone_name || "Unknown";
      toneMap[tone] = (toneMap[tone] || 0) + 1;
    });
    const toneArray = Object.entries(toneMap)
      .map(([name, count], index) => ({ name, count, id: `tone-${index}` }))
      .sort((a, b) => b.count - a.count);
    setToneData(toneArray);

    // Language analysis
    const languageMap: Record<string, number> = {};
    filteredPosts.forEach((post) => {
      const language = post.language?.language_name || "Unknown";
      languageMap[language] = (languageMap[language] || 0) + 1;
    });
    const languageArray = Object.entries(languageMap)
      .map(([name, count], index) => ({ name, count, id: `lang-${index}` }))
      .sort((a, b) => b.count - a.count);
    setLanguageData(languageArray);

    // Hashtag analysis
    const hashtagMap: Record<string, number> = {};
    filteredPosts.forEach((post) => {
      const hashtags = extractHashtags(post.generated_post);
      hashtags.forEach(tag => {
        hashtagMap[tag] = (hashtagMap[tag] || 0) + 1;
      });
    });
    const hashtagArray = Object.entries(hashtagMap)
      .map(([tag, count], index) => ({ tag, count, id: `tag-${index}` }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 hashtags
    setHashtagData(hashtagArray);
  };

  // Effect to apply filters when they change
  useEffect(() => {
    if (posts.length > 0) {
      applyFilters();
    }
  }, [filters, searchQuery]);

  const handleThemeSelect = (color: string) => {
    setThemeColor(color);
    setStorageItem("dashboard-theme-color", color);
    
    // Close the theme panel if it's open
    if (showThemePanel) {
      setShowThemePanel(false);
    }
  };

  const toggleExpandPost = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard!",
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleExportToCsv = () => {
    try {
      exportPostsToCsv(filteredPosts);
      toast({
        title: "Export Successful",
        description: "Your posts have been exported to CSV",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to export posts:", error);
      toast({
        title: "Export Failed",
        description: "Could not export posts to CSV",
        variant: "destructive",
      });
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSearch = () => {
    setIsSearching(true);
    applyFilters();
    setIsSearching(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        } md:relative`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold">InPost Dashboard</h2>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={sidebarCollapsed ? "mx-auto" : ""}
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-2">
            <li>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      className={`w-full justify-${sidebarCollapsed ? "center" : "start"}`}
                      onClick={() => setActiveTab("overview")}
                    >
                      <Home className="h-5 w-5 mr-2" />
                      {!sidebarCollapsed && <span>Overview</span>}
                    </Button>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">Overview</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </li>
            <li>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTab === "content" ? "default" : "ghost"}
                      className={`w-full justify-${sidebarCollapsed ? "center" : "start"}`}
                      onClick={() => setActiveTab("content")}
                    >
                      <BarChart2 className="h-5 w-5 mr-2" />
                      {!sidebarCollapsed && <span>Content Analysis</span>}
                    </Button>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">Content Analysis</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </li>
            <li>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTab === "trends" ? "default" : "ghost"}
                      className={`w-full justify-${sidebarCollapsed ? "center" : "start"}`}
                      onClick={() => setActiveTab("trends")}
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {!sidebarCollapsed && <span>Trends</span>}
                    </Button>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">Trends</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </li>
            <li>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTab === "posts" ? "default" : "ghost"}
                      className={`w-full justify-${sidebarCollapsed ? "center" : "start"}`}
                      onClick={() => setActiveTab("posts")}
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      {!sidebarCollapsed && <span>All Posts</span>}
                    </Button>
                  </TooltipTrigger>
                  {sidebarCollapsed && <TooltipContent side="right">All Posts</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </li>
          </ul>
        </nav>
        
        {/* Theme Section */}
        <div className="border-t p-4">
          {!sidebarCollapsed && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Theme Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color, index) => (
                    <button
                      key={`color-${index}`}
                      className={`w-6 h-6 rounded-full ${
                        themeColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleThemeSelect(color)}
                      aria-label={`Select ${color} theme`}
                    />
                  ))}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2"
                onClick={handleExportToCsv}
              >
                <Download className="h-4 w-4" />
                <span>Export to CSV</span>
              </Button>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex flex-col items-center space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowThemePanel(true);
                        setSidebarCollapsed(false);
                      }}
                    >
                      <Palette className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Theme Settings</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleExportToCsv}
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Export to CSV</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
          <h1 className="text-xl font-semibold">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "content" && "Content Analysis"}
            {activeTab === "trends" && "Trend Analysis"}
            {activeTab === "posts" && "All Posts"}
          </h1>
          
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="w-[200px] pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Filter Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden md:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[340px] p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Filter Posts</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetFilters}
                      className="h-8 px-2 text-xs"
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Reset
                    </Button>
                  </div>
                  
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
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Theme Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Theme Colors</DropdownMenuLabel>
                <div className="flex flex-wrap gap-2 p-2">
                  {COLOR_OPTIONS.map((color, index) => (
                    <button
                      key={`dropdown-color-${index}`}
                      className={`w-6 h-6 rounded-full ${
                        themeColor === color ? "ring-2 ring-offset-1 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleThemeSelect(color)}
                      aria-label={`Select ${color} theme`}
                    />
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Dashboard Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportToCsv}>
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resetFilters}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset All Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile Search Bar */}
        <div className="md:hidden p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/20">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            {filters.topic !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Topic: {filters.topic}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setFilters({...filters, topic: "all"})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.length !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Length: {filters.length}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setFilters({...filters, length: "all"})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.tone !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Tone: {filters.tone}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setFilters({...filters, tone: "all"})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.language !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Language: {filters.language}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setFilters({...filters, language: "all"})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {dateRange && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Date Range
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => setDateRange(undefined)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto text-xs h-7" 
              onClick={resetFilters}
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          {/* Results Count */}
          {/* <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredPosts.length}</span> of <span className="font-medium">{posts.length}</span> posts
              {searchQuery && (
                <> matching "<span className="font-medium">{searchQuery}</span>"</>
              )}
            </p>
          </div> */}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-2">
              <DashboardSummary
                totalPosts={filteredPosts.length}
                topicsCount={topicCounts.length}
                mostCommonTopic={topicCounts.length > 0 ? topicCounts[0].name : "N/A"}
                className="md:col-span-2"
              />
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Topic Distribution</CardTitle>
                  <CardDescription>Most frequently used topics</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <TopicDistribution 
                    topicCounts={topicCounts} 
                    themeColor={themeColor} 
                    rgbToHsl={rgbToHsl} 
                  />
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Post Length</CardTitle>
                  <CardDescription>Distribution by word count</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <PostLengthDistribution 
                    lengthData={lengthData} 
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Activity</CardTitle>
                  <CardDescription>Posts created per month</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <PostsByMonthChart 
                    postsByMonth={postsByMonth} 
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tone Analysis</CardTitle>
                  <CardDescription>Most used tones in your content</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ToneAnalysis 
                    toneData={toneData} 
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Posts</CardTitle>
                  <CardDescription>Your latest generated content</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentPosts
                    posts={filteredPosts.slice(0, 5)}
                    expandedPosts={expandedPosts}
                    toggleExpandPost={toggleExpandPost}
                    copyToClipboard={copyToClipboard}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content Analysis Tab */}
          {activeTab === "content" && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Topic Distribution</CardTitle>
                  <CardDescription>Most frequently used topics</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <TopicDistribution 
                    topicCounts={topicCounts} 
                    themeColor={themeColor} 
                    rgbToHsl={rgbToHsl} 
                  />
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Post Length</CardTitle>
                  <CardDescription>Distribution by word count</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <PostLengthDistribution 
                    lengthData={lengthData} 
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tone Analysis</CardTitle>
                  <CardDescription>Most used tones in your content</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ToneAnalysis 
                    toneData={toneData} 
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Language Usage</CardTitle>
                  <CardDescription>Languages used in your posts</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <LanguageAnalysis 
                    languageData={languageData} 
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Hashtag Analysis</CardTitle>
                  <CardDescription>Most frequently used hashtags</CardDescription>
                </CardHeader>
                <CardContent>
                  <HashtagAnalysis 
                    hashtagData={hashtagData} 
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === "trends" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity</CardTitle>
                  <CardDescription>Your post generation over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <PostsByMonthChart 
                    postsByMonth={postsByMonth} 
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Activity Heatmap</CardTitle>
                  <CardDescription>Your posting frequency by day and time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityHeatmapChart 
                    data={[]} // We'll use the sample data in the component for now
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Prediction</CardTitle>
                  <CardDescription>Estimated engagement based on post attributes</CardDescription>
                </CardHeader>
                <CardContent>
                  <EngagementPredictionChart 
                    data={[]} // We'll use the sample data in the component for now
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Topic Trends</CardTitle>
                  <CardDescription>How your topic choices have evolved over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopicTrendsChart 
                    data={[]} // We'll need to prepare this data
                    themeColor={themeColor} 
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">All Posts</CardTitle>
                <CardDescription>Complete list of your generated content</CardDescription>
              </CardHeader>
              <CardContent>
                <PostsTable 
                  posts={filteredPosts}
                  copyToClipboard={copyToClipboard}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Theme Panel Modal */}
      {showThemePanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Choose Theme Color</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {COLOR_OPTIONS.map((color, index) => (
                <button
                  key={`modal-color-${index}`}
                  className={`w-12 h-12 rounded-full ${
                    themeColor === color ? "ring-4 ring-offset-2 ring-primary" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleThemeSelect(color)}
                  aria-label={`Select ${color} theme`}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={() => setShowThemePanel(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

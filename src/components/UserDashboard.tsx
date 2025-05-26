import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/hooks/useAuth";
import { getUserGeneratedPosts, getFilteredPostsByDateRange } from "@/utils/edgeFunctions";
import { COLOR_OPTIONS, rgbToHsl, extractHashtags, exportPostsToCsv } from "@/utils/dashboardUtils";
import { getStorageItem, setStorageItem } from "@/utils/storage";
import { useIsMobile } from "@/hooks/use-mobile";

// Import visualization components
import { TopicDistribution } from "@/components/dashboard/TopicDistribution";
import { PostLengthDistribution } from "@/components/dashboard/PostLengthDistribution";
import { PostsByMonthChart } from "@/components/dashboard/PostsByMonth";
import { ToneAnalysis } from "@/components/dashboard/ToneAnalysis";
import { LanguageAnalysis } from "@/components/dashboard/LanguageAnalysis";
import { HashtagAnalysis } from "@/components/dashboard/HashtagAnalysis";
import { ActivityHeatmapChart } from "@/components/dashboard/ActivityHeatmapChart";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { PostsTable } from "@/components/dashboard/PostsTable";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";

// Import UI components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

// Import icons
import {
  FileText,
  Download,
  Settings,
  Filter,
  Search,
  X,
  RefreshCw,
  Palette,
  ChevronLeft
} from "lucide-react";

// Import filter panel
import { FilterPanel } from "@/components/dashboard/FilterPanel";

// Define interfaces
interface TopicCount {
  name: string;
  count: number;
}

interface LengthData {
  name: string;
  count: number;
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
  // State management
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    topic: "all",
    length: "all",
    tone: "all",
    language: "all",
  });

  // Options for filters
  const [filterOptions, setFilterOptions] = useState({
    topics: [] as string[],
    lengths: [] as string[],
    tones: [] as string[],
    languages: [] as string[],
  });

  // Hooks
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Active filters count for badge
  const activeFiltersCount = [
    filters.topic !== "all",
    filters.length !== "all",
    filters.tone !== "all",
    filters.language !== "all",
    dateRange !== undefined
  ].filter(Boolean).length;

  // Load theme from storage
  useEffect(() => {
    const saved = getStorageItem("dashboard-theme-color");
    if (saved) setThemeColor(saved);
  }, []);

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
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    setTopicCounts(topicArray);

    // Length categories
    const lengthMap: Record<string, number> = {};
    filteredPosts.forEach((post) => {
      const lengthType = post.length?.length_type || "Unknown";
      lengthMap[lengthType] = (lengthMap[lengthType] || 0) + 1;
    });
    const lengthArray = Object.entries(lengthMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
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
      .map(([name, count]) => ({ name, count }))
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
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    setToneData(toneArray);

    // Language analysis
    const languageMap: Record<string, number> = {};
    filteredPosts.forEach((post) => {
      const language = post.language?.language_name || "Unknown";
      languageMap[language] = (languageMap[language] || 0) + 1;
    });
    const languageArray = Object.entries(languageMap)
      .map(([name, count]) => ({ name, count }))
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
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 hashtags
    setHashtagData(hashtagArray);
  };

  // Load posts data
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
          const from = dateRange.from.toISOString().split('T')[0];
          const to = dateRange.to.toISOString().split('T')[0];
          
          try {
            userPosts = await getFilteredPostsByDateRange({
              from,
              to
            });
          } catch (error) {
            console.error("Error with date filtering:", error);
            userPosts = await getUserGeneratedPosts();
            
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
        
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user, toast, dateRange]);

  // Effect to apply filters when they change
  useEffect(() => {
    if (posts.length > 0) {
      applyFilters();
    }
  }, [filters, searchQuery]);

  // Theme handling
  const handleThemeSelect = (color: string) => {
    setThemeColor(color);
    setStorageItem("dashboard-theme-color", color);
  };

  // Post interaction functions
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

  const handleSearch = () => {
    applyFilters();
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
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">Hi, Welcome to Your Dashboard</h1>
            
            <div className="flex items-center space-x-2">
              {/* Search - Hidden on mobile, shown on larger screens */}
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
              
              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Dashboard Actions</DropdownMenuLabel>
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
          </div>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      {isMobile && (
        <div className="md:hidden p-4 bg-white border-b">
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
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-wrap items-center gap-2">
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
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{filteredPosts.length}</span> of <span className="font-medium">{posts.length}</span> posts
            {searchQuery && (
              <> matching "<span className="font-medium">{searchQuery}</span>"</>
            )}
          </p>
        </div>

        {/* Tab Content - Only Overview and Posts */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">All Posts</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab - All Charts and Visualizations */}
          <TabsContent value="overview" className="mt-0">
            <div className="space-y-6">
              {/* Dashboard Summary - Full Width */}
              <DashboardSummary
                totalPosts={filteredPosts.length}
                topicsCount={topicCounts.length}
                mostCommonTopic={topicCounts.length > 0 ? topicCounts[0].name : "N/A"}
                className="w-full"
              />
              
              {/* Charts Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Topic Distribution */}
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
                
                {/* Post Length Distribution */}
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
                
                {/* Monthly Activity */}
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
                
                {/* Tone Analysis */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Tone Analysis</CardTitle>
                    <CardDescription>Post tone distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ToneAnalysis 
                      toneData={toneData} 
                      themeColor={themeColor} 
                    />
                  </CardContent>
                </Card>
                
                {/* Language Analysis */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Language Analysis</CardTitle>
                    <CardDescription>Post language distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <LanguageAnalysis 
                      languageData={languageData} 
                      themeColor={themeColor} 
                    />
                  </CardContent>
                </Card>
                
                {/* Activity Heatmap */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Activity Heatmap</CardTitle>
                    <CardDescription>Your posting frequency by day and time</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ActivityHeatmapChart 
                      posts={filteredPosts}
                      themeColor={themeColor} 
                    />
                  </CardContent>
                </Card>
              </div>
              
              {/* Hashtag Analysis - Full Width */}
              <Card className="overflow-hidden">
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

              {/* Recent Posts - Full Width */}
              {/* <Card>
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
              </Card> */}
            </div>
          </TabsContent>

          {/* Posts Tab - Complete Posts Table */}
          <TabsContent value="posts" className="mt-0">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Action Button */}
      {isMobile && (
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setSheetOpen(true)}
        >
          <Settings className="h-6 w-6" />
        </Button>
      )}

      {/* Mobile Settings Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto pb-16">
          <SheetHeader className="mb-4">
            <SheetTitle>Dashboard Settings</SheetTitle>
          </SheetHeader>
          
          {/* Filters */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Filter Posts</h3>
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
                className="flex-col"
              />
            </div>
            
            {/* Theme Colors */}
            <div>
              <h3 className="text-sm font-medium mb-2">Theme Colors</h3>
              <div className="flex flex-wrap gap-3">
                {COLOR_OPTIONS.map((color, index) => (
                  <button
                    key={`color-${index}`}
                    className={`w-8 h-8 rounded-full ${
                      themeColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleThemeSelect(color)}
                    aria-label={`Select ${color} theme`}
                  />
                ))}
              </div>
            </div>
            
            {/* Export Button */}
            <Button
              variant="outline"
              className="w-full mt-6 flex items-center gap-2"
              onClick={handleExportToCsv}
            >
              <Download className="h-4 w-4" />
              <span>Export to CSV</span>
            </Button>
            
            <SheetClose asChild>
              <Button 
                variant="default" 
                className="w-full mt-4 flex items-center justify-center"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Close Settings
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      {/* No Posts State */}
      {posts.length === 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Posts Found</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven't created any posts yet, or no posts match your current filters.
            </p>
            <Button onClick={resetFilters}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

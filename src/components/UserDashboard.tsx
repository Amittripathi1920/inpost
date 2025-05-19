import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/hooks/useAuth";
import { getUserGeneratedPosts, getFilteredPostsByDateRange } from "@/utils/edgeFunctions";
import { COLOR_OPTIONS, rgbToHsl, extractHashtags, exportPostsToCsv } from "@/utils/dashboardUtils";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
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

  const { toast } = useToast();
  const { user } = useAuth();

  // Options for filters
  const [filterOptions, setFilterOptions] = useState({
    topics: [] as string[],
    lengths: [] as string[],
    tones: [] as string[],
    languages: [] as string[],
  });

  useEffect(() => {
    const saved = getStorageItem("dashboard-theme-color");
    if (saved) setThemeColor(saved);
  }, []);

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
          userPosts = await getFilteredPostsByDateRange({
            from: dateRange.from,
            to: dateRange.to
          });
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
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user, toast, dateRange]);

  // Apply filters to posts
  const applyFilters = (postsToFilter = posts) => {
    const filtered = postsToFilter.filter(post => {
      const topicMatch = filters.topic === "all" || post.topic?.topic_name === filters.topic;
      const lengthMatch = filters.length === "all" || post.length?.length_type === filters.length;
      const toneMatch = filters.tone === "all" || post.tone?.tone_name === filters.tone;
      const languageMatch = filters.language === "all" || post.language?.language_name === filters.language;
      
      return topicMatch && lengthMatch && toneMatch && languageMatch;
    });
    
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
    const lengthCategories = [
      { name: "Short (<100 words)", count: 0 },
      { name: "Medium (100-300 words)", count: 0 },
      { name: "Long (>300 words)", count: 0 },
    ];
    filteredPosts.forEach((post) => {
      const wordCount = post.generated_post?.split(/\s+/)?.length || 0;
      if (wordCount < 100) lengthCategories[0].count++;
      else if (wordCount < 300) lengthCategories[1].count++;
      else lengthCategories[2].count++;
    });
    setLengthData(lengthCategories);

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

  // Effect to apply filters when they change
  useEffect(() => {
    if (posts.length > 0) {
      applyFilters();
    }
  }, [filters]);

  const handleThemeSelect = (color: string) => {
    setThemeColor(color);
    setStorageItem("dashboard-theme-color", color);
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

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Posts Summary</CardTitle>
            {/* Use a span instead of CardDescription which renders as p */}
            <span className="text-sm text-muted-foreground">
              Overview of your LinkedIn post generation activity
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 w-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <div className="h-6 w-3/4">
                  <Skeleton className="h-full w-full" />
                </div>
              </CardTitle>
              {/* Use a span instead of CardDescription */}
              <span className="text-sm text-muted-foreground block mt-2">
                <div className="h-4 w-full">
                  <Skeleton className="h-full w-full" />
                </div>
              </span>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full">
                <Skeleton className="h-full w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="hidden md:block md:w-64 lg:w-72 shrink-0 h-full">
        <DashboardSidebar
          dateRange={dateRange}
          setDateRange={setDateRange}
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          exportToCsv={handleExportToCsv}
          topicOptions={filterOptions.topics}
          lengthOptions={filterOptions.lengths}
          toneOptions={filterOptions.tones}
          languageOptions={filterOptions.languages}
          themeColor={themeColor}
          setThemeColor={handleThemeSelect}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Mobile Header and Filters */}
      <DashboardHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showFilters={showMobileFilters}
        setShowFilters={setShowMobileFilters}
      />

      <MobileFilterPanel
        show={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
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

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardSummary
              totalPosts={filteredPosts.length}
              topicsCount={topicCounts.length}
              mostCommonTopic={topicCounts.length > 0 ? topicCounts[0].name : "N/A"}
            />
            
            <TopicDistribution 
              topicCounts={topicCounts} 
              themeColor={themeColor} 
              rgbToHsl={rgbToHsl} 
            />
            
            <PostLengthDistribution 
              lengthData={lengthData} 
              themeColor={themeColor} 
            />
            
            <PostsByMonthChart 
              postsByMonth={postsByMonth} 
              themeColor={themeColor} 
            />
            
            <RecentPosts
              className="col-span-full"
              posts={filteredPosts.slice(0, 5)}
              expandedPosts={expandedPosts}
              toggleExpandPost={toggleExpandPost}
              copyToClipboard={copyToClipboard}
            />
          </div>
        )}

        {/* Content Analysis Tab */}
        {activeTab === "content" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <TopicDistribution 
              topicCounts={topicCounts} 
              themeColor={themeColor} 
              rgbToHsl={rgbToHsl} 
            />
            
            <PostLengthDistribution 
              lengthData={lengthData} 
              themeColor={themeColor} 
            />
            
            <ToneAnalysis 
              toneData={toneData} 
              themeColor={themeColor} 
            />
            
            <LanguageAnalysis 
              languageData={languageData} 
              themeColor={themeColor} 
            />
            
            <HashtagAnalysis 
              className="col-span-full"
              hashtagData={hashtagData} 
              themeColor={themeColor} 
            />
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === "trends" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <PostsByMonthChart 
              postsByMonth={postsByMonth} 
              themeColor={themeColor} 
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="card-title">Activity Heatmap</CardTitle>
                <CardDescription className="card-description">Your posting frequency by day and time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center">
                  <span className="text-muted-foreground">Coming soon</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="card-title">Engagement Prediction</CardTitle>
                <CardDescription className="card-description">Estimated engagement based on post attributes</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center">
                  <span className="text-muted-foreground">Coming soon</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="card-title">Topic Trends</CardTitle>
                <CardDescription className="card-description">How your topic choices have evolved over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="h-full flex items-center justify-center">
                  <span className="text-muted-foreground">Coming soon</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <PostsTable 
            posts={filteredPosts}
            copyToClipboard={copyToClipboard}
          />
        )}
      </div>
    </div> 
  );
};

export default UserDashboard;

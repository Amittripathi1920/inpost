import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { getUserGeneratedPosts } from "@/utils/edgeFunctions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  hashtags?: string;
}

const COLOR_OPTIONS = [
  { name: "Default", color: "#8884d8" },
  { name: "Red", color: "#ef4444" },
  { name: "Rose", color: "#f43f5e" },
  { name: "Orange", color: "#f97316" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Yellow", color: "#eab308" },
  { name: "Violet", color: "#8b5cf6" },
];

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }

  return [h, s * 100, l * 100];
}


const UserDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topicCounts, setTopicCounts] = useState<TopicCount[]>([]);
  const [lengthData, setLengthData] = useState<LengthData[]>([]);
  const [postsByMonth, setPostsByMonth] = useState<PostsByMonth[]>([]);
  const [themeColor, setThemeColor] = useState<string>("#8884d8");
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("dashboard-theme-color");
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
        const userPosts = await getUserGeneratedPosts(user.user_id);
        
        if (!userPosts || userPosts.length === 0) {
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

        // Topic counts
        const topicMap: Record<string, number> = {};
        userPosts.forEach((post) => {
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
        userPosts.forEach((post) => {
          const wordCount = post.generated_post?.split(/\s+/)?.length || 0;
          if (wordCount < 100) lengthCategories[0].count++;
          else if (wordCount < 300) lengthCategories[1].count++;
          else lengthCategories[2].count++;
        });
        setLengthData(lengthCategories);

        // Posts by month
        const monthMap: Record<string, number> = {};
        userPosts.forEach((post) => {
          const date = new Date(post.created_at);
          const monthName = date.toLocaleString("default", { month: "long" });
          monthMap[monthName] = (monthMap[monthName] || 0) + 1;
        });
        const monthArray = Object.entries(monthMap).map(([name, count]) => ({
          name,
          count,
        }));
        setPostsByMonth(monthArray);
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
  }, [user, toast]);

  const handleThemeSelect = (color: string) => {
    setThemeColor(color);
    localStorage.setItem("dashboard-theme-color", color);
  };

  const toggleExpandPost = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Posts Summary</CardTitle>
            <CardDescription>Overview of your LinkedIn post generation activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-3/4" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-full mt-2" />
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Theme Selector */}
      <Card className="flex items-center w-full">
        <CardHeader>
          <CardDescription>Pick Your Favorite Theme</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 rounded-2xl items-center p-0">
          {COLOR_OPTIONS.map((option) => (
            <Button
              key={option.name}
              variant={themeColor === option.color ? "default" : "outline"}
              onClick={() => handleThemeSelect(option.color)}
              className="w-6 h-6 rounded-full border-2"
              style={{
                backgroundColor: option.color,
                // color: "#fff",
                border:
                  themeColor === option.color ? `3px solid ${option.color}` : "none",
                 // padding:
                 //  themeColor === option.color ? "0px 4px" : "none",
              }}
            >
{/*               {option.name} */}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Posts Summary */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Posts Summary</CardTitle>
          <CardDescription>Overview of your LinkedIn post generation activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-3xl font-bold">{posts.length}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Topics Used</p>
              <p className="text-3xl font-bold">{topicCounts.length}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Most Common Topic</p>
              <p className="text-3xl font-bold">
                {topicCounts.length > 0 ? topicCounts[0].name : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Topics Distribution</CardTitle>
          <CardDescription>Frequency of topics used in your posts</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {topicCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicCounts.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine
                  outerRadius={80}
                  fill={themeColor}
                  dataKey="count"
                  nameKey="name"
                  label={(entry) => entry.name}
                >
                  {topicCounts.slice(0, 6).map((_, index) => {
                    // Generate color variations by shifting hue
                    const hueRotate = index * 20;
                    const base = document.createElement("div");
                    base.style.color = themeColor;
                    document.body.appendChild(base);
                    const rgb = getComputedStyle(base).color;
                    document.body.removeChild(base);
                  
                    const match = rgb.match(/\d+/g);
                    const [r, g, b] = match ? match.map(Number) : [136, 132, 216]; // fallback to default
                    const hsl = rgbToHsl(r, g, b);
                    hsl[0] = (hsl[0] + hueRotate) % 360;
                    const color = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
                  
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })} 
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post Length Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Post Length Distribution</CardTitle>
          <CardDescription>Distribution of your posts by length categories</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {lengthData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lengthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill={themeColor} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Your most recently generated LinkedIn posts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
          {posts.length > 0 ? (
            posts.slice(0, 5).map((post) => (
              <div key={post.id} className="border rounded-lg p-4 transition-all duration-200 hover:shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{post.topic?.topic_name || "Unknown Topic"}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="mb-2">
                  <p 
                    className={`text-sm text-muted-foreground transition-all duration-300 ${
                      expandedPosts[post.id] ? "" : "line-clamp-3"
                    }`}
                  >
                    {post.generated_post || "No content available"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-primary truncate max-w-[70%]">
                    {post.hashtags || "No hashtags"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => toggleExpandPost(post.id)}
                    >
                      {expandedPosts[post.id] ? "Show Less" : "Show More"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => copyToClipboard(post.generated_post)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p>You haven't generated any posts yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;

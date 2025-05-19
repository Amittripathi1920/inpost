import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CopyIcon, MessageSquareIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Post {
  id: string;
  generated_post: string;
  created_at: string;
  topic?: {
    topic_name: string;
  };
}

interface RecentPostsProps {
  posts: Post[];
  expandedPosts: Record<string, boolean>;
  toggleExpandPost: (postId: string) => void;
  copyToClipboard: (text: string) => void;
  className?: string;
}

export function RecentPosts({ 
  posts, 
  expandedPosts, 
  toggleExpandPost, 
  copyToClipboard,
  className = ""
}: RecentPostsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="card-title">Recent Posts</CardTitle>
        <CardDescription className="card-description">Your most recently generated LinkedIn posts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.div 
              key={post.id} 
              className="border rounded-lg p-4 transition-all duration-200 hover:shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-base">{post.topic?.topic_name || "Unknown Topic"}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="mb-3">
                <p 
                  className={`text-sm text-muted-foreground transition-all duration-300 ${
                    expandedPosts[post.id] ? "" : "line-clamp-3"
                  }`}
                >
                  {post.generated_post || "No content available"}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-primary">
                  <MessageSquareIcon className="h-3 w-3 mr-1" />
                  {post.generated_post?.split(/\s+/).length || 0} words
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs hover:bg-secondary/80"
                    onClick={() => toggleExpandPost(post.id)}
                  >
                    {expandedPosts[post.id] ? "Show Less" : "Show More"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs flex items-center gap-1"
                    onClick={() => copyToClipboard(post.generated_post)}
                  >
                    <CopyIcon className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p>You haven't generated any posts yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
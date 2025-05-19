import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  generated_post: string;
  created_at: string;
  topic?: {
    topic_name: string;
  };
}

export function RecentPosts({ 
  posts, 
  expandedPosts,
  toggleExpandPost,
  copyToClipboard,
  className
}: { 
  posts: Post[];
  expandedPosts: Record<string, boolean>;
  toggleExpandPost: (postId: string) => void;
  copyToClipboard: (text: string) => void;
  className?: string;
}) {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{post.topic?.topic_name || 'Unknown Topic'}</div>
                <div className="text-sm text-muted-foreground">{formatDate(post.created_at)}</div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(post.generated_post)}
                  title="Copy post"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleExpandPost(post.id)}
                  title={expandedPosts[post.id] ? "Collapse" : "Expand"}
                >
                  {expandedPosts[post.id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className={cn(
              "text-sm whitespace-pre-wrap transition-all duration-200 overflow-hidden",
              expandedPosts[post.id] ? "max-h-[500px]" : "max-h-[80px]"
            )}>
              {post.generated_post}
            </div>
            {!expandedPosts[post.id] && post.generated_post.length > 300 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => toggleExpandPost(post.id)}
              >
                Read more
              </Button>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No recent posts found
        </div>
      )}
    </div>
  );
}
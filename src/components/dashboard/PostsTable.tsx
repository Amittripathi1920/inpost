import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
}

export function PostsTable({ 
  posts, 
  copyToClipboard 
}: { 
  posts: Post[];
  copyToClipboard: (text: string) => void;
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

  // Truncate post content for display
  const truncatePost = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Length</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Tone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{formatDate(post.created_at)}</TableCell>
                <TableCell>{post.topic?.topic_name || 'Unknown'}</TableCell>
                <TableCell className="max-w-[200px]">
                  {truncatePost(post.generated_post)}
                </TableCell>
                <TableCell>{post.length?.length_type || 'Unknown'}</TableCell>
                <TableCell>{post.language?.language_name || 'Unknown'}</TableCell>
                <TableCell>{post.tone?.tone_name || 'Unknown'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(post.generated_post)}
                    title="Copy post"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                No posts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Remove the "Showing X of X posts" text */}
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CopyIcon, SearchIcon } from "lucide-react";

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

interface PostsTableProps {
  posts: Post[];
  copyToClipboard: (text: string) => void;
}

export function PostsTable({ posts, copyToClipboard }: PostsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => 
    post.generated_post?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.topic?.topic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tone?.tone_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.language?.language_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Posts</CardTitle>
        <CardDescription>Complete list of your generated LinkedIn posts</CardDescription>
        <div className="relative mt-2">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredPosts.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead className="hidden md:table-cell">Tone</TableHead>
                  <TableHead className="hidden md:table-cell">Language</TableHead>
                  <TableHead className="hidden md:table-cell">Length</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      {new Date(post.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{post.topic?.topic_name || "Unknown"}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.tone?.tone_name || "Unknown"}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.language?.language_name || "Unknown"}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.length?.length_type || "Unknown"}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p 
                          className={expandedPost === post.id ? "" : "truncate"}
                          title={expandedPost !== post.id ? post.generated_post : undefined}
                        >
                          {post.generated_post}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        >
                          {expandedPost === post.id ? "Show Less" : "Show More"}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(post.generated_post)}
                        title="Copy to clipboard"
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No posts found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePost, generateHooks } from "@/utils/groq";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import OnboardingModal from "@/components/OnboardingModal";
import FeedbackModal from "@/pages/FeedbackPage";
import { ThumbsUp, Search } from "lucide-react";
import { 
  getOptions, 
  saveGeneratedPost, 
  getUserProfile,
  getIdsForPostGeneration,
  checkAndAddTopicForUser
} from "@/utils/edgeFunctions";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import aiIcon from "@/assets/ai.png";

const PostGenerator = () => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState(""); // 🔥 stage loader
  const [isGenerating, setIsGenerating] = useState(false);

  const [hooks, setHooks] = useState<string[]>([]);
  const [selectedHook, setSelectedHook] = useState("");

  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]); // 🔥 variants
  const [finalPost, setFinalPost] = useState("");

  const [formData, setFormData] = useState({
    topic: "",
    language: "English",
    tone: "Professional",
    postLength: "Medium",
    hookType: "Storytelling", // 🔥 new
    whatToInclude: "",
  });

  const isMobile = useIsMobile();
  const previewRef = useRef<HTMLDivElement>(null);

  // 🔥 GENERATE HOOKS FIRST
  const handleGenerateHooks = async () => {
    if (!formData.topic.trim()) {
      toast({ title: "Enter topic first" });
      return;
    }

    setIsGenerating(true);
    setStage("Generating hooks...");

    try {
      const result = await generateHooks({
        topic: formData.topic,
        hookType: formData.hookType
      });

      setHooks(result);
    } catch (err) {
      toast({ title: "Error generating hooks", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  // 🔥 FINAL POST GENERATION
  const handleGeneratePost = async () => {
    if (!selectedHook) {
      toast({ title: "Select a hook first" });
      return;
    }

    setIsGenerating(true);

    try {
      setStage("Structuring post...");
      await new Promise(r => setTimeout(r, 300));

      setStage("Writing content...");
      const responses = await Promise.all([
        generatePost({
          ...formData,
          hook: selectedHook,
          what_to_include: formData.whatToInclude || "Make it practical"
        }),
        generatePost({
          ...formData,
          hook: selectedHook,
          what_to_include: formData.whatToInclude || "Make it practical"
        })
      ]);

      const posts = responses.map(r => `${r.content}\n\n${r.hashtags}`);
      setGeneratedPosts(posts);
      setFinalPost(posts[0]);

      toast({ title: "Generated 2 variants ✨" });

      if (isMobile && previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: "smooth" });
      }

    } catch (err) {
      toast({ title: "Error generating post", variant: "destructive" });
    } finally {
      setIsGenerating(false);
      setStage("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* TOPIC INPUT */}
      <Input
        placeholder="Enter topic"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
      />

      {/* HOOK TYPE */}
      <Select
        value={formData.hookType}
        onValueChange={(v) => setFormData({ ...formData, hookType: v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Hook Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Storytelling">Storytelling</SelectItem>
          <SelectItem value="Unpopular">Unpopular Opinion</SelectItem>
          <SelectItem value="Failure">Failure Story</SelectItem>
        </SelectContent>
      </Select>

      {/* GENERATE HOOKS BUTTON */}
      <Button onClick={handleGenerateHooks} disabled={isGenerating}>
        Generate Hooks
      </Button>

      {/* HOOK OPTIONS */}
      {hooks.length > 0 && (
        <div className="space-y-2 mt-4">
          {hooks.map((h, i) => (
            <div
              key={i}
              className={`p-3 border rounded cursor-pointer ${
                selectedHook === h ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedHook(h)}
            >
              {h}
            </div>
          ))}
        </div>
      )}

      {/* GENERATE POST */}
      <Button onClick={handleGeneratePost} disabled={isGenerating}>
        Generate Post
      </Button>

      {/* LOADING STAGE */}
      {isGenerating && <p className="mt-2 text-sm">{stage}</p>}

      {/* VARIANTS */}
      {generatedPosts.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {generatedPosts.map((post, i) => (
            <div
              key={i}
              className={`border p-4 cursor-pointer ${
                finalPost === post ? "bg-gray-100" : ""
              }`}
              onClick={() => setFinalPost(post)}
            >
              {post.substring(0, 200)}...
            </div>
          ))}
        </div>
      )}

      {/* FINAL PREVIEW */}
      <Textarea value={finalPost} readOnly className="mt-6 h-64" />

    </div>
  );
};

export default PostGenerator;

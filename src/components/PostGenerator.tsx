import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePost } from "@/utils/groq";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import OnboardingModal from "@/components/OnboardingModal";
import FeedbackModal from "@/pages/FeedbackPage";
import { ThumbsUp } from "lucide-react";
import { 
  getOptions, 
  saveGeneratedPost, 
  getUserProfile,
  getIdsForPostGeneration
} from "@/utils/edgeFunctions";

const PostGenerator = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [options, setOptions] = useState({
    topics: [] as { topic_id: number; topic_name: string }[],
    languages: [] as { language_id: number; language_name: string }[],
    tones: [] as { tone_id: number; tone_name: string }[],
    postLengths: [] as { length_id: number; length_type: string }[],
  });
  const [formData, setFormData] = useState({
    topic: "",
    language: "English",
    tone: "Professional",
    postLength: "Medium",
  });
  const [userData, setUserData] = useState({
    designation: "",
    expLevel: "",
    profileImage: "",
    fullName: "",
  });
  const [generatedPost, setGeneratedPost] = useState("");

  const loadUserData = async () => {
    if (!user?.user_id) return;

    try {
      // Use the Edge Function instead of direct Supabase call
      const userData = await getUserProfile(user.user_id);

      if (userData) {
        setUserData({
          designation: userData.user_designation || "",
          expLevel: userData.exp_level || "",
          profileImage: userData.profile_image || "",
          fullName: userData.full_name || "",
        });

        if (userData.isfirsttimeuser === 0) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadOptionsData = async () => {
    if (!user?.user_id) return;

    try {
      // Use the Edge Functions instead of direct Supabase calls
      const [topics, languages, tones, postLengths] = await Promise.all([
        getOptions("topic", user.user_id),
        getOptions("language"),
        getOptions("tone"),
        getOptions("post_length")
      ]);

      setOptions({
        topics: topics || [],
        languages: languages || [],
        tones: tones || [],
        postLengths: postLengths || [],
      });
    } catch (error) {
      console.error("Error loading options data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await loadUserData();
      await loadOptionsData();
      setIsLoading(false);
    };

    loadData();
  }, [user?.user_id]);

  const handleGeneratePost = async () => {
    if (!user?.user_id || !formData.topic) {
      toast({
        title: "Error",
        description: "Please select a topic first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Get IDs for the selected options using the Edge Function
      const ids = await getIdsForPostGeneration({
        topicName: formData.topic,
        languageName: formData.language,
        toneName: formData.tone,
        postLengthType: formData.postLength,
        expLevelName: userData.expLevel
      });

      const postContent = await generatePost({
        topic: formData.topic,
        length: formData.postLength,
        language: formData.language,
        tone: formData.tone,
        experience: userData.expLevel,
        designation: userData.designation,
      });

      const fullPost = `${postContent.content}\n\n${postContent.hashtags}`;
      setGeneratedPost(fullPost);

      // Use the Edge Function to save the post
      await saveGeneratedPost({
        topic_id: ids.topic_id,
        influencer_id: 1, // Default influencer ID
        length_id: ids.length_id,
        language_id: ids.language_id,
        tone_id: ids.tone_id,
        exp_level_id: ids.exp_level_id,
        generated_post: fullPost,
      });

      toast({
        title: "Success!",
        description: "Post generated and saved successfully",
      });
    } catch (error) {
      console.error("Error generating post:", error);
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModalSuccess = async () => {
    setShowModal(false);
    setIsLoading(true);
    try {
      await Promise.all([loadUserData(), loadOptionsData()]);
    } catch (error) {
      console.error("Error reloading data after modal success:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Create Engaging LinkedIn Posts in Seconds
        </h1>
        <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          Professional content that drives engagement and grows your network
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Form Column */}
          <div className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm order-1 md:order-1">
            <h2 className="text-lg sm:text-xl font-semibold">What's your topic?</h2>
            <Select
              value={formData.topic}
              onValueChange={(value) => setFormData({...formData, topic: value})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {options.topics.map((topic) => (
                  <SelectItem key={topic.topic_id} value={topic.topic_name}>
                    {topic.topic_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <h3 className="font-medium mb-2 text-sm sm:text-base">Language</h3>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({...formData, language: value})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {options.languages.map((lang) => (
                    <SelectItem key={lang.language_id} value={lang.language_name}>
                      {lang.language_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm sm:text-base">Tone</h3>
              <Select
                value={formData.tone}
                onValueChange={(value) => setFormData({...formData, tone: value})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {options.tones.map((tone) => (
                    <SelectItem key={tone.tone_id} value={tone.tone_name}>
                      {tone.tone_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm sm:text-base">Post Length</h3>
              <Select
                value={formData.postLength}
                onValueChange={(value) => setFormData({...formData, postLength: value})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select post length" />
                </SelectTrigger>
                <SelectContent>
                  {options.postLengths.map((length) => (
                    <SelectItem key={length.length_id} value={length.length_type}>
                      {length.length_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full mt-4 sm:mt-6"
              onClick={handleGeneratePost}
              disabled={!formData.topic || isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                "Generate Post"
              )}
            </Button>
          </div>

          {/* Preview Column */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm order-2 md:order-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Preview</h2>
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">
                      {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 
                        userData.designation ? userData.designation.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">{userData.fullName}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{userData.designation}</p>
                </div>
              </div>

              <Textarea
                value={generatedPost}
                placeholder="Your LinkedIn post will appear here..."
                readOnly
                className="min-h-[200px] sm:min-h-[250px] md:min-h-[300px] border-none text-sm sm:text-base resize-none"
              />

              <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!generatedPost}
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPost);
                      toast({ title: "Copied to clipboard!" });
                    }}
                    className="text-xs sm:text-sm"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && user?.user_id && (
        <OnboardingModal
          userId={user.user_id}
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
      {/* Responsive Feedback Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
        <Button 
          onClick={() => setShowFeedbackModal(true)}
          className="rounded-full w-12 h-12 shadow-lg flex items-center justify-center"
          aria-label="Feedback"
        >
          <ThumbsUp className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
      )}
    </>
  );
};

export default PostGenerator;

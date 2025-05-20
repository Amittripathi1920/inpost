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
import { generatePost } from "@/utils/groq";
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
    whatToInclude: "",
  });
  const [userData, setUserData] = useState({
    designation: "",
    expLevel: "",
    profileImage: "",
    fullName: "",
  });
  const [generatedPost, setGeneratedPost] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [isTopicInUserPreferences, setIsTopicInUserPreferences] = useState(true);
  
  // Use the existing hook instead of creating a new function
  const isMobile = useIsMobile();
  
  // Add a ref for the preview section
  const previewRef = useRef<HTMLDivElement>(null);

  // Filter topics based on search term
  const filteredTopics = options.topics.filter(topic => 
    topic.topic_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if the current search term matches any topic in user preferences
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setIsTopicInUserPreferences(true);
      return;
    }
    
    const matchingTopic = options.topics.find(topic => 
      topic.topic_name.toLowerCase().trim() === searchTerm.toLowerCase().trim()
    );
    
    setIsTopicInUserPreferences(!!matchingTopic);
  }, [searchTerm, options.topics]);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.topic-combobox-container')) {
        setShowTopicDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add reset function
  const handleReset = () => {
    // Reset form data to defaults
    setFormData({
      topic: "",
      language: "English",
      tone: "Professional",
      postLength: "Medium",
      whatToInclude: "",
    });
    
    // Clear search term and generated post
    setSearchTerm("");
    setGeneratedPost("");
    
    // Reset dropdown state
    setShowTopicDropdown(false);
    setIsTopicInUserPreferences(true);
  };

  const handleGeneratePost = async () => {
    if (!user?.user_id || !formData.topic.trim()) {
      toast({
        title: "Error",
        description: "Please select a topic first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let topicId;
      
      // If the topic is not in user preferences, check and add it
      if (!isTopicInUserPreferences) {
        const designationId = userData.designation ? parseInt(userData.designation) : null;
        const result = await checkAndAddTopicForUser({
          userId: user.user_id,
          topicName: formData.topic.trim(),
          designationId
        });
        
        if (result.success) {
          topicId = result.topicId;
          
          // Refresh the topics list
          await loadOptionsData();
          
          if (result.isNewTopic) {
            toast({
              title: "New Topic Added",
              description: `"${formData.topic}" has been added to your topics.`,
            });
          } else {
            toast({
              title: "Topic Added",
              description: `"${formData.topic}" has been added to your topics.`,
            });
          }
        }
      }

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
        what_to_include: formData.whatToInclude.trim() || "Anything", // Pass the whatToInclude value
      });

      const fullPost = `${postContent.content}\n\n${postContent.hashtags}`;
      setGeneratedPost(fullPost);

      // Use the Edge Function to save the post
      await saveGeneratedPost({
        topic_id: topicId || ids.topic_id,
        influencer_id: 1, // Default influencer ID
        length_id: ids.length_id,
        language_id: ids.language_id,
        tone_id: ids.tone_id,
        exp_level_id: ids.exp_level_id,
        generated_post: fullPost
      });

      toast({
        title: "Success!",
        description: "Post generated and saved successfully",
      });
      
      // Scroll to the preview section on mobile devices after a short delay
      if (isMobile && previewRef.current) {
        setTimeout(() => {
          previewRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 300);
      }
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

  const handleTopicSelect = (topicName: string) => {
    setFormData({...formData, topic: topicName});
    setSearchTerm(topicName);
    setShowTopicDropdown(false);
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
            
            {/* Custom Combobox Implementation */}
            <div className="topic-combobox-container relative">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search or select a topic"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFormData({...formData, topic: e.target.value});
                    setShowTopicDropdown(true);
                  }}
                  onClick={() => setShowTopicDropdown(true)}
                  className="w-full"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {showTopicDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic) => (
                      <div
                        key={topic.topic_id}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          formData.topic === topic.topic_name ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => handleTopicSelect(topic.topic_name)}
                      >
                        {topic.topic_name}
                      </div>
                    ))
                  ) : searchTerm.trim() !== "" ? (
                    <div className="px-4 py-2 text-gray-500">
                      No matching topics found. You can still generate a post with this topic.
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">Start typing to search topics</div>
                  )}
                </div>
              )}
            </div>
            
            {!isTopicInUserPreferences && searchTerm.trim() !== "" && (
              <div className="text-sm text-blue-600">
                This topic will be added to your preferences when you generate a post.
              </div>
            )}

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

            {/* What to Include section */}
            <div>
              <h3 className="font-medium mb-2 text-sm sm:text-base">What to Include (Optional)</h3>
              <Textarea
                placeholder="Specify anything you'd like to include in your post (e.g., statistics, personal story, call to action)"
                value={formData.whatToInclude}
                onChange={(e) => setFormData({...formData, whatToInclude: e.target.value})}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Buttons section with Generate and Reset */}
            <div className="flex gap-2 mt-4 sm:mt-6">
              <Button
                className="flex-1"
                onClick={handleGeneratePost}
                disabled={!formData.topic.trim() || isGenerating}
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
              
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-auto"
                disabled={isGenerating}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Preview Column */}
          <div 
            ref={previewRef} 
            className="bg-white p-4 sm:p-6 rounded-lg shadow-sm order-2 md:order-2"
          >
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
                className="min-h-[350px] sm:min-h-[300px] md:min-h-[300px] border-none text-sm sm:text-base resize-none"
              />

              <div className="flex justify-between items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t w-full">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!generatedPost}
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPost);
                    toast({ title: "Copied to clipboard!" });
                  }}
                  className="text-xs sm:text-sm w-[49%]"
                >
                  Copy
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!generatedPost}
                  onClick={() => {
                    // LinkedIn sharing URL
                    const linkedinUrl = `https://www.linkedin.com/share/new?text=${encodeURIComponent(generatedPost)}`;
                    // Open in a new tab
                    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
                    toast({ title: "Opening LinkedIn..." });
                  }}
                  className="text-xs sm:text-sm flex items-center justify-center gap-1 w-[49%]"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    className="h-4 w-4"
                    style={{ fill: "#0077B5" }}
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Share to LinkedIn
                </Button>
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

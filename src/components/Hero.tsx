
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleCTAClick = () => {
    if (isAuthenticated) {
      navigate("/generate");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative overflow-hidden linkedin-gradient-bg">
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      <div className="absolute inset-0 hero-gradient"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              <span className="block">Create Engaging</span>
              <span className="block text-primary">LinkedIn Posts</span>
              <span className="block">In Seconds</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-lg">
              Generate professional, attention-grabbing LinkedIn posts tailored to your industry, experience level, and preferred tone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-6 py-6"
                onClick={handleCTAClick}
              >
                Generate Your First Post
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-6 py-6"
                onClick={() => navigate("/#features")}
              >
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Multiple Languages</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Customizable Options</span>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-2xl bg-white shadow-xl p-6 animate-fade-in">
            <div className="absolute -top-4 -left-4 bg-primary text-white rounded-full px-4 py-1 text-sm font-medium">
              Example Post
            </div>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                JD
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-800">Jane Doe</p>
                <p className="text-xs text-gray-500">Senior Product Manager at Tech Company</p>
              </div>
            </div>
            <div className="prose prose-sm text-gray-700">
              <p>I'm thrilled to announce that our team has just launched a game-changing product feature that's been 6 months in the making! 🚀</p>
              <p>The journey wasn't always smooth, but through persistent collaboration and innovative problem-solving, we've delivered something truly remarkable.</p>
              <p>Key lessons learned:</p>
              <ul>
                <li>User feedback is gold - we iterated 12 times based on direct customer insights</li>
                <li>Cross-functional teamwork creates magic when everyone feels ownership</li>
                <li>Data should inform decisions, but don't ignore your intuition</li>
              </ul>
              <p>Excited to see how this impacts our users' experience! Have you launched anything recently that taught you valuable lessons?</p>
              <p>#ProductManagement #Innovation #Leadership #UserExperience</p>
            </div>
            <div className="border-t mt-4 pt-4 flex items-center justify-around text-gray-500 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Like</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>Comment</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

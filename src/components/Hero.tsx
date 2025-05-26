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
          
          <div className="relative animate-fade-in flex justify-center items-center">
            <img 
              src="/assets/your-gif-file.gif" // Update this path to your actual GIF file
              alt="LinkedIn post generation demo"
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

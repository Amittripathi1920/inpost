import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 text-center bg-background">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-primary">
            AI-Powered LinkedIn Post Generator
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Create engaging, personalized LinkedIn content in seconds. Save time, grow your network, and boost your visibility.
          </p>
          <Link to="/login">
            <Button size="lg" className="text-lg px-8">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Generate LinkedIn Posts That Get Noticed
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Stand out with professionally crafted content tailored to your needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Customizable Options",
                desc: "Choose your topic, length, tone, experience level, and language to create posts that match your professional identity.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                ),
              },
              {
                title: "Instant Generation",
                desc: "Get high-quality LinkedIn posts in seconds, complete with relevant hashtags optimized for visibility.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                ),
              },
              {
                title: "Analytics Dashboard",
                desc: "Track your post history, analyze engagement patterns, and understand what content performs best.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                ),
              },
            ].map(({ title, desc, icon }, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Create professional LinkedIn posts in just three simple steps
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {[
              {
                step: "1",
                title: "Select Your Options",
                desc: "Choose your topic, length, tone, and other preferences for your LinkedIn post.",
              },
              {
                step: "2",
                title: "Generate Content",
                desc: "Our AI instantly creates a tailored post that matches your specifications.",
              },
              {
                step: "3",
                title: "Copy and Share",
                desc: "Copy your post with one click and share it directly to LinkedIn.",
              },
            ].map(({ step, title, desc }, idx) => (
              <div key={idx} className="text-center md:w-1/3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-primary">{step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to Enhance Your LinkedIn Presence?
          </h2>
          <p className="text-xl text-primary-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are using our platform to create engaging LinkedIn content.
          </p>
          <Link to="/login">
            <Button
              size="lg"
              className="text-lg px-8 bg-white text-primary hover:bg-gray-100"
            >
              Create Your First Post
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;

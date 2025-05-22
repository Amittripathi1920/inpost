import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

const Home = () => {
  return (
    <>
      <Hero />

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
            {/* Feature Cards */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable Options</h3>
              <p className="text-gray-600">
                Choose your topic, length, tone, experience level, and language to create posts that match your professional identity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Generation</h3>
              <p className="text-gray-600">
                Get high-quality LinkedIn posts in seconds, complete with relevant hashtags optimized for visibility.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Track your post history, analyze engagement patterns, and understand what content performs best.
              </p>
            </div>
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
            {["Select Your Options", "Generate Content", "Copy and Share"].map((title, i) => (
              <div key={i} className="text-center md:w-1/3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-primary">{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">
                  {i === 0
                    ? "Choose your topic, length, tone, and other preferences for your LinkedIn post."
                    : i === 1
                    ? "Our AI instantly creates a tailored post that matches your specifications."
                    : "Copy your post with one click and share it directly to LinkedIn."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-400 px-6 py-16 shadow-xl text-center">
            {/* Gradient Circle Glow */}
            <div className="absolute inset-0 -z-10 blur-3xl opacity-20">
              <svg viewBox="0 0 1024 1024" className="absolute size-[512px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                <circle cx="512" cy="512" r="512" fill="url(#cta-gradient)" />
                <defs>
                  <radialGradient id="cta-gradient">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#60a5fa" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Text Section */}
            <div className="mx-auto max-w-2xl">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Ready to Enhance LinkedIn Presence?
              </h2>
              <p className="mt-4 text-lg text-gray-200 text-pretty text-center">
                Join thousands of professionals who are using our platform to create engaging LinkedIn content.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="text-base font-semibold shadow-lg hover:scale-105 transition-transform"
                  asChild
                >
                  <a href="https://inpostgen.netlify.app/generate" target="_blank" rel="noopener noreferrer">
                    Get Started
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-white hover:text-white/80 text-base"
                >
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Original CTA Section */}
{/*       <section className="py-16 bg-primary">
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
      </section> */}
    </>
  );
};

export default Home;

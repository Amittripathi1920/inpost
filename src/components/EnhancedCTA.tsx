"use client"

import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

export default function EnhancedCTA() {
  return (
    <section className="bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-400 px-6 py-16 shadow-xl sm:px-16 text-center">
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
              Join thousands of professionals
              who are using our platform to create engaging LinkedIn content.
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
  )
}

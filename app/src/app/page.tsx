"use client"

import Link from "next/link"
import { useAuth } from "@context/AuthContext"
import { Button } from "@components/ui/button"
import { Sparkles, ArrowRight, Shield, Zap, Bot, Workflow } from "lucide-react"

const features = [
  { icon: Bot, title: "AI Agents", desc: "Intelligent agents that automate your marketing workflows" },
  { icon: Workflow, title: "Workspaces", desc: "Organize your team and projects in dedicated workspaces" },
  { icon: Zap, title: "Ad Automation", desc: "Manage Meta & TikTok ads with AI-powered optimization" },
  { icon: Shield, title: "Secure", desc: "Enterprise-grade security with JWT authentication" },
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">Winsta AI</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          AI-Powered Marketing
          <span className="text-indigo-600"> Platform</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Automate your ad campaigns, manage workspaces, and leverage AI agents to
          supercharge your marketing operations.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="text-base">
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-base">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all">
              <Icon className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Winsta AI. All rights reserved.
      </footer>
    </div>
  )
}

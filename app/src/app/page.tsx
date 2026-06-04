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
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Winsta</span>
            <span className="text-[10px] text-rose-500 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">AI</span>
          </div>
          <div className="flex items-center gap-3">
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-sm text-rose-700 font-medium mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Marketing Platform
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl leading-tight">
          Supercharge Your
          <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent"> Marketing</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Automate your ad campaigns, manage workspaces, and leverage AI agents to
          supercharge your marketing operations.
        </p>
        <div className="mt-10 flex gap-3 justify-center">
          <Link href="/signup">
            <Button size="lg" className="text-base gap-2">
              Start Free <ArrowRight className="h-4 w-4" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl border border-gray-200/80 hover:border-rose-200 hover:shadow-sm transition-all duration-200 group">
              <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center mb-4 group-hover:bg-rose-100 transition-colors">
                <Icon className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="font-semibold text-[15px] text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
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

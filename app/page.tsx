"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, Scale, CheckCircle, Zap, ArrowRight, Play, Sparkles, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-slate-600"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin animation-delay-150"></div>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Mock Interviews",
      description: "Experience realistic UPSC board simulations with intelligent questioning patterns",
      color: "slate",
      gradient: "from-slate-500 to-slate-700",
    },
    {
      icon: Zap,
      title: "Instant Performance Analysis",
      description: "Get detailed feedback on communication skills, content depth, and presentation",
      color: "blue",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      icon: Target,
      title: "Personalized Preparation",
      description: "Tailored questions based on your DAF, optional subject, and career background",
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-700",
    },
    {
      icon: Scale,
      title: "Ethics & Current Affairs",
      description: "Stay updated with latest developments and practice ethical decision-making",
      color: "amber",
      gradient: "from-amber-500 to-amber-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-100/30 to-slate-100/30 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            left: "10%",
            top: "20%",
          }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-emerald-100/20 to-blue-100/20 rounded-full blur-2xl transition-transform duration-1500 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
            right: "15%",
            bottom: "30%",
          }}
        />
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-slate-700 transition-transform group-hover:scale-110 duration-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                CivilsCoach.ai
              </span>
            </div>
            <div className="flex space-x-3">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="hover:bg-slate-100 transition-all duration-300 hover:scale-105 font-medium text-slate-700"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group font-medium">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full text-slate-700 text-sm font-medium mb-8 hover:shadow-lg transition-all duration-300 cursor-pointer group border border-slate-200/50">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
              <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Trusted by UPSC Aspirants Nationwide
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Master Your UPSC
              <span className="block bg-gradient-to-r from-slate-700 via-blue-600 to-slate-800 bg-clip-text text-transparent animate-gradient">
                Personality Test
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              AI-powered mock interviews with comprehensive feedback.
              <span className="font-semibold text-slate-800">
                {" "}
                Practice with purpose, improve with precision, perform with confidence.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <BookOpen className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Free AI Mock Interview
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 group text-slate-700 font-medium"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-125 transition-transform duration-300" />
                Watch Demo
              </Button>
            </div>

            {/* Floating elements */}
            <div className="relative">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full animate-float opacity-60`}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${10 + i * 5}px`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + i}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                CivilsCoach.ai?
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Comprehensive preparation designed specifically for UPSC interview success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm relative overflow-hidden"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <CardHeader className="text-center p-8 relative z-10">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl relative`}
                  >
                    {hoveredCard === index && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/30 to-transparent animate-pulse" />
                    )}
                    <feature.icon
                      className={`h-8 w-8 text-${feature.color}-600 group-hover:rotate-12 transition-transform duration-500`}
                    />
                  </div>
                  <CardTitle className="text-xl mb-4 group-hover:text-slate-700 transition-colors duration-300 font-semibold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed font-medium">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Complete UPSC Interview{" "}
              <span className="bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                Preparation Suite
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Everything you need to excel in your UPSC Personality Test, powered by advanced AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              "AI-based panel simulation",
              "Real-time speech analytics",
              "DAF-based questioning",
              "Current affairs updates",
              "Optional subject support",
              "Personalized study plans",
            ].map((feature, index) => (
              <div key={index} className="flex items-center group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <CheckCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl text-white font-semibold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
              Practice with purpose. Improve with precision. Perform with confidence.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-800 to-slate-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "30px 30px",
          }}
        ></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Ace Your UPSC Interview?</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Join dedicated UPSC aspirants who trust CivilsCoach.ai for comprehensive interview preparation
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {[
              "Start with a free AI mock",
              "Get instant performance scorecard",
              "Practice DAF, ethics, and optional subjects",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center justify-center text-slate-200 group">
                <CheckCircle className="h-6 w-6 mr-3 group-hover:scale-110 group-hover:text-emerald-400 transition-all duration-300" />
                <span className="font-medium group-hover:text-white transition-colors duration-300">{benefit}</span>
              </div>
            ))}
          </div>

          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="secondary"
              className="text-xl px-10 py-5 bg-white text-slate-800 hover:bg-slate-50 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 font-semibold group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <BookOpen className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              Start Your Preparation Journey
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white p-2 rounded-lg">
                  <Brain className="h-8 w-8 text-slate-700 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-slate-300 to-white bg-clip-text text-transparent">
                CivilsCoach.ai
              </span>
            </div>
            <p className="text-slate-400 mb-4 text-lg font-medium">
              Master Your UPSC Personality Test with AI-Powered Interview Coaching
            </p>
            <p className="text-slate-500">© 2024 CivilsCoach.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

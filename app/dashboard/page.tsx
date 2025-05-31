"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Plus,
  Clock,
  BookOpen,
  LogOut,
  User,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Play,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"

interface Interview {
  id: string
  job_title: string
  company: string
  round_type: string
  average_score: number
  performance_band: string
  completed_at: string
  status: string
}

export default function DashboardPage() {
  const { user, signOut, loading, isDemo, isConfigured } = useAuth()
  const router = useRouter()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredAction, setHoveredAction] = useState<number | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (user) {
      if (isDemo || !isConfigured) {
        // Load demo data
        const demoInterviews = [
          {
            id: "demo-1",
            job_title: "UPSC Civil Services",
            company: "Government of India",
            round_type: "Standard Board",
            average_score: 8.5,
            performance_band: "Very Good",
            completed_at: new Date(Date.now() - 86400000).toISOString(),
            status: "completed",
          },
          {
            id: "demo-2",
            job_title: "UPSC Civil Services",
            company: "Government of India",
            round_type: "Subject Expert Heavy",
            average_score: 7.2,
            performance_band: "Good",
            completed_at: new Date(Date.now() - 172800000).toISOString(),
            status: "completed",
          },
        ]
        setInterviews(demoInterviews)
      } else {
        fetchUserData()
      }
    }
  }, [user, isDemo, isConfigured])

  const fetchUserData = async () => {
    try {
      const supabase = getSupabaseClient()

      // Fetch recent interviews
      const { data: interviewsData } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (interviewsData) {
        setInterviews(interviewsData)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

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

  if (!user) return null

  const getPerformanceBadgeColor = (band: string) => {
    switch (band) {
      case "Outstanding":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Very Good":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Good":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Satisfactory":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getStatusBadge = () => {
    if (isConfigured && !isDemo) {
      return (
        <Badge variant="outline" className="ml-3 text-emerald-600 border-emerald-200 bg-emerald-50 font-medium">
          <CheckCircle className="h-3 w-3 mr-1" />
          Live Mode
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="ml-3 text-amber-600 border-amber-200 bg-amber-50 font-medium">
        <AlertCircle className="h-3 w-3 mr-1" />
        Demo Mode
      </Badge>
    )
  }

  const getStatusMessage = () => {
    if (isConfigured && !isDemo) {
      return null
    }
    return (
      <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/20 to-orange-100/20"></div>
        <div className="flex items-start relative z-10">
          <AlertCircle className="h-6 w-6 text-amber-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Demo Mode Active</h4>
            <p className="text-amber-700 leading-relaxed font-medium">
              You're viewing demo data. To use full functionality with real data persistence, please configure your
              Supabase integration.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const actions = [
    {
      icon: Plus,
      title: "Start New Interview",
      description: "Begin a comprehensive mock interview session",
      color: "slate",
      href: "/interview/setup",
      primary: true,
    },
    {
      icon: BarChart3,
      title: "View Analytics",
      description: "Track your progress and performance",
      color: "blue",
      href: "/analytics",
    },
    {
      icon: BookOpen,
      title: "Question Bank",
      description: "Browse practice questions by category",
      color: "emerald",
      href: "/question-bank",
    },
    {
      icon: User,
      title: "Profile Settings",
      description: "Update preferences and DAF details",
      color: "amber",
      href: "/profile",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
              {getStatusBadge()}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 hidden sm:block font-medium">
                Welcome, {user.user_metadata?.name || user.email?.split("@")[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Message */}
        {getStatusMessage()}

        {/* Welcome Section */}
        <div
          className={`mb-12 text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full text-slate-700 text-sm font-medium mb-6 border border-slate-200/50">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
            Ready for your next practice session?
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
              {user.user_metadata?.name || "there"}
            </span>
            ! 👋
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Continue your UPSC interview preparation journey with AI-powered practice sessions
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {actions.map((action, index) => (
            <Link key={index} href={action.href || "#"}>
              <Card
                className={`group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 relative overflow-hidden ${
                  action.primary
                    ? "bg-gradient-to-br from-slate-700 to-slate-900 text-white"
                    : "bg-white hover:bg-slate-50"
                }`}
                onMouseEnter={() => setHoveredAction(index)}
                onMouseLeave={() => setHoveredAction(null)}
              >
                {/* Animated background */}
                {!action.primary && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${action.color}-500/5 to-${action.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                )}

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <CardContent className="p-8 text-center relative z-10">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${
                      action.primary
                        ? "bg-white/20 backdrop-blur-sm"
                        : `bg-gradient-to-br from-${action.color}-100 to-${action.color}-200`
                    } flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl relative`}
                  >
                    {hoveredAction === index && !action.primary && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/30 to-transparent animate-pulse" />
                    )}
                    <action.icon
                      className={`h-8 w-8 ${
                        action.primary ? "text-white" : `text-${action.color}-600`
                      } group-hover:rotate-12 transition-transform duration-500`}
                    />
                  </div>
                  <h3
                    className={`font-bold text-lg mb-3 ${
                      action.primary ? "text-white" : "text-slate-900 group-hover:text-slate-700"
                    } transition-colors duration-300`}
                  >
                    {action.title}
                  </h3>
                  <p className={`${action.primary ? "text-slate-200" : "text-slate-600"} leading-relaxed font-medium`}>
                    {action.description}
                  </p>
                  {action.primary && (
                    <div className="mt-4">
                      <Play className="h-5 w-5 mx-auto group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Interviews */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">Recent Interview Sessions</CardTitle>
            <CardDescription className="text-slate-600 font-medium">
              Your latest practice sessions and performance insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            {interviews.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-blue-200 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  <Clock className="h-12 w-12 text-slate-600 relative z-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">No interviews yet</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed font-medium">
                  Start your first mock interview to begin tracking your progress and receiving personalized feedback
                </p>
                <Link href="/interview/setup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Start First Interview
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {interviews.map((interview, index) => (
                  <div
                    key={interview.id}
                    className="group p-6 border border-slate-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:bg-slate-50/50 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {interview.job_title}
                        </h4>
                        <p className="text-slate-600 mb-2 font-medium">
                          {interview.company} • {interview.round_type}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          {new Date(interview.completed_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-6">
                        {interview.average_score && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {interview.average_score.toFixed(1)}
                            </div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Score</div>
                          </div>
                        )}
                        {interview.performance_band && (
                          <Badge
                            className={`${getPerformanceBadgeColor(interview.performance_band)} px-4 py-2 font-medium`}
                          >
                            {interview.performance_band}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

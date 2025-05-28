"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Plus, TrendingUp, Clock, BookOpen, LogOut, User, BarChart3, AlertCircle } from "lucide-react"
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
  const { user, signOut, loading, isDemo: demoMode } = useAuth()
  const router = useRouter()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    improvementRate: 0,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      if (demoMode) {
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
        setStats({
          totalInterviews: 2,
          averageScore: 7.85,
          improvementRate: 78.5,
        })
      } else {
        fetchUserData()
      }
    }
  }, [user, demoMode])

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

        // Calculate stats
        const completed = interviewsData.filter((i) => i.status === "completed")
        const avgScore =
          completed.length > 0 ? completed.reduce((sum, i) => sum + (i.average_score || 0), 0) / completed.length : 0

        setStats({
          totalInterviews: completed.length,
          averageScore: avgScore,
          improvementRate: Math.min(avgScore * 10, 100), // Mock improvement rate
        })
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  const getPerformanceBadgeColor = (band: string) => {
    switch (band) {
      case "Outstanding":
        return "bg-green-100 text-green-800"
      case "Very Good":
        return "bg-blue-100 text-blue-800"
      case "Good":
        return "bg-yellow-100 text-yellow-800"
      case "Satisfactory":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">UPSC Interview Coach</span>
              {demoMode && (
                <Badge variant="outline" className="ml-2 text-orange-600 border-orange-200">
                  Demo Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.user_metadata?.name || user.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Mode Notice */}
        {demoMode && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <h4 className="font-medium text-orange-800">Demo Mode Active</h4>
                <p className="text-sm text-orange-700">
                  You're viewing demo data. To use full functionality, please configure your Supabase integration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.user_metadata?.name || "there"}! 👋
          </h1>
          <p className="text-gray-600">Ready to practice for your UPSC interview? Let's get started!</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/interview/setup">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Plus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Start New Interview</h3>
                <p className="text-sm text-gray-600">Begin a mock interview session</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">View Analytics</h3>
              <p className="text-sm text-gray-600">Track your progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Bookmarked Questions</h3>
              <p className="text-sm text-gray-600">Review saved questions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Profile Settings</h3>
              <p className="text-sm text-gray-600">Update preferences</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalInterviews}</div>
              <p className="text-sm text-gray-600 mt-1">Completed sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.averageScore.toFixed(1)}/10</div>
              <Progress value={stats.averageScore * 10} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Improvement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.improvementRate.toFixed(0)}%</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Trending up</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Interviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Interview Sessions</CardTitle>
            <CardDescription>Your latest practice sessions and performance</CardDescription>
          </CardHeader>
          <CardContent>
            {interviews.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
                <p className="text-gray-600 mb-4">Start your first mock interview to see your progress here</p>
                <Link href="/interview/setup">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Start First Interview
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{interview.job_title}</h4>
                      <p className="text-sm text-gray-600">
                        {interview.company} • {interview.round_type}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(interview.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {interview.average_score && (
                        <div className="text-center">
                          <div className="text-lg font-bold">{interview.average_score.toFixed(1)}</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                      )}
                      {interview.performance_band && (
                        <Badge className={getPerformanceBadgeColor(interview.performance_band)}>
                          {interview.performance_band}
                        </Badge>
                      )}
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

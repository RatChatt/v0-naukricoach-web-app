"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Home, Download, Calendar, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient, isDemo } from "@/lib/supabase"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { exportAnalyticsReport } from "@/lib/export-utils"

interface PerformanceData {
  date: string
  score: number
}

interface CategoryPerformance {
  category: string
  score: number
  count: number
}

interface ComplexityPerformance {
  complexity: number
  score: number
  count: number
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([])
  const [complexityPerformance, setComplexityPerformance] = useState<ComplexityPerformance[]>([])
  const [strengthsWeaknesses, setStrengthsWeaknesses] = useState({
    strengths: [] as string[],
    weaknesses: [] as string[],
  })
  const [overallStats, setOverallStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    totalQuestions: 0,
    improvementRate: 0,
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [user])

  const fetchAnalyticsData = async () => {
    setLoading(true)

    if (isDemo) {
      // Load demo analytics data
      generateDemoData()
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()

      // Fetch interviews
      const { data: interviews } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: true })

      // Fetch responses with questions
      const { data: responses } = await supabase
        .from("responses")
        .select(`
          *,
          questions (
            question_type,
            complexity,
            category
          ),
          interviews!inner (
            user_id
          )
        `)
        .eq("interviews.user_id", user?.id)

      if (interviews && responses) {
        processAnalyticsData(interviews, responses)
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateDemoData = () => {
    // Generate performance over time
    const performanceOverTime = [
      { date: "2023-10-01", score: 6.2 },
      { date: "2023-10-15", score: 6.5 },
      { date: "2023-11-01", score: 6.8 },
      { date: "2023-11-15", score: 7.0 },
      { date: "2023-12-01", score: 7.3 },
      { date: "2023-12-15", score: 7.5 },
      { date: "2024-01-01", score: 7.8 },
      { date: "2024-01-15", score: 8.0 },
    ]
    setPerformanceData(performanceOverTime)

    // Generate category performance
    const categoryData = [
      { category: "Current Affairs", score: 8.2, count: 15 },
      { category: "Ethics", score: 7.8, count: 12 },
      { category: "Optional Subject", score: 8.5, count: 10 },
      { category: "Personal", score: 7.9, count: 8 },
      { category: "Governance", score: 7.2, count: 14 },
      { category: "International Relations", score: 6.8, count: 9 },
      { category: "Economy", score: 7.5, count: 11 },
    ]
    setCategoryPerformance(categoryData)

    // Generate complexity performance
    const complexityData = [
      { complexity: 1, score: 8.9, count: 5 },
      { complexity: 2, score: 8.5, count: 12 },
      { complexity: 3, score: 7.8, count: 18 },
      { complexity: 4, score: 7.0, count: 15 },
      { complexity: 5, score: 6.5, count: 8 },
    ]
    setComplexityPerformance(complexityData)

    // Set strengths and weaknesses
    setStrengthsWeaknesses({
      strengths: ["Current Affairs", "Optional Subject", "Ethics & Integrity", "Personal Background"],
      weaknesses: ["International Relations", "Governance & Administration", "Complex Policy Questions"],
    })

    // Set overall stats
    setOverallStats({
      totalInterviews: 8,
      averageScore: 7.5,
      totalQuestions: 58,
      improvementRate: 29,
    })
  }

  const processAnalyticsData = (interviews: any[], responses: any[]) => {
    // Process performance over time
    const performanceByDate = interviews.map((interview) => ({
      date: new Date(interview.completed_at).toISOString().split("T")[0],
      score: interview.average_score || 0,
    }))
    setPerformanceData(performanceByDate)

    // Process category performance
    const categoryMap = new Map<string, { total: number; count: number }>()
    responses.forEach((response) => {
      const category = response.questions?.category || "unknown"
      const score = response.ai_score || 0

      if (!categoryMap.has(category)) {
        categoryMap.set(category, { total: 0, count: 0 })
      }

      const current = categoryMap.get(category)!
      categoryMap.set(category, {
        total: current.total + score,
        count: current.count + 1,
      })
    })

    const categoryData = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      score: data.total / data.count,
      count: data.count,
    }))
    setCategoryPerformance(categoryData)

    // Process complexity performance
    const complexityMap = new Map<number, { total: number; count: number }>()
    responses.forEach((response) => {
      const complexity = response.questions?.complexity || 0
      const score = response.ai_score || 0

      if (!complexityMap.has(complexity)) {
        complexityMap.set(complexity, { total: 0, count: 0 })
      }

      const current = complexityMap.get(complexity)!
      complexityMap.set(complexity, {
        total: current.total + score,
        count: current.count + 1,
      })
    })

    const complexityData = Array.from(complexityMap.entries()).map(([complexity, data]) => ({
      complexity,
      score: data.total / data.count,
      count: data.count,
    }))
    setComplexityPerformance(complexityData)

    // Determine strengths and weaknesses
    const sortedCategories = [...categoryData].sort((a, b) => b.score - a.score)
    const strengths = sortedCategories.slice(0, 4).map((c) => c.category)
    const weaknesses = sortedCategories.slice(-3).map((c) => c.category)
    setStrengthsWeaknesses({ strengths, weaknesses })

    // Calculate overall stats
    const totalInterviews = interviews.length
    const averageScore = interviews.reduce((sum, i) => sum + (i.average_score || 0), 0) / totalInterviews
    const totalQuestions = responses.length

    // Calculate improvement rate (difference between first and last interview)
    let improvementRate = 0
    if (interviews.length >= 2) {
      const firstScore = interviews[0].average_score || 0
      const lastScore = interviews[interviews.length - 1].average_score || 0
      improvementRate = Math.round(((lastScore - firstScore) / firstScore) * 100)
    }

    setOverallStats({
      totalInterviews,
      averageScore,
      totalQuestions,
      improvementRate,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getComplexityLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Basic"
      case 2:
        return "Easy"
      case 3:
        return "Moderate"
      case 4:
        return "Challenging"
      case 5:
        return "Advanced"
      default:
        return "Unknown"
    }
  }

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ]

  const exportAnalytics = () => {
    const analyticsData = {
      interview: {
        performance_band:
          overallStats.averageScore >= 8
            ? "Outstanding"
            : overallStats.averageScore >= 7
              ? "Very Good"
              : overallStats.averageScore >= 6
                ? "Good"
                : "Satisfactory",
      },
      responses: performanceData.map((item, index) => ({
        created_at: item.date,
        ai_score: item.score,
        time_taken: Math.floor(Math.random() * 180) + 60, // Random time between 1-4 minutes
        questions: {
          category: categoryPerformance[index % categoryPerformance.length]?.category || "general",
          question_type: ["personal", "current-affairs", "ethics", "governance"][index % 4],
        },
      })),
    }

    exportAnalyticsReport(analyticsData)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
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
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={exportAnalytics}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
          <p className="text-gray-600">Track your progress and identify areas for improvement</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Interviews</p>
                  <p className="text-3xl font-bold text-blue-600">{overallStats.totalInterviews}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Average Score</p>
                  <p className="text-3xl font-bold text-green-600">{overallStats.averageScore.toFixed(1)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Questions Answered</p>
                  <p className="text-3xl font-bold text-purple-600">{overallStats.totalQuestions}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Improvement Rate</p>
                  <p className="text-3xl font-bold text-orange-600">{overallStats.improvementRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="mb-8">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3">
            <TabsTrigger value="performance">Performance Trends</TabsTrigger>
            <TabsTrigger value="categories">Category Analysis</TabsTrigger>
            <TabsTrigger value="complexity">Complexity Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>Your interview scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      score: {
                        label: "Score",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={formatDate} />
                        <YAxis domain={[0, 10]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="var(--color-score)"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Performance Insights</h4>
                  <p className="text-blue-700">
                    {overallStats.improvementRate > 0
                      ? `You've shown a ${overallStats.improvementRate}% improvement in your interview performance. Keep up the good work!`
                      : "Continue practicing to improve your interview performance."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>Your scores across different question categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="h-[400px]">
                    <ChartContainer
                      config={{
                        score: {
                          label: "Score",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis domain={[0, 10]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="score" fill="var(--color-score)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>

                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                    <ul className="list-disc list-inside space-y-1 text-green-700">
                      {strengthsWeaknesses.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Areas for Improvement</h4>
                    <ul className="list-disc list-inside space-y-1 text-red-700">
                      {strengthsWeaknesses.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complexity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Question Complexity</CardTitle>
                <CardDescription>How you perform across different difficulty levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      score: {
                        label: "Score",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={complexityPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="complexity" tickFormatter={getComplexityLabel} />
                        <YAxis domain={[0, 10]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="score" fill="var(--color-score)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Complexity Insights</h4>
                  <p className="text-blue-700">
                    {complexityPerformance.length > 0 &&
                    complexityPerformance[0].score > complexityPerformance[complexityPerformance.length - 1].score
                      ? "You perform better on simpler questions. Focus on practicing more complex questions to improve your overall performance."
                      : "You handle complex questions well. Continue to maintain this strength while practicing a variety of question types."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
            <CardDescription>Based on your performance analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                <h4 className="font-medium text-blue-800 mb-1">Focus Areas</h4>
                <p className="text-blue-700">
                  Concentrate on {strengthsWeaknesses.weaknesses[0]} and {strengthsWeaknesses.weaknesses[1]} questions
                  to improve your overall performance.
                </p>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                <h4 className="font-medium text-green-800 mb-1">Practice Strategy</h4>
                <p className="text-green-700">
                  Continue to leverage your strengths in {strengthsWeaknesses.strengths[0]} and{" "}
                  {strengthsWeaknesses.strengths[1]} while gradually increasing the complexity of practice questions.
                </p>
              </div>

              <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                <h4 className="font-medium text-purple-800 mb-1">Next Steps</h4>
                <p className="text-purple-700">
                  Schedule at least 2 more mock interviews focusing on your weaker areas before your actual UPSC
                  interview.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

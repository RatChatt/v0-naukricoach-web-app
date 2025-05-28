"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Award, TrendingUp, RotateCcw, Home, Share } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

interface InterviewResult {
  id: string
  job_title: string
  company: string
  round_type: string
  average_score: number
  performance_band: string
  completed_at: string
}

interface ResponseResult {
  id?: string
  user_answer: string
  ai_score: number
  ai_feedback: string
  time_taken: number
  questions: {
    text: string
    question_type: string
  }
}

export default function ResultsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [interview, setInterview] = useState<InterviewResult | null>(null)
  const [responses, setResponses] = useState<ResponseResult[]>([])
  const [loading, setLoading] = useState(true)
  const [boardMembers, setBoardMembers] = useState<any[]>([])

  useEffect(() => {
    const interviewId = searchParams.get("id")

    // First try to get data from session storage (for immediate results)
    const sessionData = sessionStorage.getItem("interviewResults")
    if (sessionData) {
      const data = JSON.parse(sessionData)
      setInterview(data.interview)
      setResponses(data.responses)
      if (data.boardMembers) {
        setBoardMembers(data.boardMembers)
      }
      setLoading(false)
      // Clear session storage after use
      sessionStorage.removeItem("interviewResults")
      return
    }

    // Fallback to database fetch
    if (interviewId && interviewId !== "demo") {
      fetchResults(interviewId)
    } else {
      // Demo mode fallback
      setInterview({
        id: "demo",
        job_title: "Software Engineer",
        company: "Demo Company",
        round_type: "Technical Round",
        average_score: 7.5,
        performance_band: "You Did Okay",
        completed_at: new Date().toISOString(),
      })
      setResponses([
        {
          user_answer: "I have 3 years of experience in software development...",
          ai_score: 8.0,
          ai_feedback: "Great answer! You provided specific examples and showed clear understanding.",
          time_taken: 120,
          questions: {
            text: "Tell me about your experience with software development.",
            question_type: "behavioral",
          },
        },
      ])
      setLoading(false)
    }
  }, [searchParams])

  const fetchResults = async (interviewId: string) => {
    try {
      const supabase = getSupabaseClient()

      // Fetch interview details
      const { data: interviewData } = await supabase.from("interviews").select("*").eq("id", interviewId).single()

      // Fetch responses with questions
      const { data: responsesData } = await supabase
        .from("responses")
        .select(`
          *,
          questions (
            text,
            question_type
          )
        `)
        .eq("interview_id", interviewId)

      if (interviewData) setInterview(interviewData)
      if (responsesData) setResponses(responsesData)
    } catch (error) {
      console.error("Error fetching results:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceBadgeColor = (band: string) => {
    switch (band) {
      case "Well Done":
        return "bg-green-100 text-green-800 border-green-200"
      case "You Did Okay":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Scope for Improvement":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPerformanceMessage = (band: string) => {
    switch (band) {
      case "Well Done":
        return "Excellent performance! You demonstrated strong knowledge and communication skills."
      case "You Did Okay":
        return "Good effort! With some practice, you can improve your interview performance."
      case "Scope for Improvement":
        return "Keep practicing! Focus on the feedback areas to enhance your interview skills."
      default:
        return "Interview completed successfully!"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Interview not found</h2>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
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
              <span className="text-2xl font-bold text-gray-900">NaukriCoach</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/interview/setup">
                <Button>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Interview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
            <p className="text-gray-600">Here's how you performed in your mock interview</p>
          </div>
        </div>

        {/* Performance Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>
              {interview.job_title} at {interview.company} • {interview.round_type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{interview.average_score.toFixed(1)}/10</div>
                <div className="text-sm text-gray-600">Overall Score</div>
                <Progress value={interview.average_score * 10} className="mt-2" />
              </div>
              <div className="text-center">
                <Badge className={`${getPerformanceBadgeColor(interview.performance_band)} text-lg px-4 py-2 mb-2`}>
                  {interview.performance_band}
                </Badge>
                <div className="text-sm text-gray-600">Performance Band</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{responses.length}</div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">{getPerformanceMessage(interview.performance_band)}</p>
            </div>
          </CardContent>
        </Card>

        {boardMembers.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Interview Board</CardTitle>
              <CardDescription>The panel that conducted your interview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {boardMembers.map((member) => (
                  <div key={member.id} className="text-center p-3 border rounded-lg">
                    <div className="text-2xl mb-2">{member.avatar}</div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-gray-600">{member.role}</div>
                    <div className="text-xs text-gray-500">{member.expertise}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Feedback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Question Analysis</CardTitle>
            <CardDescription>Review your answers and AI feedback for each question</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {responses.map((response, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Question {index + 1}</h4>
                      <p className="text-gray-700 mb-2">{response.questions.text}</p>
                      <Badge
                        className={
                          response.questions.question_type === "technical"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {response.questions.question_type}
                      </Badge>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold ${getScoreColor(response.ai_score)}`}>
                        {response.ai_score.toFixed(1)}/10
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.floor(response.time_taken / 60)}:{(response.time_taken % 60).toString().padStart(2, "0")}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <h5 className="font-medium text-sm text-gray-700 mb-1">Your Answer:</h5>
                    <p className="text-sm text-gray-600">{response.user_answer}</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <h5 className="font-medium text-sm text-blue-700 mb-1">AI Feedback:</h5>
                    <p className="text-sm text-blue-600">{response.ai_feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Improvement Suggestions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>Personalized recommendations based on your performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Strengths</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {interview.average_score >= 7 && (
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Strong communication skills
                    </li>
                  )}
                  {responses.some((r) => r.ai_score >= 8) && (
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Excellent answers on some questions
                    </li>
                  )}
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Completed the full interview
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Focus Areas</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {interview.average_score < 7 && (
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      Practice structuring answers using STAR method
                    </li>
                  )}
                  {responses.some((r) => r.ai_score < 6) && (
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      Provide more specific examples
                    </li>
                  )}
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Research company-specific information
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Practice technical concepts for your role
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/interview/setup">
            <Button size="lg" className="w-full sm:w-auto">
              <RotateCcw className="h-4 w-4 mr-2" />
              Practice Again
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Share className="h-4 w-4 mr-2" />
            Share Results
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

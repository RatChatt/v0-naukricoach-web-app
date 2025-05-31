"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Search, Bookmark, BookmarkCheck, Home, Filter, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient, isDemo } from "@/lib/supabase"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UPSCQuestionBank } from "@/lib/question-generator"

interface Question {
  id: string
  text: string
  question_type: string
  complexity: number
  category: string
  tags: string[]
  is_bookmarked?: boolean
}

const questionCategories = [
  { id: "personal", name: "Personal Background", icon: "👤", color: "bg-purple-100 text-purple-800" },
  { id: "current-affairs", name: "Current Affairs", icon: "📰", color: "bg-blue-100 text-blue-800" },
  { id: "optional-subject", name: "Optional Subject", icon: "📚", color: "bg-green-100 text-green-800" },
  { id: "ethics", name: "Ethics & Integrity", icon: "⚖️", color: "bg-yellow-100 text-yellow-800" },
  { id: "governance", name: "Governance & Administration", icon: "🏛️", color: "bg-orange-100 text-orange-800" },
  { id: "international", name: "International Relations", icon: "🌍", color: "bg-red-100 text-red-800" },
  { id: "economy", name: "Economy & Development", icon: "💰", color: "bg-indigo-100 text-indigo-800" },
  { id: "social-issues", name: "Social Issues", icon: "👥", color: "bg-pink-100 text-pink-800" },
  { id: "environment", name: "Environment & Ecology", icon: "🌱", color: "bg-emerald-100 text-emerald-800" },
  { id: "science-tech", name: "Science & Technology", icon: "🔬", color: "bg-cyan-100 text-cyan-800" },
  { id: "constitutional", name: "Constitutional & Legal", icon: "📜", color: "bg-slate-100 text-slate-800" },
  { id: "historical", name: "Historical & Cultural", icon: "🏺", color: "bg-amber-100 text-amber-800" },
  { id: "disaster-management", name: "Disaster Management", icon: "🚨", color: "bg-rose-100 text-rose-800" },
  { id: "security", name: "Security", icon: "🛡️", color: "bg-gray-100 text-gray-800" },
  { id: "agriculture", name: "Agriculture", icon: "🌾", color: "bg-lime-100 text-lime-800" },
  { id: "rural-development", name: "Rural Development", icon: "🏘️", color: "bg-teal-100 text-teal-800" },
  { id: "urban-development", name: "Urban Development", icon: "🏙️", color: "bg-violet-100 text-violet-800" },
  { id: "health", name: "Health & Nutrition", icon: "🏥", color: "bg-sky-100 text-sky-800" },
  { id: "media", name: "Media & Communication", icon: "📺", color: "bg-fuchsia-100 text-fuchsia-800" },
  { id: "sports", name: "Sports", icon: "⚽", color: "bg-orange-100 text-orange-800" },
  { id: "youth", name: "Youth Development", icon: "🎓", color: "bg-blue-100 text-blue-800" },
]

export default function QuestionBankPage() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all-questions")
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showDifficultyChart, setShowDifficultyChart] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [user])

  const fetchQuestions = async () => {
    setLoading(true)

    if (isDemo) {
      // Load demo questions
      const demoQuestions = generateDemoQuestions()
      setQuestions(demoQuestions)
      setBookmarkedQuestions(demoQuestions.filter((q) => q.is_bookmarked))
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()

      // Fetch all questions
      const { data: questionsData, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Fetch user bookmarks
      const { data: bookmarksData } = await supabase.from("bookmarks").select("question_id").eq("user_id", user?.id)

      const bookmarkedIds = new Set(bookmarksData?.map((b) => b.question_id) || [])

      // Mark bookmarked questions
      const questionsWithBookmarks =
        questionsData?.map((q) => ({
          ...q,
          is_bookmarked: bookmarkedIds.has(q.id),
        })) || []

      setQuestions(questionsWithBookmarks)
      setBookmarkedQuestions(questionsWithBookmarks.filter((q) => q.is_bookmarked))
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateDemoQuestions = (): Question[] => {
    const allQuestions = UPSCQuestionBank.getAllQuestions()
    return allQuestions.map((q) => ({
      ...q,
      question_type: q.type,
      is_bookmarked: Math.random() > 0.8, // Randomly bookmark some questions
    }))
  }

  const toggleBookmark = async (questionId: string) => {
    // Find the question
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    // Toggle bookmark status in UI immediately for better UX
    const updatedQuestions = questions.map((q) => (q.id === questionId ? { ...q, is_bookmarked: !q.is_bookmarked } : q))
    setQuestions(updatedQuestions)

    // Update bookmarked questions list
    const updatedBookmarkedQuestions = updatedQuestions.filter((q) => q.is_bookmarked)
    setBookmarkedQuestions(updatedBookmarkedQuestions)

    if (isDemo) return // Don't proceed with database operations in demo mode

    try {
      const supabase = getSupabaseClient()

      if (!question.is_bookmarked) {
        // Add bookmark
        await supabase.from("bookmarks").insert({
          user_id: user?.id,
          question_id: questionId,
        })
      } else {
        // Remove bookmark
        await supabase.from("bookmarks").delete().eq("user_id", user?.id).eq("question_id", questionId)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      // Revert UI changes on error
      fetchQuestions()
    }
  }

  const openQuestionDetails = (question: Question) => {
    setSelectedQuestion(question)
    setIsDialogOpen(true)
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

  const getComplexityColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-green-100 text-green-800"
      case 2:
        return "bg-blue-100 text-blue-800"
      case 3:
        return "bg-yellow-100 text-yellow-800"
      case 4:
        return "bg-orange-100 text-orange-800"
      case 5:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryInfo = (category: string) => {
    return (
      questionCategories.find((c) => c.id === category) || {
        id: category,
        name: category,
        icon: "❓",
        color: "bg-gray-100 text-gray-800",
      }
    )
  }

  const filteredQuestions = (activeTab === "all-questions" ? questions : bookmarkedQuestions).filter((q) => {
    // Apply search filter
    if (searchQuery && !q.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Apply category filter
    if (selectedCategory !== "all" && q.category !== selectedCategory) {
      return false
    }

    // Apply complexity filter
    if (selectedComplexity !== "all" && q.complexity !== Number.parseInt(selectedComplexity)) {
      return false
    }

    return true
  })

  const questionStats = UPSCQuestionBank.getQuestionStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-slate-700 mr-3" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent">
                  CivilsCoach.ai
                </span>
                <p className="text-sm text-slate-600">Question Bank</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowStats(!showStats)}
                variant="outline"
                className="hover:scale-105 transition-transform"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Stats
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="hover:scale-105 transition-transform">
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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Comprehensive Question Bank</h1>
          <p className="text-slate-600 text-lg">
            {questionStats.total}+ carefully curated UPSC interview questions across{" "}
            {Object.keys(questionStats.byCategory).length} categories
          </p>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Question Bank Statistics
                </h3>
                <Button variant="outline" size="sm" onClick={() => setShowDifficultyChart(!showDifficultyChart)}>
                  {showDifficultyChart ? "Hide" : "Show"} Difficulty Chart
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{questionStats.total}</div>
                  <div className="text-sm text-slate-600">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(questionStats.byCategory).length}
                  </div>
                  <div className="text-sm text-slate-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Object.keys(questionStats.byComplexity).length}
                  </div>
                  <div className="text-sm text-slate-600">Difficulty Levels</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{bookmarkedQuestions.length}</div>
                  <div className="text-sm text-slate-600">Bookmarked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {questions.filter((q) => q.complexity >= 4).length}
                  </div>
                  <div className="text-sm text-slate-600">Advanced</div>
                </div>
              </div>

              {showDifficultyChart && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Difficulty Distribution</h4>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const count = questionStats.byComplexity[level] || 0
                      const percentage = (count / questionStats.total) * 100
                      return (
                        <div key={level} className="flex items-center">
                          <div className="w-20 text-sm">{getComplexityLabel(level)}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                            <div
                              className={`h-2 rounded-full ${getComplexityColor(level).replace("text-", "bg-").replace("100", "500")}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-16 text-sm text-right">
                            {count} ({percentage.toFixed(1)}%)
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              🎯 Difficulty Progression Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { level: 1, label: "Basic", desc: "Fundamental concepts", color: "bg-green-100 text-green-800" },
                { level: 2, label: "Easy", desc: "Conceptual understanding", color: "bg-blue-100 text-blue-800" },
                { level: 3, label: "Moderate", desc: "Analytical thinking", color: "bg-yellow-100 text-yellow-800" },
                { level: 4, label: "Challenging", desc: "Complex scenarios", color: "bg-orange-100 text-orange-800" },
                { level: 5, label: "Advanced", desc: "Strategic frameworks", color: "bg-red-100 text-red-800" },
              ].map((item) => (
                <div key={item.level} className="text-center p-3 bg-white rounded-lg border">
                  <Badge className={item.color}>{item.label}</Badge>
                  <div className="text-sm text-slate-600 mt-2">{item.desc}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {questionStats.byComplexity[item.level] || 0} questions
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-white shadow-sm">
            <TabsTrigger
              value="all-questions"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              All Questions ({questions.length})
            </TabsTrigger>
            <TabsTrigger value="bookmarked" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
              Bookmarked ({bookmarkedQuestions.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search questions..."
              className="pl-10 bg-white shadow-sm border-slate-200 focus:border-slate-400 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px] bg-white shadow-sm border-slate-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {questionCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger className="w-[180px] bg-white shadow-sm border-slate-200">
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="1">Basic</SelectItem>
                <SelectItem value="2">Easy</SelectItem>
                <SelectItem value="3">Moderate</SelectItem>
                <SelectItem value="4">Challenging</SelectItem>
                <SelectItem value="5">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedComplexity("all")
              }}
              className="bg-slate-700 hover:bg-slate-800"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuestions.map((question) => {
              const categoryInfo = getCategoryInfo(question.category)
              return (
                <Card
                  key={question.id}
                  className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white border-slate-200"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={categoryInfo.color}>
                            {categoryInfo.icon} {categoryInfo.name}
                          </Badge>
                          <Badge className={getComplexityColor(question.complexity)}>
                            {getComplexityLabel(question.complexity)}
                          </Badge>
                        </div>
                        <p className="text-slate-800 mb-3 leading-relaxed">{question.text}</p>
                        <div className="flex flex-wrap gap-2">
                          {question.tags?.slice(0, 4).map((tag, index) => (
                            <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {question.tags?.length > 4 && (
                            <span className="text-xs text-slate-500">+{question.tags.length - 4} more</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleBookmark(question.id)}
                          className={`transition-all duration-200 hover:scale-110 ${
                            question.is_bookmarked
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-gray-400 hover:text-yellow-500"
                          }`}
                        >
                          {question.is_bookmarked ? (
                            <BookmarkCheck className="h-5 w-5" />
                          ) : (
                            <Bookmark className="h-5 w-5" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openQuestionDetails(question)}
                          className="hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Question Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-800">Question Analysis & Preparation Guide</DialogTitle>
            <DialogDescription>Comprehensive breakdown and preparation strategy</DialogDescription>
          </DialogHeader>

          {selectedQuestion && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-3 text-slate-800">{selectedQuestion.text}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(() => {
                    const categoryInfo = getCategoryInfo(selectedQuestion.category)
                    return (
                      <Badge className={categoryInfo.color}>
                        {categoryInfo.icon} {categoryInfo.name}
                      </Badge>
                    )
                  })()}
                  <Badge className={getComplexityColor(selectedQuestion.complexity)}>
                    {getComplexityLabel(selectedQuestion.complexity)}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-slate-700">Question Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedQuestion.tags?.map((tag, index) => (
                    <span key={index} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-slate-700">Preparation Strategy</h4>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <ul className="list-disc list-inside space-y-2 text-blue-800">
                    <li>Research recent developments and current affairs related to this topic</li>
                    <li>Prepare 2-3 concrete examples to support your arguments</li>
                    <li>Consider multiple perspectives and stakeholder viewpoints</li>
                    <li>Connect your answer to administrative and governance implications</li>
                    <li>Practice articulating your thoughts clearly and concisely</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-slate-700">Answer Framework</h4>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <ol className="list-decimal list-inside space-y-2 text-slate-700">
                    <li>
                      <strong>Introduction:</strong> Brief context and your understanding of the issue
                    </li>
                    <li>
                      <strong>Analysis:</strong> Key dimensions, challenges, and opportunities
                    </li>
                    <li>
                      <strong>Examples:</strong> Relevant case studies or current examples
                    </li>
                    <li>
                      <strong>Solutions:</strong> Practical recommendations and policy measures
                    </li>
                    <li>
                      <strong>Conclusion:</strong> Balanced summary with administrative perspective
                    </li>
                  </ol>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-slate-700">Key Points to Remember</h4>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <ul className="list-disc list-inside space-y-1 text-amber-800 text-sm">
                    <li>Stay updated with latest government policies and initiatives</li>
                    <li>Maintain objectivity and avoid extreme positions</li>
                    <li>Demonstrate awareness of ground realities and implementation challenges</li>
                    <li>Show empathy and understanding of diverse perspectives</li>
                    <li>Connect theoretical knowledge with practical applications</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant={selectedQuestion.is_bookmarked ? "default" : "outline"}
                  onClick={() => toggleBookmark(selectedQuestion.id)}
                  className={selectedQuestion.is_bookmarked ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                >
                  {selectedQuestion.is_bookmarked ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark Question
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

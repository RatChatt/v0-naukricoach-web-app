"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Search, Bookmark, BookmarkCheck, Home, Filter } from "lucide-react"
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
  { id: "personal", name: "Personal Background" },
  { id: "current-affairs", name: "Current Affairs" },
  { id: "optional-subject", name: "Optional Subject" },
  { id: "ethics", name: "Ethics & Integrity" },
  { id: "governance", name: "Governance & Administration" },
  { id: "international", name: "International Relations" },
  { id: "economy", name: "Economy & Development" },
  { id: "social-issues", name: "Social Issues" },
  { id: "environment", name: "Environment & Ecology" },
  { id: "science-tech", name: "Science & Technology" },
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
  const [interviewData, setInterviewData] = useState<{
    homeState: string | null
    optionalSubject: string | null
  } | null>(null)

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
      is_bookmarked: Math.random() > 0.7, // Randomly bookmark some questions
    }))
  }

  const generatePersonalizedQuestions = () => {
    if (!interviewData) return

    // Generate state-specific question
    if (interviewData.homeState) {
      const stateQuestion = UPSCQuestionBank.generateStateSpecificQuestion(interviewData.homeState, 3)
      setQuestions((prev) => [...prev, { ...stateQuestion, is_bookmarked: false }])
    }

    // Generate subject-specific question
    if (interviewData.optionalSubject) {
      const subjectQuestion = UPSCQuestionBank.generateSubjectSpecificQuestion(interviewData.optionalSubject, 3)
      setQuestions((prev) => [...prev, { ...subjectQuestion, is_bookmarked: false }])
    }
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "personal":
        return "bg-purple-100 text-purple-800"
      case "current-affairs":
        return "bg-blue-100 text-blue-800"
      case "optional-subject":
        return "bg-green-100 text-green-800"
      case "ethics":
        return "bg-yellow-100 text-yellow-800"
      case "governance":
        return "bg-orange-100 text-orange-800"
      case "international":
        return "bg-red-100 text-red-800"
      case "economy":
        return "bg-indigo-100 text-indigo-800"
      case "social-issues":
        return "bg-pink-100 text-pink-800"
      case "environment":
        return "bg-emerald-100 text-emerald-800"
      case "science-tech":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
              <Button onClick={generatePersonalizedQuestions} variant="outline">
                Generate Personalized Questions
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Bank</h1>
          <p className="text-gray-600">Browse and bookmark UPSC interview questions for your preparation</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="all-questions">All Questions</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search questions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {questionCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger className="w-[180px]">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getCategoryColor(question.category)}>
                          {questionCategories.find((c) => c.id === question.category)?.name || question.category}
                        </Badge>
                        <Badge className={getComplexityColor(question.complexity)}>
                          {getComplexityLabel(question.complexity)}
                        </Badge>
                      </div>
                      <p className="text-gray-900 mb-3">{question.text}</p>
                      <div className="flex flex-wrap gap-2">
                        {question.tags?.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleBookmark(question.id)}
                        className={question.is_bookmarked ? "text-yellow-500" : "text-gray-400"}
                      >
                        {question.is_bookmarked ? (
                          <BookmarkCheck className="h-5 w-5" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openQuestionDetails(question)}>
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Question Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
            <DialogDescription>Detailed information about this interview question</DialogDescription>
          </DialogHeader>

          {selectedQuestion && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">{selectedQuestion.text}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getCategoryColor(selectedQuestion.category)}>
                    {questionCategories.find((c) => c.id === selectedQuestion.category)?.name ||
                      selectedQuestion.category}
                  </Badge>
                  <Badge className={getComplexityColor(selectedQuestion.complexity)}>
                    {getComplexityLabel(selectedQuestion.complexity)}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedQuestion.tags?.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Preparation Tips</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-2 text-blue-800">
                    <li>Research recent developments related to this topic</li>
                    <li>Prepare 2-3 relevant examples to support your answer</li>
                    <li>Consider different perspectives on this issue</li>
                    <li>Connect your answer to administrative implications when possible</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Sample Answer Structure</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Brief introduction to the topic</li>
                    <li>Main points with supporting examples</li>
                    <li>Different perspectives or dimensions</li>
                    <li>Implications for governance/administration</li>
                    <li>Balanced conclusion</li>
                  </ol>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant={selectedQuestion.is_bookmarked ? "default" : "outline"}
                  onClick={() => toggleBookmark(selectedQuestion.id)}
                >
                  {selectedQuestion.is_bookmarked ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark
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

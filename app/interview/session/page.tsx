"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Send, Volume2, VolumeX, Clock, Loader2, Settings } from "lucide-react"
import { getSupabaseClient, isDemo } from "@/lib/supabase"
import { evaluateResponse, generateFollowUpQuestion, generateAdaptiveQuestion } from "@/lib/ai-evaluation"
import { SpeechControls } from "@/components/speech-controls"
import { AIVoiceAssistant } from "@/components/ai-voice-assistant"

interface BoardMember {
  id: string
  name: string
  role: string
  expertise: string
  avatar: string
  voice: string
}

interface Question {
  id: string
  text: string
  askedBy: string
  memberRole?: string
  type: string
  complexity: number
  followUpTo?: string
  isAdaptive?: boolean
}

interface UserResponse {
  questionId: string
  question: Question
  answer: string
  timeTaken: number
  askedBy: string
  isVoiceResponse: boolean
  score?: number
  criteriaScores?: any
  feedback?: string
  strengths?: string[]
  improvements?: string[]
  detailedAnalysis?: any
  needsFollowUp?: boolean
}

export default function InterviewSessionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [interviewData, setInterviewData] = useState<any>(null)
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userResponses, setUserResponses] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [evaluating, setEvaluating] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [interviewId, setInterviewId] = useState<string>("demo")
  const [timeRemaining, setTimeRemaining] = useState<number>(25 * 60)
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const [evaluationProgress, setEvaluationProgress] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !evaluating && !loading) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleEndInterview()
    }
  }, [timeRemaining, evaluating, loading])

  useEffect(() => {
    console.log("Interview session page loaded")
    const data = searchParams.get("data")
    console.log("Search params data:", data)

    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data))
        console.log("Parsed interview data:", parsed)
        setInterviewData(parsed)

        const duration = parsed.sessionDuration || "20-25"
        const minutes = duration.includes("25-30") ? 30 : duration.includes("15-20") ? 20 : 25
        setTimeRemaining(minutes * 60)

        generateBoardAndQuestions(parsed)
      } catch (error) {
        console.error("Error parsing interview data:", error)
        generateDemoData()
      }
    } else {
      console.log("No data provided, using demo data")
      generateDemoData()
    }
  }, [searchParams])

  const generateDemoData = () => {
    const demoData = {
      optionalSubject: "Public Administration",
      homeState: "Delhi",
      educationalBackground: "B.Tech in Computer Science",
      boardComposition: "standard",
      sessionDuration: "20-25",
      currentAffairsLevel: "intermediate",
      focusAreas: ["National Issues", "Government Policies", "Social Issues"],
    }
    setInterviewData(demoData)
    generateBoardAndQuestions(demoData)
  }

  const generateBoardAndQuestions = async (data: any) => {
    setLoading(true)

    // Generate board members
    const board = generateBoardMembers(data)
    setBoardMembers(board)

    // Generate initial questions
    const initialQuestions = generateInitialQuestions(data, board)
    setQuestions(initialQuestions)

    // Create interview record if not in demo mode
    if (!isDemo && user) {
      try {
        const supabase = getSupabaseClient()
        const { data: interview, error } = await supabase
          .from("interviews")
          .insert({
            user_id: user.id,
            job_title: "UPSC Civil Services",
            company: "Government of India",
            round_type: data.boardComposition || "Standard Board",
            language: "english",
            status: "in_progress",
          })
          .select()
          .single()

        if (interview) {
          setInterviewId(interview.id)
        }
      } catch (error) {
        console.error("Error creating interview record:", error)
      }
    }

    setLoading(false)
  }

  const generateBoardMembers = (data: any): BoardMember[] => {
    const { boardComposition, optionalSubject } = data

    const baseBoard: BoardMember[] = [
      {
        id: "chairman",
        name: "Dr. Rajesh Kumar",
        role: "Chairman",
        expertise: "Public Administration & Policy",
        avatar: "👨‍💼",
        voice: "male-formal",
      },
      {
        id: "member1",
        name: "Ms. Priya Sharma",
        role: "Board Member",
        expertise: "Current Affairs & Governance",
        avatar: "👩‍💼",
        voice: "female-professional",
      },
      {
        id: "member2",
        name: "Prof. Anil Gupta",
        role: "Board Member",
        expertise: "Ethics & Philosophy",
        avatar: "👨‍🏫",
        voice: "male-academic",
      },
      {
        id: "member3",
        name: "Dr. Meera Patel",
        role: "Board Member",
        expertise: optionalSubject || "General Studies",
        avatar: "👩‍🔬",
        voice: "female-expert",
      },
      {
        id: "member4",
        name: "Shri Vikram Singh",
        role: "Board Member",
        expertise: "Administrative Experience",
        avatar: "👨‍💻",
        voice: "male-experienced",
      },
    ]

    switch (boardComposition) {
      case "subject-expert":
        baseBoard[3].expertise = `${optionalSubject} Expert`
        baseBoard[4].expertise = `${optionalSubject} Applications`
        break
      case "diverse-panel":
        baseBoard[1].expertise = "International Relations"
        baseBoard[2].expertise = "Social Issues & Development"
        baseBoard[3].expertise = "Economics & Finance"
        baseBoard[4].expertise = "Science & Technology"
        break
    }

    return baseBoard
  }

  const generateInitialQuestions = (data: any, board: BoardMember[]): Question[] => {
    const { optionalSubject, homeState, educationalBackground, hobbies } = data

    const initialQuestions: Question[] = [
      {
        id: "opening1",
        text: "Good morning! Please have a seat and make yourself comfortable. Tell us about yourself.",
        askedBy: board[0].id,
        memberRole: board[0].role,
        type: "personal",
        complexity: 1,
      },
      {
        id: "personal1",
        text: "What motivated you to choose civil services as a career?",
        askedBy: board[0].id,
        memberRole: board[0].role,
        type: "personal",
        complexity: 2,
      },
      {
        id: "personal2",
        text: `I see you're from ${homeState}. What are the major developmental challenges facing your state today?`,
        askedBy: board[1].id,
        memberRole: board[1].role,
        type: "current-affairs",
        complexity: 3,
      },
      {
        id: "current1",
        text: "What do you think are the most pressing challenges facing India's governance system today?",
        askedBy: board[2].id,
        memberRole: board[2].role,
        type: "governance",
        complexity: 3,
      },
      {
        id: "optional1",
        text: `How does your background in ${optionalSubject} help you understand public administration better?`,
        askedBy: board[3].id,
        memberRole: board[3].role,
        type: "optional-subject",
        complexity: 3,
      },
    ]

    return initialQuestions
  }

  const handleTranscriptChange = (transcript: string, isFinal: boolean) => {
    if (isFinal) {
      setCurrentAnswer(transcript)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return

    const currentQuestion = questions[currentQuestionIndex]
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)

    const response: UserResponse = {
      questionId: currentQuestion.id,
      question: currentQuestion,
      answer: currentAnswer,
      timeTaken,
      askedBy: currentQuestion.askedBy,
      isVoiceResponse: isRecording,
    }

    setUserResponses([...userResponses, response])
    setCurrentAnswer("")
    setEvaluating(true)
    setEvaluationProgress("Analyzing your response...")

    try {
      // Use AI evaluation
      setEvaluationProgress("Evaluating content and context...")
      const evaluation = await evaluateResponse(
        currentQuestion.text,
        currentAnswer,
        currentQuestion.type,
        currentQuestion.complexity,
        interviewData,
      )

      setEvaluationProgress("Generating feedback...")

      const evaluatedResponse = {
        ...response,
        score: evaluation.overall_score,
        criteriaScores: evaluation.criteria_scores,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        detailedAnalysis: evaluation.detailed_analysis,
        needsFollowUp: evaluation.follow_up_suggested,
      }

      const updatedResponses = [...userResponses, evaluatedResponse]
      setUserResponses(updatedResponses)

      // Generate follow-up or next question
      if (evaluation.follow_up_suggested && Math.random() > 0.3) {
        setEvaluationProgress("Generating follow-up question...")
        const followUpText = await generateFollowUpQuestion(
          currentQuestion.text,
          currentAnswer,
          currentQuestion.type,
          interviewData,
        )

        const followUpQuestion: Question = {
          id: `followup_${currentQuestion.id}`,
          text: followUpText,
          askedBy: currentQuestion.askedBy,
          memberRole: currentQuestion.memberRole,
          type: currentQuestion.type,
          complexity: Math.min(currentQuestion.complexity + 1, 5),
          followUpTo: currentQuestion.id,
        }

        setQuestions([...questions, followUpQuestion])
      } else if (currentQuestionIndex < questions.length - 1) {
        // Check if we need an adaptive question
        if (updatedResponses.length >= 3 && Math.random() > 0.4) {
          setEvaluationProgress("Generating adaptive question...")
          const adaptiveQ = await generateAdaptiveQuestion(
            updatedResponses,
            interviewData,
            Math.max(1, Math.min(5, Math.round(evaluation.overall_score / 2) + evaluation.complexity_adjustment)),
            interviewData.focusAreas?.[Math.floor(Math.random() * interviewData.focusAreas.length)],
          )

          const adaptiveQuestion: Question = {
            id: `adaptive_${Date.now()}`,
            text: adaptiveQ.question,
            askedBy: boardMembers[Math.floor(Math.random() * boardMembers.length)].id,
            type: adaptiveQ.type,
            complexity: adaptiveQ.complexity,
            isAdaptive: true,
          }

          setQuestions([...questions, adaptiveQuestion])
        }
      }

      // Move to next question or end interview
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setStartTime(Date.now())
      } else {
        handleEndInterview()
      }
    } catch (error) {
      console.error("Evaluation error:", error)
      // Fallback to simple scoring
      const fallbackResponse = {
        ...response,
        score: Math.random() * 3 + 6,
        feedback:
          "Good answer with room for improvement. Consider providing more specific examples and connecting your response to broader governance implications.",
        strengths: ["Clear communication", "Relevant to the question"],
        improvements: ["Add more depth", "Include policy implications"],
      }

      const updatedResponses = [...userResponses, fallbackResponse]
      setUserResponses(updatedResponses)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setStartTime(Date.now())
      } else {
        handleEndInterview()
      }
    } finally {
      setEvaluating(false)
      setEvaluationProgress("")
    }
  }

  const handleEndInterview = () => {
    // Calculate average score
    const scores = userResponses.map((r) => r.score || 0).filter((s) => s > 0)
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

    // Determine performance band
    let performanceBand = "Satisfactory"
    if (averageScore >= 8.5) performanceBand = "Outstanding"
    else if (averageScore >= 7.5) performanceBand = "Very Good"
    else if (averageScore >= 6.5) performanceBand = "Good"

    // Save results to session storage for immediate access
    const results = {
      interview: {
        id: interviewId,
        job_title: "UPSC Civil Services",
        company: "Government of India",
        round_type: interviewData?.boardComposition || "Standard Board",
        average_score: averageScore,
        performance_band: performanceBand,
        completed_at: new Date().toISOString(),
      },
      responses: userResponses.map((r) => ({
        user_answer: r.answer,
        ai_score: r.score || 0,
        ai_feedback: r.feedback || "No feedback available",
        criteria_scores: r.criteriaScores,
        strengths: r.strengths,
        improvements: r.improvements,
        detailed_analysis: r.detailedAnalysis,
        time_taken: r.timeTaken,
        questions: {
          text: r.question.text,
          question_type: r.question.type,
        },
      })),
      boardMembers,
    }

    sessionStorage.setItem("interviewResults", JSON.stringify(results))

    // Update interview record if not in demo mode
    if (!isDemo && interviewId !== "demo") {
      try {
        const supabase = getSupabaseClient()
        supabase
          .from("interviews")
          .update({
            average_score: averageScore,
            performance_band: performanceBand,
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", interviewId)
      } catch (error) {
        console.error("Error updating interview record:", error)
      }
    }

    // Redirect to results page
    router.push(`/interview/results?id=${interviewId}`)
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentMember = boardMembers.find((m) => m.id === currentQuestion?.askedBy) || boardMembers[0]

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
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-lg font-medium">{formatTime(timeRemaining)}</span>
              </div>
              <Button variant="outline" size="sm" onClick={toggleVoice}>
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAutoSpeak(!autoSpeak)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={handleEndInterview} className="ml-2">
                End Interview
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Interview Board */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Interview Board</h2>
          <div className="grid grid-cols-5 gap-4">
            {boardMembers.map((member) => (
              <div
                key={member.id}
                className={`text-center p-3 border rounded-lg ${
                  currentMember.id === member.id ? "bg-blue-50 border-blue-300" : "bg-white"
                }`}
              >
                <div className="text-2xl mb-2">{member.avatar}</div>
                <div className="font-medium text-sm">{member.name}</div>
                <div className="text-xs text-gray-600">{member.role}</div>
                <div className="text-xs text-gray-500">{member.expertise}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </div>

        {/* AI Voice Assistant */}
        <div className="mb-6">
          <AIVoiceAssistant
            boardMember={currentMember}
            question={currentQuestion.text}
            enabled={voiceEnabled}
            autoSpeak={autoSpeak}
            onSpeakingStateChange={setIsSpeaking}
          />
        </div>

        {/* Current Question */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="text-3xl mr-4">{currentMember.avatar}</div>
              <div>
                <div className="font-medium text-gray-900">{currentMember.name}</div>
                <div className="text-sm text-gray-600 mb-3">{currentMember.role}</div>
                <p className="text-lg">{currentQuestion.text}</p>
                <div className="flex gap-2 mt-2">
                  {currentQuestion.isAdaptive && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Adaptive Question</span>
                  )}
                  {currentQuestion.followUpTo && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Follow-up Question</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer Input */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900">Your Answer</h3>
            {evaluating && (
              <div className="flex items-center text-sm text-blue-600">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {evaluationProgress}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Textarea
              ref={textareaRef}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here or use voice recording..."
              className="min-h-[150px] p-4"
              disabled={evaluating || isSpeaking}
            />

            {/* Speech Controls */}
            <SpeechControls
              onTranscriptChange={handleTranscriptChange}
              onRecordingStateChange={setIsRecording}
              disabled={evaluating || isSpeaking}
            />

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleEndInterview}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                End Interview Early
              </Button>
              <Button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || evaluating || isRecording || isSpeaking}
                size="lg"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Submit Answer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Previous Responses */}
        {userResponses.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Previous Responses</h3>
            <div className="space-y-4">
              {userResponses.map((response, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{response.question.text}</h4>
                      <p className="text-sm text-gray-600">
                        Asked by: {boardMembers.find((m) => m.id === response.askedBy)?.name}
                        {response.isVoiceResponse && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Voice Response
                          </span>
                        )}
                      </p>
                    </div>
                    {response.score && (
                      <div className="text-right ml-4">
                        <div
                          className={`text-lg font-bold ${
                            response.score >= 8
                              ? "text-green-600"
                              : response.score >= 6
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {response.score.toFixed(1)}/10
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.floor(response.timeTaken / 60)}:{(response.timeTaken % 60).toString().padStart(2, "0")}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{response.answer}</p>

                  {response.feedback && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-2">
                      <p className="text-sm text-blue-800">{response.feedback}</p>
                    </div>
                  )}

                  {response.strengths && response.strengths.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs text-green-700 font-medium">Strengths:</span>
                      {response.strengths.map((strength, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {strength}
                        </span>
                      ))}
                    </div>
                  )}

                  {response.improvements && response.improvements.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-orange-700 font-medium">Improvements:</span>
                      {response.improvements.map((improvement, i) => (
                        <span key={i} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          {improvement}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

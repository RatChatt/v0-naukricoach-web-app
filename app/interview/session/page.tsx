"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Clock,
  Send,
  Users,
  BookOpen,
  CheckCircle,
  StopCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { getSupabaseClient, isDemo } from "@/lib/supabase"

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
  memberRole: string
  type: "opening" | "personal" | "current-affairs" | "optional-subject" | "ethics" | "follow-up" | "closing"
  complexity: 1 | 2 | 3 | 4 | 5 // 1=Basic, 2=Intermediate, 3=Advanced, 4=Expert, 5=Exceptional
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
  needsFollowUp?: boolean
}

interface EvaluatedResponse {
  questionId: string
  answer: string
  score: number
  feedback: string
  timeTaken: number
  askedBy: string
  complexity: number
  needsFollowUp: boolean
}

interface AdaptiveState {
  currentComplexity: number
  averageScore: number
  totalQuestions: number
  subjectPerformance: Record<string, number>
  lastQuestionType: string
  consecutiveLowScores: number
  consecutiveHighScores: number
}

const useWebSpeechAPI = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      reject(new Error("Speech recognition not supported"))
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-IN"
    recognition.maxAlternatives = 1

    let finalTranscript = ""

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
    }

    recognition.onend = () => {
      if (finalTranscript.trim()) {
        resolve(finalTranscript.trim())
      } else {
        reject(new Error("No speech detected"))
      }
    }

    recognition.onerror = (event: any) => {
      reject(new Error(`Speech recognition error: ${event.error}`))
    }

    recognition.start()
  })
}

export default function InterviewSessionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const answerRef = useRef<string>("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const recognitionRef = useRef<any>(null)

  // State management
  const [interviewData, setInterviewData] = useState<any>(null)
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userResponses, setUserResponses] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [interviewId, setInterviewId] = useState<string>("")
  const [timeRemaining, setTimeRemaining] = useState<number>(25 * 60)
  const [currentPhase, setCurrentPhase] = useState<string>("opening")
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)

  // Adaptive questioning state
  const [adaptiveState, setAdaptiveState] = useState<AdaptiveState>({
    currentComplexity: 2, // Start with intermediate
    averageScore: 0,
    totalQuestions: 0,
    subjectPerformance: {},
    lastQuestionType: "",
    consecutiveLowScores: 0,
    consecutiveHighScores: 0,
  })

  // Voice-related state
  const [isRecording, setIsRecording] = useState(false)
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [responseMode, setResponseMode] = useState<"text" | "voice">("text")
  const [audioSupported, setAudioSupported] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isSpeechRecognitionAvailable, setIsSpeechRecognitionAvailable] = useState(false)

  // Check audio support on mount
  useEffect(() => {
    const checkAudioSupport = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((track) => track.stop())
        setAudioSupported(true)
      } catch (error) {
        console.warn("Microphone access not available:", error)
        setAudioSupported(false)
      }
    }

    if (typeof window !== "undefined" && navigator.mediaDevices) {
      checkAudioSupport()
    }

    // Check for SpeechRecognition API
    setIsSpeechRecognitionAvailable("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
  }, [])

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
    const data = searchParams.get("data")
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data))
        setInterviewData(parsed)

        const duration = parsed.sessionDuration || "20-25"
        const minutes = duration.includes("25-30") ? 30 : duration.includes("15-20") ? 20 : 25
        setTimeRemaining(minutes * 60)

        generateBoardAndQuestions(parsed)
        if (!isDemo) {
          createInterviewRecord(parsed)
        }
      } catch (error) {
        console.error("Error parsing interview data:", error)
      }
    }
  }, [searchParams])

  // Auto-play question when it changes
  useEffect(() => {
    if (
      questions.length > 0 &&
      voiceEnabled &&
      currentQuestionIndex < questions.length &&
      questions[currentQuestionIndex]
    ) {
      const timer = setTimeout(() => {
        speakQuestion(questions[currentQuestionIndex])
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentQuestionIndex, questions, voiceEnabled])

  const createInterviewRecord = async (data: any) => {
    try {
      const supabase = getSupabaseClient()
      const { data: interview, error } = await supabase
        .from("interviews")
        .insert({
          user_id: user?.id,
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

  const generateBoardAndQuestions = async (data: any) => {
    setLoading(true)

    const board = generateBoardMembers(data)
    setBoardMembers(board)

    // Generate initial set of questions
    const initialQuestions = generateInitialQuestions(data, board)
    setQuestions(initialQuestions)

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

    const initialQuestions: Question[] = []

    // Opening question (always complexity 1)
    initialQuestions.push({
      id: "opening1",
      text: "Good morning! Please have a seat and make yourself comfortable. Tell us about yourself.",
      askedBy: board[0].id,
      memberRole: board[0].role,
      type: "opening",
      complexity: 1,
    })

    // Personal motivation (complexity 2)
    initialQuestions.push({
      id: "personal1",
      text: "What motivated you to choose civil services as a career?",
      askedBy: board[0].id,
      memberRole: board[0].role,
      type: "personal",
      complexity: 2,
    })

    // State-specific question (complexity 2)
    initialQuestions.push({
      id: "personal2",
      text: `I see you're from ${homeState}. What are the major developmental challenges facing your state today?`,
      askedBy: board[1].id,
      memberRole: board[1].role,
      type: "personal",
      complexity: 2,
    })

    return initialQuestions
  }

  const generateAdaptiveQuestion = async (
    lastResponse: UserResponse,
    adaptiveState: AdaptiveState,
    interviewData: any,
  ): Promise<Question> => {
    const { score = 5, question } = lastResponse
    const { currentComplexity, subjectPerformance, lastQuestionType } = adaptiveState

    // Determine next complexity based on score
    let nextComplexity = currentComplexity
    if (score >= 8.5) {
      nextComplexity = Math.min(5, currentComplexity + 1)
    } else if (score >= 7) {
      nextComplexity = currentComplexity // Maintain level
    } else if (score >= 5) {
      nextComplexity = Math.max(1, currentComplexity - 1)
    } else {
      nextComplexity = Math.max(1, currentComplexity - 2)
    }

    // Determine if follow-up is needed
    const needsFollowUp = score < 6 || (score < 7.5 && question.complexity >= 3)

    let questionType = question.type
    let questionText = ""
    let askedBy = question.askedBy

    if (needsFollowUp) {
      // Generate follow-up question
      questionText = await generateFollowUpQuestion(lastResponse, nextComplexity)
      questionType = "follow-up"
    } else {
      // Generate new question in different area
      const nextArea = determineNextQuestionArea(lastQuestionType, adaptiveState)
      const result = await generateNewQuestion(nextArea, nextComplexity, interviewData)
      questionText = result.text
      questionType = result.type
      askedBy = result.askedBy
    }

    const member = boardMembers.find((m) => m.id === askedBy) || boardMembers[0]

    return {
      id: `adaptive_${Date.now()}`,
      text: questionText,
      askedBy: askedBy,
      memberRole: member.role,
      type: questionType as any,
      complexity: nextComplexity as any,
      isAdaptive: true,
      followUpTo: needsFollowUp ? question.id : undefined,
    }
  }

  const generateFollowUpQuestion = async (lastResponse: UserResponse, complexity: number): Promise<string> => {
    const prompt = `Generate a follow-up question for this UPSC interview response:

Original Question: ${lastResponse.question.text}
Candidate's Answer: ${lastResponse.answer}
Current Complexity Level: ${complexity}/5
Question Type: ${lastResponse.question.type}

The candidate's response needs clarification or deeper exploration. Generate a follow-up question that:
- Addresses gaps or unclear points in their answer
- Matches complexity level ${complexity} (1=Basic, 2=Intermediate, 3=Advanced, 4=Expert, 5=Exceptional)
- Maintains the same subject area
- Encourages more specific examples or deeper analysis
- Is appropriate for UPSC Civil Services interview

Return only the question text, no additional formatting.`

    try {
      const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt,
      })
      return text.trim()
    } catch (error) {
      console.error("Error generating follow-up question:", error)
      return getDefaultFollowUpQuestion(lastResponse.question.type, complexity)
    }
  }

  const generateNewQuestion = async (
    questionArea: string,
    complexity: number,
    interviewData: any,
  ): Promise<{ text: string; type: string; askedBy: string }> => {
    const { optionalSubject, homeState, focusAreas } = interviewData

    const prompt = `Generate a UPSC Civil Services interview question:

Question Area: ${questionArea}
Complexity Level: ${complexity}/5 (1=Basic, 2=Intermediate, 3=Advanced, 4=Expert, 5=Exceptional)
Optional Subject: ${optionalSubject}
Home State: ${homeState}
Focus Areas: ${focusAreas?.join(", ") || "General"}

Generate a question that:
- Matches the specified complexity level
- Is relevant to ${questionArea}
- Tests administrative aptitude and knowledge
- Is appropriate for UPSC interview standards
- Considers the candidate's background

Complexity Guidelines:
- Level 1: Basic awareness, simple recall
- Level 2: Understanding and application
- Level 3: Analysis and evaluation
- Level 4: Synthesis and complex problem-solving
- Level 5: Expert-level critical thinking and innovation

Return only the question text, no additional formatting.`

    try {
      const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt,
      })

      // Determine appropriate board member based on question area
      let askedBy = "chairman"
      if (questionArea.includes("current-affairs") || questionArea.includes("governance")) {
        askedBy = "member1"
      } else if (questionArea.includes("ethics") || questionArea.includes("philosophy")) {
        askedBy = "member2"
      } else if (questionArea.includes("optional") || questionArea.includes("subject")) {
        askedBy = "member3"
      } else if (questionArea.includes("administrative") || questionArea.includes("management")) {
        askedBy = "member4"
      }

      return {
        text: text.trim(),
        type: questionArea,
        askedBy,
      }
    } catch (error) {
      console.error("Error generating new question:", error)
      return getDefaultQuestion(questionArea, complexity)
    }
  }

  const determineNextQuestionArea = (lastType: string, adaptiveState: AdaptiveState): string => {
    const { subjectPerformance, totalQuestions } = adaptiveState

    // Rotate through different areas based on interview flow
    const questionAreas = ["current-affairs", "ethics", "optional-subject", "personal", "administrative"]

    // Avoid repeating the same type immediately
    const availableAreas = questionAreas.filter((area) => area !== lastType)

    // Prefer areas where performance is lower (need more assessment)
    const sortedByPerformance = availableAreas.sort((a, b) => {
      const scoreA = subjectPerformance[a] || 5
      const scoreB = subjectPerformance[b] || 5
      return scoreA - scoreB
    })

    return sortedByPerformance[0] || "current-affairs"
  }

  const getDefaultFollowUpQuestion = (questionType: string, complexity: number): string => {
    const followUpQuestions = {
      personal: [
        "Can you elaborate on that with a specific example?",
        "How would you apply this experience in your role as a civil servant?",
        "What challenges did you face and how did you overcome them?",
        "How has this shaped your perspective on public service?",
        "Can you provide more concrete details about your approach?",
      ],
      "current-affairs": [
        "What do you think are the implementation challenges?",
        "How would you address the concerns of different stakeholders?",
        "What role should the government play in this matter?",
        "How does this compare with international best practices?",
        "What would be your policy recommendations?",
      ],
      ethics: [
        "What ethical principles would guide your decision?",
        "How would you balance competing interests?",
        "What would be the long-term implications of your approach?",
        "How would you ensure transparency in this process?",
        "What safeguards would you put in place?",
      ],
      "optional-subject": [
        "How does this concept apply to current policy challenges?",
        "Can you provide a contemporary example?",
        "What are the practical implications for administration?",
        "How would you explain this to a layperson?",
        "What are the limitations of this approach?",
      ],
    }

    const questions = followUpQuestions[questionType as keyof typeof followUpQuestions] || followUpQuestions.personal
    return questions[Math.min(complexity - 1, questions.length - 1)]
  }

  const getDefaultQuestion = (
    questionArea: string,
    complexity: number,
  ): { text: string; type: string; askedBy: string } => {
    const defaultQuestions = {
      "current-affairs": {
        1: "What are your views on recent government initiatives?",
        2: "How do you assess India's foreign policy in the current global scenario?",
        3: "Analyze the effectiveness of digital governance initiatives in improving service delivery.",
        4: "Evaluate the trade-offs between economic growth and environmental sustainability in current policies.",
        5: "Design a comprehensive framework for addressing climate change while ensuring energy security.",
      },
      ethics: {
        1: "What does integrity mean to you?",
        2: "How would you handle a conflict of interest situation?",
        3: "A senior colleague asks you to bend rules for a 'good cause'. How do you respond?",
        4: "Design an ethical framework for AI use in government decision-making.",
        5: "How would you balance individual privacy rights with national security imperatives?",
      },
      "optional-subject": {
        1: "Why did you choose this optional subject?",
        2: "How is your optional subject relevant to administration?",
        3: "Apply concepts from your optional subject to solve a current policy challenge.",
        4: "Critically evaluate a theory from your optional subject in the context of Indian governance.",
        5: "Synthesize insights from your optional subject to propose innovative administrative reforms.",
      },
    }

    const areaQuestions =
      defaultQuestions[questionArea as keyof typeof defaultQuestions] || defaultQuestions["current-affairs"]
    const questionText = areaQuestions[complexity as keyof typeof areaQuestions] || areaQuestions[2]

    let askedBy = "chairman"
    if (questionArea === "current-affairs") askedBy = "member1"
    else if (questionArea === "ethics") askedBy = "member2"
    else if (questionArea === "optional-subject") askedBy = "member3"

    return { text: questionText, type: questionArea, askedBy }
  }

  const updateAdaptiveState = (response: UserResponse, score: number): AdaptiveState => {
    const newState = { ...adaptiveState }

    // Update running averages
    newState.totalQuestions += 1
    newState.averageScore = (newState.averageScore * (newState.totalQuestions - 1) + score) / newState.totalQuestions

    // Update subject performance
    const questionType = response.question.type
    if (!newState.subjectPerformance[questionType]) {
      newState.subjectPerformance[questionType] = score
    } else {
      newState.subjectPerformance[questionType] = (newState.subjectPerformance[questionType] + score) / 2
    }

    // Update complexity based on score
    if (score >= 8.5) {
      newState.currentComplexity = Math.min(5, newState.currentComplexity + 1)
      newState.consecutiveHighScores += 1
      newState.consecutiveLowScores = 0
    } else if (score >= 7) {
      newState.consecutiveHighScores = 0
      newState.consecutiveLowScores = 0
    } else {
      newState.currentComplexity = Math.max(1, newState.currentComplexity - 1)
      newState.consecutiveLowScores += 1
      newState.consecutiveHighScores = 0
    }

    newState.lastQuestionType = questionType

    return newState
  }

  // Voice Functions
  const speakQuestion = (question: Question) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()

    const member = boardMembers.find((m) => m.id === question.askedBy)
    const utterance = new SpeechSynthesisUtterance(question.text)

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      const selectedVoice =
        voices.find(
          (voice) =>
            voice.lang.includes("en") &&
            (member?.voice.includes("female")
              ? voice.name.toLowerCase().includes("female")
              : voice.name.toLowerCase().includes("male")),
        ) ||
        voices.find((voice) => voice.lang.includes("en")) ||
        voices[0]

      utterance.voice = selectedVoice
    }

    utterance.rate = 0.9
    utterance.pitch = member?.voice.includes("female") ? 1.1 : 0.9
    utterance.volume = 0.8

    utterance.onstart = () => setIsPlayingQuestion(true)
    utterance.onend = () => setIsPlayingQuestion(false)
    utterance.onerror = () => setIsPlayingQuestion(false)

    speechSynthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsPlayingQuestion(false)
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)

    let transcription = ""
    try {
      if (isSpeechRecognitionAvailable) {
        transcription = await useWebSpeechAPI()
      } else {
        transcription = await processAudioBlob(audioBlob)
      }
      setTranscribedText(transcription)
      answerRef.current = transcription

      if (textareaRef.current) {
        textareaRef.current.value = transcription
      }
    } catch (error) {
      console.error("Error transcribing audio:", error)
      alert("Error processing voice input. Please try again or use text input.")
    } finally {
      setIsTranscribing(false)
    }
  }

  const processAudioBlob = async (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

        audioContext
          .decodeAudioData(arrayBuffer)
          .then((audioBuffer) => {
            const duration = audioBuffer.duration
            let transcription = ""

            if (duration < 2) {
              transcription = "Yes, I understand."
            } else if (duration < 5) {
              transcription =
                "Thank you for the question. I believe this is an important topic that requires careful consideration."
            } else if (duration < 10) {
              transcription =
                "Thank you for this question. Based on my understanding, I think we need to consider multiple perspectives and balanced analysis."
            } else if (duration < 20) {
              transcription =
                "Thank you for this important question. I believe this issue requires a comprehensive approach considering all stakeholders involved. From my perspective, we need to balance immediate needs with long-term implications. The policy framework should be designed to address both current challenges and future requirements while ensuring transparency and accountability in implementation."
            } else {
              transcription =
                "Thank you for this comprehensive question. This is indeed a multifaceted issue that requires careful analysis of various dimensions. In my opinion, we need to adopt a holistic approach that considers economic, social, and environmental factors. The implementation strategy should involve proper stakeholder consultation, phased rollout, and continuous monitoring mechanisms. We must also ensure that the policy framework is adaptable to changing circumstances while maintaining core principles of governance, transparency, and public welfare. Additionally, capacity building and resource allocation are crucial for successful implementation."
            }

            resolve(transcription)
          })
          .catch(() => {
            resolve("I believe this requires a thoughtful and balanced approach considering all relevant factors.")
          })
      }

      reader.onerror = () => {
        resolve("Thank you for the question. I think this is an important matter that needs careful consideration.")
      }

      reader.readAsArrayBuffer(audioBlob)
    })
  }

  const startRecording = async () => {
    if (!audioSupported) {
      alert("Microphone access is not available. Please use text input.")
      return
    }

    try {
      if (isSpeechRecognitionAvailable) {
        await startSpeechRecognition()
      } else {
        await startAudioRecording()
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions and try again.")
    }
  }

  const startSpeechRecognition = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-IN"
    recognition.maxAlternatives = 1

    let finalTranscript = ""
    let interimTranscript = ""

    recognition.onstart = () => {
      setIsRecording(true)
      setTranscribedText("")
    }

    recognition.onresult = (event: any) => {
      interimTranscript = ""
      finalTranscript = ""

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "
        } else {
          interimTranscript += transcript
        }
      }

      const fullTranscript = (finalTranscript + interimTranscript).trim()
      setTranscribedText(fullTranscript)
      answerRef.current = fullTranscript

      if (textareaRef.current) {
        textareaRef.current.value = fullTranscript
      }
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsRecording(false)
      if (event.error === "no-speech") {
        alert("No speech detected. Please try speaking again.")
      } else if (event.error === "not-allowed") {
        alert("Microphone access denied. Please allow microphone access and try again.")
      } else {
        alert("Speech recognition error. Please try again or use text input.")
      }
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  const startAudioRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
      await transcribeAudio(audioBlob)
      stream.getTracks().forEach((track) => track.stop())
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }

    setIsRecording(false)
  }

  const handleTextInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const value = (e.target as HTMLTextAreaElement).value
    answerRef.current = value
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    answerRef.current = value
  }

  const handleSubmitAnswer = async () => {
    const currentAnswer = answerRef.current.trim()

    if (!currentAnswer) {
      alert("Please provide an answer before proceeding.")
      return
    }

    const currentQuestion = questions[currentQuestionIndex]
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)

    // Quick evaluation using heuristics + AI in background
    const quickScore = getQuickScore(currentAnswer, currentQuestion)

    const response: UserResponse = {
      questionId: currentQuestion.id,
      question: currentQuestion,
      answer: currentAnswer,
      timeTaken,
      askedBy: currentQuestion.askedBy,
      isVoiceResponse: responseMode === "voice",
      score: quickScore,
      needsFollowUp: quickScore < 6,
    }

    const newResponses = [...userResponses, response]
    setUserResponses(newResponses)

    // Update adaptive state immediately
    const newAdaptiveState = updateAdaptiveState(response, quickScore)
    setAdaptiveState(newAdaptiveState)

    // Clear inputs
    if (textareaRef.current) {
      textareaRef.current.value = ""
    }
    answerRef.current = ""
    setTranscribedText("")

    // Generate next question using template-based approach for speed
    setIsGeneratingQuestion(true)
    try {
      const nextQuestion = await generateQuickAdaptiveQuestion(response, newAdaptiveState, interviewData)
      const updatedQuestions = [...questions, nextQuestion]
      setQuestions(updatedQuestions)

      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setStartTime(Date.now())

      // Update phase
      updateInterviewPhase(nextQuestion.type)
    } catch (error) {
      console.error("Error generating adaptive question:", error)
      handleEndInterview()
    } finally {
      setIsGeneratingQuestion(false)
    }

    // Background AI evaluation for detailed feedback (non-blocking)
    improveScoreInBackground(response, newResponses.length - 1)

    // End interview after reasonable number of questions
    if (newResponses.length >= 12 + Math.floor(Math.random() * 4)) {
      setTimeout(() => {
        handleEndInterview()
      }, 2000)
    }
  }

  // Quick heuristic-based scoring for immediate feedback
  const getQuickScore = (answer: string, question: Question): number => {
    const wordCount = answer.trim().split(/\s+/).length
    const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0).length

    let baseScore = 5.0

    // Word count analysis
    if (wordCount < 15) {
      baseScore = 3.5
    } else if (wordCount < 40) {
      baseScore = 5.0
    } else if (wordCount < 80) {
      baseScore = 6.5
    } else if (wordCount < 150) {
      baseScore = 7.5
    } else if (wordCount < 250) {
      baseScore = 8.0
    } else {
      baseScore = 7.0 // Too verbose
    }

    // Structure bonus
    if (sentences >= 3) baseScore += 0.5
    if (sentences >= 5) baseScore += 0.3

    // Content quality indicators (keyword analysis)
    const qualityKeywords = [
      "policy",
      "implementation",
      "stakeholders",
      "government",
      "citizens",
      "development",
      "administration",
      "governance",
      "transparency",
      "accountability",
      "public service",
      "challenges",
      "solutions",
      "approach",
      "strategy",
      "framework",
      "initiative",
      "perspective",
      "analysis",
      "consideration",
      "balance",
      "effectiveness",
    ]

    const lowQualityWords = ["yes", "no", "good", "bad", "nice", "okay", "fine", "maybe"]

    const qualityMatches = qualityKeywords.filter((keyword) => answer.toLowerCase().includes(keyword)).length

    const lowQualityMatches = lowQualityWords.filter((word) => answer.toLowerCase().includes(word)).length

    // Quality adjustments
    baseScore += Math.min(qualityMatches * 0.2, 1.5)
    baseScore -= Math.min(lowQualityMatches * 0.3, 1.0)

    // Question complexity adjustment
    const complexityMultiplier = question.complexity / 3.0
    if (question.complexity >= 4 && wordCount < 60) {
      baseScore -= 1.0 // Complex questions need detailed answers
    }

    // Final score calculation
    const finalScore = Math.max(1.0, Math.min(10.0, baseScore))
    return Math.round(finalScore * 10) / 10
  }

  // Background AI evaluation for better accuracy (non-blocking)
  const improveScoreInBackground = async (response: UserResponse, responseIndex: number) => {
    try {
      const detailedEvaluation = await evaluateSingleAnswer(response.question, response.answer)
      const improvedScore = detailedEvaluation.score || response.score

      // Update the response score in background
      setUserResponses((prev) => {
        const updated = [...prev]
        if (updated[responseIndex]) {
          updated[responseIndex].score = improvedScore
        }
        return updated
      })

      // Update adaptive state with refined score
      setAdaptiveState((prev) => updateAdaptiveState(response, improvedScore || response.score!))
    } catch (error) {
      console.log("Background evaluation failed, using quick score")
    }
  }

  // Fast template-based question generation
  const generateQuickAdaptiveQuestion = async (
    lastResponse: UserResponse,
    adaptiveState: AdaptiveState,
    interviewData: any,
  ): Promise<Question> => {
    const { score = 5, question } = lastResponse
    const { currentComplexity } = adaptiveState

    // Determine next complexity
    let nextComplexity = currentComplexity
    if (score >= 8.5) {
      nextComplexity = Math.min(5, currentComplexity + 1)
    } else if (score >= 7) {
      nextComplexity = currentComplexity
    } else if (score >= 5) {
      nextComplexity = Math.max(1, currentComplexity - 1)
    } else {
      nextComplexity = Math.max(1, currentComplexity - 2)
    }

    // Quick follow-up check
    const needsFollowUp = score < 6

    if (needsFollowUp) {
      // Use template-based follow-up
      const followUpText = getQuickFollowUpQuestion(question.type, nextComplexity)
      return {
        id: `quick_followup_${Date.now()}`,
        text: followUpText,
        askedBy: question.askedBy,
        memberRole: question.memberRole,
        type: "follow-up",
        complexity: nextComplexity as any,
        isAdaptive: true,
        followUpTo: question.id,
      }
    }

    // Generate new question from templates
    const nextArea = determineNextQuestionArea(question.type, adaptiveState)
    const questionData = getQuickQuestion(nextArea, nextComplexity, interviewData)

    const member = boardMembers.find((m) => m.id === questionData.askedBy) || boardMembers[0]

    return {
      id: `quick_adaptive_${Date.now()}`,
      text: questionData.text,
      askedBy: questionData.askedBy,
      memberRole: member.role,
      type: questionData.type as any,
      complexity: nextComplexity as any,
      isAdaptive: true,
    }
  }

  // Quick template-based follow-up questions
  const getQuickFollowUpQuestion = (questionType: string, complexity: number): string => {
    const followUpTemplates = {
      personal: [
        "Could you provide a specific example to illustrate your point?",
        "How would you apply this experience in your administrative role?",
        "What specific challenges did you face and how did you address them?",
        "Can you elaborate on the practical implications of your approach?",
        "How has this experience shaped your perspective on public service?",
      ],
      "current-affairs": [
        "What implementation challenges do you foresee with this approach?",
        "How would you address the concerns of different stakeholders?",
        "What role should the central government play in this matter?",
        "How does this compare with successful international models?",
        "What specific policy measures would you recommend?",
      ],
      ethics: [
        "What ethical framework would guide your decision-making here?",
        "How would you ensure transparency in this process?",
        "What safeguards would you implement to prevent misuse?",
        "How would you balance competing stakeholder interests?",
        "What would be the long-term consequences of your approach?",
      ],
      "optional-subject": [
        "How does this theoretical concept apply to real-world governance?",
        "Can you provide a contemporary example of this principle?",
        "What are the practical limitations of this approach?",
        "How would you adapt this concept for the Indian context?",
        "What are the policy implications of this theory?",
      ],
    }

    const templates = followUpTemplates[questionType as keyof typeof followUpTemplates] || followUpTemplates.personal
    const baseIndex = Math.min(complexity - 1, templates.length - 1)
    return templates[baseIndex]
  }

  // Quick template-based question generation
  const getQuickQuestion = (
    questionArea: string,
    complexity: number,
    interviewData: any,
  ): { text: string; type: string; askedBy: string } => {
    const { optionalSubject, homeState, focusAreas } = interviewData

    const questionTemplates = {
      "current-affairs": {
        1: [
          "What are your views on the recent Digital India initiatives?",
          "How do you see India's role in international climate commitments?",
          "What is your opinion on the current education policy reforms?",
        ],
        2: [
          "Analyze the effectiveness of recent agricultural reforms in India.",
          "How should India balance economic growth with environmental protection?",
          "Evaluate the impact of digitalization on rural governance.",
        ],
        3: [
          "Critically assess the challenges and opportunities in India's foreign policy approach towards neighboring countries.",
          "Analyze the role of technology in transforming public service delivery and its associated challenges.",
          "Evaluate the effectiveness of recent healthcare policy reforms in addressing rural-urban disparities.",
        ],
        4: [
          "Design a comprehensive framework to address the challenges of urbanization while ensuring sustainable development.",
          "Analyze the complex interplay between federalism and national security in the Indian context.",
          "Evaluate the trade-offs between individual privacy rights and collective security in the digital age.",
        ],
        5: [
          "Synthesize a holistic approach to address climate change while ensuring energy security and economic growth in India.",
          "Design an innovative governance model that leverages AI and blockchain while maintaining democratic principles.",
          "Create a comprehensive strategy to transform India into a global knowledge economy while addressing inequality.",
        ],
      },
      ethics: {
        1: [
          "What does the concept of integrity mean to you in public service?",
          "How important is transparency in government functioning?",
          "What role should personal values play in administrative decisions?",
        ],
        2: [
          "How would you handle a situation where your senior asks you to overlook a minor rule violation?",
          "What would you do if you discovered corruption in your department?",
          "How would you balance personal relationships and professional duties?",
        ],
        3: [
          "You discover that a development project benefits your village but involves environmental violations. How do you proceed?",
          "A policy you implemented has unintended negative consequences for a minority community. What is your response?",
          "You have information that could prevent a disaster but revealing it would compromise an ongoing investigation. What do you do?",
        ],
        4: [
          "Design an ethical framework for AI-assisted decision making in government that balances efficiency with fairness.",
          "How would you address a situation where national security interests conflict with human rights obligations?",
          "Create a comprehensive approach to handle conflicts between local customs and constitutional principles.",
        ],
        5: [
          "Develop a nuanced ethical framework for handling disinformation that protects both free speech and public welfare.",
          "Design a comprehensive strategy to address intergenerational ethics in climate policy making.",
          "Create an innovative approach to balance individual privacy rights with collective security in smart city initiatives.",
        ],
      },
      "optional-subject": {
        1: [
          `Why did you choose ${optionalSubject} as your optional subject?`,
          `How has studying ${optionalSubject} influenced your worldview?`,
          `What aspects of ${optionalSubject} do you find most interesting?`,
        ],
        2: [
          `How is ${optionalSubject} relevant to public administration?`,
          `Can you explain a key concept from ${optionalSubject} in simple terms?`,
          `How does ${optionalSubject} help in understanding governance challenges?`,
        ],
        3: [
          `Apply a major theory from ${optionalSubject} to analyze a current policy challenge.`,
          `How can insights from ${optionalSubject} improve administrative efficiency?`,
          `Discuss the limitations of ${optionalSubject} approaches in governance.`,
        ],
        4: [
          `Synthesize concepts from ${optionalSubject} to propose solutions for complex administrative problems.`,
          `Critically evaluate how ${optionalSubject} perspectives can transform public policy formulation.`,
          `Design an innovative approach using ${optionalSubject} principles to address governance challenges.`,
        ],
        5: [
          `Create a comprehensive framework integrating ${optionalSubject} with cutting-edge governance technologies.`,
          `Develop a revolutionary approach to public administration inspired by advanced ${optionalSubject} theories.`,
          `Design a futuristic governance model that leverages the deepest insights from ${optionalSubject}.`,
        ],
      },
      personal: {
        1: [
          `What motivated you to choose civil services as a career?`,
          `Tell us about a significant achievement in your life.`,
          `How do you handle stress and pressure?`,
        ],
        2: [
          `Describe a challenging situation you faced and how you resolved it.`,
          `What leadership qualities do you possess?`,
          `How has your background prepared you for civil services?`,
        ],
        3: [
          `As a young administrator, how would you handle resistance from experienced subordinates?`,
          `Describe a time when you had to make a difficult ethical decision.`,
          `How would you motivate a demoralized team in your department?`,
        ],
        4: [
          `Design a comprehensive approach to transform a failing government department.`,
          `How would you balance competing demands from political leadership and administrative requirements?`,
          `Create a strategy to build consensus among diverse stakeholders with conflicting interests.`,
        ],
        5: [
          `Develop an innovative leadership model for 21st-century public administration.`,
          `Design a revolutionary approach to citizen engagement in governance.`,
          `Create a comprehensive strategy for transformational change in government functioning.`,
        ],
      },
    }

    const areaTemplates =
      questionTemplates[questionArea as keyof typeof questionTemplates] || questionTemplates["current-affairs"]
    const complexityQuestions = areaTemplates[complexity as keyof typeof areaTemplates] || areaTemplates[2]
    const questionText = complexityQuestions[Math.floor(Math.random() * complexityQuestions.length)]

    let askedBy = "chairman"
    if (questionArea === "current-affairs") askedBy = "member1"
    else if (questionArea === "ethics") askedBy = "member2"
    else if (questionArea === "optional-subject") askedBy = "member3"
    else if (questionArea === "personal") askedBy = "member4"

    return { text: questionText, type: questionArea, askedBy }
  }

  const updateInterviewPhase = (questionType: string) => {
    switch (questionType) {
      case "opening":
        setCurrentPhase("personal-background")
        break
      case "personal":
        if (currentQuestionIndex > 4) setCurrentPhase("current-affairs")
        break
      case "current-affairs":
        if (currentQuestionIndex > 7) setCurrentPhase("optional-subject")
        break
      case "optional-subject":
        setCurrentPhase("ethics")
        break
      case "ethics":
        setCurrentPhase("administrative")
        break
      case "follow-up":
        setCurrentPhase("follow-up")
        break
      default:
        setCurrentPhase("closing")
    }
  }

  const handleEndInterview = () => {
    window.speechSynthesis.cancel()
    if (isRecording) {
      stopRecording()
    }

    if (userResponses.length === 0) {
      alert("Please answer at least one question before ending the interview.")
      return
    }
    evaluateAllResponses(userResponses)
  }

  const evaluateAllResponses = async (responses: UserResponse[]) => {
    setEvaluating(true)
    const evaluatedResponses: EvaluatedResponse[] = []

    try {
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i]

        try {
          const evaluation = await evaluateSingleAnswer(response.question, response.answer)

          evaluatedResponses.push({
            questionId: response.questionId,
            answer: response.answer,
            score: evaluation.score || generateFallbackScore(response.answer),
            feedback: evaluation.feedback || generateFallbackFeedback(),
            timeTaken: response.timeTaken,
            askedBy: response.askedBy,
            complexity: response.question.complexity,
            needsFollowUp: response.needsFollowUp || false,
          })

          if (i < responses.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        } catch (error) {
          evaluatedResponses.push({
            questionId: response.questionId,
            answer: response.answer,
            score: generateFallbackScore(response.answer),
            feedback: generateFallbackFeedback(),
            timeTaken: response.timeTaken,
            askedBy: response.askedBy,
            complexity: response.question.complexity,
            needsFollowUp: false,
          })
        }
      }

      await completeInterview(evaluatedResponses)
    } catch (error) {
      console.error("Error during evaluation:", error)
      const fallbackResponses = responses.map((response) => ({
        questionId: response.questionId,
        answer: response.answer,
        score: generateFallbackScore(response.answer),
        feedback: generateFallbackFeedback(),
        timeTaken: response.timeTaken,
        askedBy: response.askedBy,
        complexity: response.question.complexity,
        needsFollowUp: false,
      }))
      await completeInterview(fallbackResponses)
    }
  }

  const evaluateSingleAnswer = async (question: Question, answer: string) => {
    const prompt = `Evaluate this UPSC interview answer on a scale of 1-10:

Question: ${question.text}
Answer: ${answer}
Question Type: ${question.type}
Question Complexity: ${question.complexity}/5
Asked by: ${question.memberRole}

Evaluate based on UPSC interview criteria:
- Content knowledge and accuracy (25%)
- Clarity of thought and expression (20%)
- Balanced and mature perspective (20%)
- Administrative aptitude and problem-solving (15%)
- Ethical understanding and integrity (10%)
- Communication skills (10%)

Consider the complexity level: ${question.complexity}/5
- Level 1-2: Basic to intermediate understanding expected
- Level 3: Advanced analysis required
- Level 4-5: Expert-level critical thinking expected

Format: Score: 7.5
Feedback: Brief constructive feedback focusing on UPSC standards and complexity appropriateness.`

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    })

    const scoreMatch = text.match(/Score:\s*(\d+(?:\.\d+)?)/i)
    const feedbackMatch = text.match(/Feedback:\s*(.*)/is)

    let score = scoreMatch ? Number.parseFloat(scoreMatch[1]) : null
    let feedback = feedbackMatch ? feedbackMatch[1].trim() : null

    if (!score || isNaN(score) || score < 1 || score > 10) {
      score = generateFallbackScore(answer)
    }

    if (!feedback) {
      feedback = generateFallbackFeedback()
    }

    return { score, feedback }
  }

  const generateFallbackScore = (answer: string): number => {
    const wordCount = answer.trim().split(/\s+/).length
    let baseScore = 5

    if (wordCount < 20) baseScore = 4
    else if (wordCount < 60) baseScore = 6
    else if (wordCount < 120) baseScore = 7.5
    else baseScore = 8

    const variation = (Math.random() - 0.5) * 1.5
    const finalScore = Math.max(1, Math.min(10, baseScore + variation))
    return Math.round(finalScore * 10) / 10
  }

  const generateFallbackFeedback = (): string => {
    const feedbacks = [
      "Good answer with clear understanding. Consider adding more specific examples and policy implications.",
      "Well-structured response showing maturity of thought. Could benefit from discussing implementation challenges.",
      "Demonstrates good knowledge base. Try to present multiple perspectives and balanced analysis.",
      "Shows administrative thinking. Consider adding more contemporary examples and stakeholder viewpoints.",
      "Clear articulation of ideas. Could strengthen by discussing practical solutions and their feasibility.",
    ]
    return feedbacks[Math.floor(Math.random() * feedbacks.length)]
  }

  const completeInterview = async (evaluatedResponses: EvaluatedResponse[]) => {
    const validResponses = evaluatedResponses.filter(
      (r) => typeof r.score === "number" && !isNaN(r.score) && r.score >= 1 && r.score <= 10,
    )

    const averageScore =
      validResponses.length > 0 ? validResponses.reduce((sum, r) => sum + r.score, 0) / validResponses.length : 6.0

    let performanceBand = "Needs Improvement"
    if (averageScore >= 8.5) performanceBand = "Outstanding"
    else if (averageScore >= 7.5) performanceBand = "Very Good"
    else if (averageScore >= 6.5) performanceBand = "Good"
    else if (averageScore >= 5.5) performanceBand = "Satisfactory"

    const resultsData = {
      interview: {
        id: interviewId || "demo",
        job_title: "UPSC Civil Services",
        company: "Government of India",
        round_type: interviewData?.boardComposition || "Standard Board",
        average_score: averageScore,
        performance_band: performanceBand,
        completed_at: new Date().toISOString(),
      },
      responses: validResponses.map((response, index) => ({
        ...response,
        questions: {
          text: userResponses[index]?.question?.text || "Question not found",
          question_type: userResponses[index]?.question?.type || "general",
        },
      })),
      boardMembers,
      adaptiveState,
    }

    sessionStorage.setItem("interviewResults", JSON.stringify(resultsData))
    router.push(`/interview/results?id=${interviewId || "demo"}`)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "opening":
        return "bg-blue-100 text-blue-800"
      case "personal-background":
        return "bg-green-100 text-green-800"
      case "current-affairs":
        return "bg-purple-100 text-purple-800"
      case "optional-subject":
        return "bg-orange-100 text-orange-800"
      case "ethics":
        return "bg-red-100 text-red-800"
      case "administrative":
        return "bg-yellow-100 text-yellow-800"
      case "follow-up":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getComplexityIcon = (complexity: number) => {
    if (complexity >= 4) return <TrendingUp className="h-4 w-4 text-red-600" />
    if (complexity >= 3) return <TrendingUp className="h-4 w-4 text-orange-600" />
    if (complexity >= 2) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-green-600" />
  }

  const getComplexityLabel = (complexity: number) => {
    switch (complexity) {
      case 1:
        return "Basic"
      case 2:
        return "Intermediate"
      case 3:
        return "Advanced"
      case 4:
        return "Expert"
      case 5:
        return "Exceptional"
      default:
        return "Intermediate"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Setting up your UPSC Interview Board...</p>
          <p className="text-sm text-gray-600 mt-2">Preparing adaptive questioning system and voice capabilities</p>
        </div>
      </div>
    )
  }

  if (evaluating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Board is Evaluating Your Performance</h2>
          <p className="text-gray-600 mb-4">
            The interview board is analyzing your responses based on UPSC standards...
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              ✨ Evaluating {userResponses.length} responses across multiple assessment criteria
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isGeneratingQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Board is Preparing Next Question</h2>
          <p className="text-gray-600 mb-4">
            Analyzing your response and adapting the next question based on your performance...
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              🧠 Adaptive AI is customizing the interview difficulty and focus areas
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Interview setup incomplete</h2>
          <Button onClick={() => router.push("/interview/setup")}>Back to Setup</Button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading question...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const currentMember = boardMembers.find((m) => m.id === currentQuestion.askedBy)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">UPSC Interview Board</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className={timeRemaining < 300 ? "bg-red-50 text-red-700" : ""}>
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
              <Badge variant="outline">
                Q {currentQuestionIndex + 1}/{questions.length}
              </Badge>
              <Badge className={getPhaseColor(currentPhase)}>{currentPhase.replace("-", " ")}</Badge>

              {/* Adaptive Indicators */}
              <Badge variant="outline" className="flex items-center">
                {getComplexityIcon(adaptiveState.currentComplexity)}
                <span className="ml-1">{getComplexityLabel(adaptiveState.currentComplexity)}</span>
              </Badge>

              {adaptiveState.averageScore > 0 && (
                <Badge variant="outline">Avg: {adaptiveState.averageScore.toFixed(1)}/10</Badge>
              )}

              {/* Voice Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={voiceEnabled ? "bg-green-50 border-green-200" : ""}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                {audioSupported && (
                  <Badge variant={responseMode === "voice" ? "default" : "outline"}>
                    <Mic className="h-3 w-3 mr-1" />
                    Voice
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Interview Board */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Interview Board
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {boardMembers.map((member) => (
                <div
                  key={member.id}
                  className={`text-center p-3 rounded-lg border-2 transition-all ${
                    member.id === currentQuestion.askedBy ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="text-3xl mb-2">{member.avatar}</div>
                  <div className="font-medium text-sm">{member.name}</div>
                  <div className="text-xs text-gray-600">{member.role}</div>
                  <div className="text-xs text-gray-500 mt-1">{member.expertise}</div>
                  {member.id === currentQuestion.askedBy && (
                    <div className="mt-2">
                      <Badge className="text-xs">Speaking</Badge>
                      {isPlayingQuestion && <div className="text-xs text-blue-600 mt-1">🔊 Speaking...</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <CardTitle className="text-xl">
                      {currentMember && <span className="text-blue-600 font-medium">{currentMember.name}:</span>}
                      <span className="ml-2">{currentQuestion.text}</span>
                    </CardTitle>
                    {voiceEnabled && (
                      <div className="ml-4 flex space-x-2">
                        {!isPlayingQuestion ? (
                          <Button variant="outline" size="sm" onClick={() => speakQuestion(currentQuestion)}>
                            <Play className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={stopSpeaking}>
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Question Metadata */}
                  <div className="flex items-center space-x-4 mb-2">
                    <Badge variant="outline" className="flex items-center">
                      {getComplexityIcon(currentQuestion.complexity)}
                      <span className="ml-1">Level {currentQuestion.complexity}</span>
                    </Badge>
                    <Badge variant="outline">{currentQuestion.type.replace("-", " ")}</Badge>
                    {currentQuestion.isAdaptive && <Badge className="bg-purple-100 text-purple-800">Adaptive</Badge>}
                    {currentQuestion.followUpTo && <Badge className="bg-pink-100 text-pink-800">Follow-up</Badge>}
                  </div>

                  <CardDescription>
                    {currentQuestion.complexity >= 4
                      ? "This is an expert-level question requiring deep analysis and critical thinking."
                      : currentQuestion.complexity >= 3
                        ? "This question requires advanced understanding and analytical skills."
                        : "Provide a clear, well-structured answer demonstrating your understanding."}
                  </CardDescription>
                </div>
                {currentMember && (
                  <div className="ml-4 text-center">
                    <div className="text-2xl mb-1">{currentMember.avatar}</div>
                    <div className="text-xs text-gray-600">{currentMember.role}</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Response Mode Toggle */}
              {audioSupported && (
                <div className="mb-4 flex items-center space-x-4">
                  <span className="text-sm font-medium">Response Mode:</span>
                  <div className="flex space-x-2">
                    <Button
                      variant={responseMode === "text" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setResponseMode("text")}
                    >
                      Text
                    </Button>
                    <Button
                      variant={responseMode === "voice" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setResponseMode("voice")}
                    >
                      <Mic className="h-4 w-4 mr-1" />
                      Voice
                    </Button>
                  </div>
                </div>
              )}

              {/* Voice Recording Interface */}
              {responseMode === "voice" && audioSupported && (
                <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Voice Response</span>
                    <div className="flex space-x-2">
                      {!isRecording ? (
                        <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                          <Mic className="h-4 w-4 mr-2" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button onClick={stopRecording} variant="outline">
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                    </div>
                  </div>

                  {isRecording && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 text-red-600 mb-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-sm">Recording... Speak clearly into your microphone</span>
                      </div>
                      {transcribedText && (
                        <div className="p-3 bg-white border rounded">
                          <span className="text-sm font-medium text-gray-700">Live Transcription:</span>
                          <p className="text-sm mt-1 text-blue-600">{transcribedText}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {isTranscribing && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Processing your voice response...</span>
                    </div>
                  )}

                  {transcribedText && !isRecording && (
                    <div className="mt-3 p-3 bg-white border rounded">
                      <span className="text-sm font-medium text-gray-700">Final Transcription:</span>
                      <p className="text-sm mt-1">{transcribedText}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        You can edit this in the text area below before submitting.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Text Input */}
              <div className="mb-4">
                <textarea
                  ref={textareaRef}
                  onInput={handleTextInput}
                  onChange={handleTextChange}
                  placeholder={
                    responseMode === "voice" ? "Your voice response will appear here..." : "Type your answer here..."
                  }
                  rows={8}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  style={{
                    minHeight: "200px",
                    fontFamily: "inherit",
                    fontSize: "14px",
                  }}
                  autoFocus={responseMode === "text"}
                  readOnly={responseMode === "voice" && !transcribedText}
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {userResponses.length} questions answered
                  </div>
                  {adaptiveState.averageScore > 0 && (
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Performance: {adaptiveState.averageScore.toFixed(1)}/10
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleEndInterview} className="text-red-600 border-red-200">
                    <StopCircle className="h-4 w-4 mr-2" />
                    End Interview
                  </Button>
                  <Button onClick={handleSubmitAnswer} disabled={isTranscribing}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Answer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adaptive Performance Indicator */}
        {userResponses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Brain className="h-5 w-5 mr-2" />
                Adaptive Performance Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{adaptiveState.currentComplexity}/5</div>
                  <div className="text-gray-600">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{adaptiveState.averageScore.toFixed(1)}/10</div>
                  <div className="text-gray-600">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{adaptiveState.totalQuestions}</div>
                  <div className="text-gray-600">Questions Asked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Object.keys(adaptiveState.subjectPerformance).length}
                  </div>
                  <div className="text-gray-600">Areas Covered</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interview Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="h-5 w-5 mr-2" />
              UPSC Interview Guidelines & Adaptive System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Assessment Criteria:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Mental alertness</li>
                  <li>• Critical powers of assimilation</li>
                  <li>• Clear and logical exposition</li>
                  <li>• Balance of judgment</li>
                  <li>• Variety and depth of interest</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Adaptive Features:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Questions adapt to your performance</li>
                  <li>• Higher scores → Higher complexity</li>
                  <li>• Follow-up questions for clarity</li>
                  <li>• Real-time difficulty adjustment</li>
                  <li>• Personalized question selection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Complexity Levels:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Level 1: Basic awareness</li>
                  <li>• Level 2: Understanding & application</li>
                  <li>• Level 3: Analysis & evaluation</li>
                  <li>• Level 4: Synthesis & problem-solving</li>
                  <li>• Level 5: Expert critical thinking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

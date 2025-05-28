"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VolumeX, Loader2, Play, Pause } from "lucide-react"
import { useSpeech } from "@/lib/speech-utils"

interface AIVoiceAssistantProps {
  boardMember: {
    id: string
    name: string
    voice: string
    avatar: string
  }
  question: string
  enabled?: boolean
  autoSpeak?: boolean
  onSpeakingStateChange?: (isSpeaking: boolean) => void
}

export function AIVoiceAssistant({
  boardMember,
  question,
  enabled = true,
  autoSpeak = false,
  onSpeakingStateChange,
}: AIVoiceAssistantProps) {
  const speech = useSpeech()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const support = speech.isSupported()
    setSupported(support.synthesis)
  }, [speech])

  useEffect(() => {
    if (autoSpeak && enabled && supported && question) {
      speakQuestion()
    }
  }, [question, autoSpeak, enabled, supported])

  useEffect(() => {
    // Check speaking state periodically
    const interval = setInterval(() => {
      const speaking = speech.isSpeaking()
      if (speaking !== isSpeaking) {
        setIsSpeaking(speaking)
        onSpeakingStateChange?.(speaking)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isSpeaking, speech, onSpeakingStateChange])

  const speakQuestion = () => {
    if (!supported || !enabled || !question) return

    setIsLoading(true)
    setError(null)

    // Add natural pauses and emphasis for better delivery
    const enhancedQuestion = enhanceQuestionForSpeech(question, boardMember.name)

    const success = speech.speak(
      enhancedQuestion,
      {
        voice: boardMember.voice as any,
        rate: 0.9,
        pitch: 1.0,
        volume: 0.8,
      },
      () => {
        setIsSpeaking(false)
        setIsLoading(false)
        onSpeakingStateChange?.(false)
      },
      (error) => {
        setError(error)
        setIsSpeaking(false)
        setIsLoading(false)
        onSpeakingStateChange?.(false)
      },
    )

    if (success) {
      setIsSpeaking(true)
      setIsLoading(false)
      onSpeakingStateChange?.(true)
    } else {
      setIsLoading(false)
    }
  }

  const stopSpeaking = () => {
    speech.stopSpeaking()
    setIsSpeaking(false)
    onSpeakingStateChange?.(false)
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speakQuestion()
    }
  }

  if (!supported) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-3">
          <div className="flex items-center text-sm text-yellow-800">
            <VolumeX className="h-4 w-4 mr-2" />
            Voice synthesis not available in this browser
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-colors ${isSpeaking ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{boardMember.avatar}</div>
            <div>
              <div className="font-medium text-sm">{boardMember.name}</div>
              <div className="flex items-center gap-2">
                {isSpeaking && (
                  <Badge variant="outline" className="text-xs animate-pulse">
                    Speaking...
                  </Badge>
                )}
                {isLoading && (
                  <Badge variant="outline" className="text-xs">
                    Loading...
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleSpeaking} disabled={!enabled || isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSpeaking ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Speak
                </>
              )}
            </Button>
          </div>
        </div>

        {error && <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">{error}</div>}

        {isSpeaking && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-4 bg-blue-500 rounded animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-blue-700">AI is speaking...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function enhanceQuestionForSpeech(question: string, memberName: string): string {
  // Add natural pauses and emphasis
  let enhanced = question

  // Add pause after greetings
  enhanced = enhanced.replace(/Good morning[!.]/, "Good morning. ")
  enhanced = enhanced.replace(/Good afternoon[!.]/, "Good afternoon. ")

  // Add pauses after question starters
  enhanced = enhanced.replace(/Tell us about/, "Tell us about... ")
  enhanced = enhanced.replace(/What do you think/, "What do you think... ")
  enhanced = enhanced.replace(/How would you/, "How would you... ")
  enhanced = enhanced.replace(/Can you explain/, "Can you explain... ")

  // Add emphasis to important words
  enhanced = enhanced.replace(/civil services/gi, "civil services")
  enhanced = enhanced.replace(/governance/gi, "governance")
  enhanced = enhanced.replace(/administration/gi, "administration")

  // Add natural breathing pauses
  enhanced = enhanced.replace(/\. /g, ". ... ")
  enhanced = enhanced.replace(/\? /g, "? ... ")
  enhanced = enhanced.replace(/, /g, ", ")

  return enhanced
}

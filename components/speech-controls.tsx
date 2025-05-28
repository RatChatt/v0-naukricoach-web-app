"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react"
import { useSpeech } from "@/lib/speech-utils"

interface SpeechControlsProps {
  onTranscriptChange: (transcript: string, isFinal: boolean) => void
  onRecordingStateChange: (isRecording: boolean) => void
  disabled?: boolean
  className?: string
}

export function SpeechControls({
  onTranscriptChange,
  onRecordingStateChange,
  disabled = false,
  className = "",
}: SpeechControlsProps) {
  const speech = useSpeech()
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [supported, setSupported] = useState({ recognition: false, synthesis: false })

  useEffect(() => {
    const support = speech.isSupported()
    setSupported(support)
  }, [speech])

  const startRecording = () => {
    if (disabled || !supported.recognition) return

    setError(null)
    setInterimTranscript("")

    const success = speech.startListening(
      (transcript, isFinal) => {
        if (isFinal) {
          setIsTranscribing(true)
          onTranscriptChange(transcript, true)
          setInterimTranscript("")

          // Simulate processing delay
          setTimeout(() => {
            setIsTranscribing(false)
          }, 1000)
        } else {
          setInterimTranscript(transcript)
          onTranscriptChange(transcript, false)
        }
      },
      (error) => {
        setError(error)
        setIsRecording(false)
        onRecordingStateChange(false)
      },
      () => {
        setIsRecording(false)
        onRecordingStateChange(false)
        setInterimTranscript("")
      },
    )

    if (success) {
      setIsRecording(true)
      onRecordingStateChange(true)
    }
  }

  const stopRecording = () => {
    speech.stopListening()
    setIsRecording(false)
    onRecordingStateChange(false)
    setInterimTranscript("")
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  if (!supported.recognition) {
    return (
      <Card className={`border-yellow-200 bg-yellow-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Speech Recognition Not Available</p>
              <p className="text-xs text-yellow-700">
                Your browser doesn't support speech recognition. Please use Chrome or Edge for voice features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          onClick={toggleRecording}
          disabled={disabled || isTranscribing}
          className={isRecording ? "animate-pulse" : ""}
        >
          {isTranscribing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : isRecording ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Record Answer
            </>
          )}
        </Button>

        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-600 font-medium">Recording...</span>
          </div>
        )}
      </div>

      {interimTranscript && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">
                Live
              </Badge>
              <p className="text-sm text-blue-800 italic">{interimTranscript}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

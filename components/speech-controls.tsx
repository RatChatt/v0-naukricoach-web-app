"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Loader2, AlertCircle, RotateCcw } from "lucide-react"
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
  const [finalTranscript, setFinalTranscript] = useState("")
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
    setFinalTranscript("")

    // Reset the accumulated transcript in the speech manager before starting
    speech.stopListening() // This ensures we stop any existing session

    const success = speech.startListening(
      (transcript, isFinal) => {
        if (isFinal) {
          setFinalTranscript(transcript)
          setInterimTranscript("")
          onTranscriptChange(transcript, true)

          // Brief processing indication
          setIsTranscribing(true)
          setTimeout(() => {
            setIsTranscribing(false)
          }, 500)
        } else {
          setInterimTranscript(transcript)
          onTranscriptChange(transcript, false)
        }
      },
      (error) => {
        // Filter out common recoverable errors
        if (!error.includes("no-speech") && !error.includes("audio-capture")) {
          setError(error)
        }
        // Don't stop recording for recoverable errors
        if (error.includes("network") || error.includes("not-allowed")) {
          setIsRecording(false)
          onRecordingStateChange(false)
        }
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

  const clearTranscript = () => {
    setFinalTranscript("")
    setInterimTranscript("")
    onTranscriptChange("", true)
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

        {(finalTranscript || interimTranscript) && (
          <Button variant="ghost" size="sm" onClick={clearTranscript} disabled={isRecording} title="Clear transcript">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}

        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-red-600 font-medium">Listening...</span>
          </div>
        )}
      </div>

      {/* Show final transcript */}
      {finalTranscript && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                Captured
              </Badge>
              <p className="text-sm text-green-800">{finalTranscript}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show interim transcript */}
      {interimTranscript && isRecording && (
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

      {/* Helpful tip */}
      {isRecording && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-2">
            <p className="text-xs text-gray-600">
              💡 Tip: You can pause while speaking. Your previous words will be preserved.
            </p>
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

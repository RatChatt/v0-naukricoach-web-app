// Speech recognition and synthesis utilities
export class SpeechManager {
  private recognition: any | null = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private accumulatedTranscript = ""
  private restartTimeout: NodeJS.Timeout | null = null

  constructor() {
    this.initializeSpeechRecognition()
    this.initializeSpeechSynthesis()
  }

  private initializeSpeechRecognition() {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = "en-IN" // Indian English for UPSC context
        this.recognition.maxAlternatives = 1
      }
    }
  }

  private initializeSpeechSynthesis() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis
    }
  }

  // Speech Recognition Methods
  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void,
  ): boolean {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser")
      return false
    }

    if (this.isListening) {
      return false
    }

    // Reset accumulated transcript when starting fresh
    this.accumulatedTranscript = ""

    this.recognition.onresult = (event) => {
      // Get only the latest results instead of processing all results each time
      const latestResult = event.results[event.results.length - 1]

      if (latestResult.isFinal) {
        // For final results, add to accumulated transcript without duplication
        const finalText = latestResult[0].transcript.trim()
        // Only add if it's not already the last part of the accumulated transcript
        if (!this.accumulatedTranscript.endsWith(finalText)) {
          this.accumulatedTranscript += (this.accumulatedTranscript ? " " : "") + finalText
        }
        // Send the accumulated transcript as final
        onResult(this.accumulatedTranscript, true)
      } else {
        // For interim results, just show the latest interim + accumulated
        const interimText = latestResult[0].transcript.trim()
        const fullInterim = this.accumulatedTranscript + (this.accumulatedTranscript ? " " : "") + interimText
        onResult(fullInterim, false)
      }
    }

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)

      // Handle specific errors differently
      if (event.error === "no-speech" || event.error === "audio-capture") {
        // These are recoverable errors - try to restart
        this.restartRecognition(onResult, onError, onEnd)
      } else {
        onError(`Speech recognition error: ${event.error}`)
        this.isListening = false
      }
    }

    this.recognition.onend = () => {
      // If we're still supposed to be listening, restart recognition
      if (this.isListening) {
        this.restartRecognition(onResult, onError, onEnd)
      } else {
        onEnd()
      }
    }

    this.recognition.onstart = () => {
      this.isListening = true
    }

    try {
      this.recognition.start()
      return true
    } catch (error) {
      onError("Failed to start speech recognition")
      return false
    }
  }

  private restartRecognition(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void,
  ) {
    // Clear any existing restart timeout
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout)
    }

    // Restart after a short delay to avoid rapid restarts
    this.restartTimeout = setTimeout(() => {
      if (this.isListening && this.recognition) {
        try {
          this.recognition.start()
        } catch (error) {
          console.error("Failed to restart recognition:", error)
          // If restart fails, try one more time after a longer delay
          setTimeout(() => {
            if (this.isListening && this.recognition) {
              try {
                this.recognition.start()
              } catch (finalError) {
                onError("Speech recognition failed to restart")
                this.isListening = false
              }
            }
          }, 1000)
        }
      }
    }, 100)
  }

  stopListening() {
    this.isListening = false

    // Clear restart timeout
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout)
      this.restartTimeout = null
    }

    if (this.recognition) {
      this.recognition.stop()
    }

    // Reset accumulated transcript
    this.accumulatedTranscript = ""
  }

  isCurrentlyListening(): boolean {
    return this.isListening
  }

  // Get the current accumulated transcript
  getAccumulatedTranscript(): string {
    return this.accumulatedTranscript
  }

  // Speech Synthesis Methods
  speak(
    text: string,
    options: {
      voice?: "male-formal" | "female-professional" | "male-academic" | "female-expert" | "male-experienced"
      rate?: number
      pitch?: number
      volume?: number
    } = {},
    onEnd?: () => void,
    onError?: (error: string) => void,
  ): boolean {
    if (!this.synthesis) {
      onError?.("Speech synthesis not supported in this browser")
      return false
    }

    // Stop any current speech
    this.stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(text)

    // Configure voice based on board member type
    const voices = this.synthesis.getVoices()
    const voiceConfig = this.getVoiceConfig(options.voice || "male-formal")

    // Try to find a suitable voice
    const selectedVoice =
      voices.find(
        (voice) =>
          voice.lang.includes("en") &&
          (voiceConfig.gender === "male"
            ? voice.name.toLowerCase().includes("male")
            : voice.name.toLowerCase().includes("female")),
      ) ||
      voices.find((voice) => voice.lang.includes("en")) ||
      voices[0]

    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    utterance.rate = options.rate || voiceConfig.rate
    utterance.pitch = options.pitch || voiceConfig.pitch
    utterance.volume = options.volume || 0.8

    utterance.onend = () => {
      this.currentUtterance = null
      onEnd?.()
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error)
      // Don't show error for interrupted speech - it's normal when user stops it
      if (event.error !== "interrupted") {
        onError?.(`Speech synthesis error: ${event.error}`)
      }
      this.currentUtterance = null
    }

    this.currentUtterance = utterance
    this.synthesis.speak(utterance)
    return true
  }

  private getVoiceConfig(voiceType: string) {
    const configs = {
      "male-formal": { gender: "male", rate: 0.9, pitch: 0.8 },
      "female-professional": { gender: "female", rate: 0.95, pitch: 1.0 },
      "male-academic": { gender: "male", rate: 0.85, pitch: 0.9 },
      "female-expert": { gender: "female", rate: 0.9, pitch: 1.1 },
      "male-experienced": { gender: "male", rate: 0.8, pitch: 0.7 },
    }
    return configs[voiceType as keyof typeof configs] || configs["male-formal"]
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.currentUtterance = null
    }
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false
  }

  // Utility methods
  isSupported(): { recognition: boolean; synthesis: boolean } {
    return {
      recognition: !!this.recognition,
      synthesis: !!this.synthesis,
    }
  }

  // Get available voices for debugging
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis ? this.synthesis.getVoices() : []
  }
}

// Singleton instance
let speechManager: SpeechManager | null = null

export function getSpeechManager(): SpeechManager {
  if (!speechManager) {
    speechManager = new SpeechManager()
  }
  return speechManager
}

// React hook for speech functionality
export function useSpeech() {
  const speechManager = getSpeechManager()

  return {
    startListening: speechManager.startListening.bind(speechManager),
    stopListening: speechManager.stopListening.bind(speechManager),
    isListening: speechManager.isCurrentlyListening.bind(speechManager),
    speak: speechManager.speak.bind(speechManager),
    stopSpeaking: speechManager.stopSpeaking.bind(speechManager),
    isSpeaking: speechManager.isSpeaking.bind(speechManager),
    isSupported: speechManager.isSupported.bind(speechManager),
    getAvailableVoices: speechManager.getAvailableVoices.bind(speechManager),
    getAccumulatedTranscript: speechManager.getAccumulatedTranscript.bind(speechManager),
  }
}
